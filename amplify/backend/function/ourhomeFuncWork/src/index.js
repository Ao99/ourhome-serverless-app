const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider({ region: process.env.REGION });

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    AWS.config.update({ region: process.env.REGION });

    let body;
    let statusCode = '200';
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    };
    let tableName = "ourhomeDbWork";

    try {
        if(process.env.ENV && process.env.ENV !== "NONE") {
          tableName = tableName + '-' + process.env.ENV;
        }
        var now = new Date(new Date().getTime() - (300 * 60000)).toISOString();
        var month = event.pathParameters.month;
        var reqBody = event.body ? JSON.parse(event.body) : '{}';

        switch (event.httpMethod) {
            case 'GET':
                if(month == 'all') {
                    body = await dynamo.scan(
                        {
                            TableName: tableName,
                        }
                    ).promise();
                } else {
                    body = await dynamo.get(
                        {
                            TableName: tableName,
                            Key: { 'month': month }
                        }
                    ).promise();
                }
                break;
            case 'POST':
                // Get the unique ID given by cognito for this user, it is passed to lambda as part of a large string in event.requestContext.identity.cognitoAuthenticationProvider
                var userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(':')[2];
                var params = {
                    UserPoolId: process.env.USERPOOLID,
                    Filter: `sub="${userSub}"`,
                    Limit: 1
                };
                var cognitoRes = await cognito.listUsers(params).promise();
                var user = cognitoRes.Users[0];

                body = await dynamo.update(
                        {
                            TableName: tableName,
                            Key: {
                                'month': parseInt(month, 10),
                                'day': parseInt(reqBody.day, 10)
                            },
                            UpdateExpression: `set ${reqBody.workType} = :username, updatedAt = :timeStamp`,
                            ExpressionAttributeValues:{
                                ":username": user.Username,
                                ":timeStamp": now
                            },
                            ReturnValues:"UPDATED_NEW"
                        }
                    ).promise();
                break;
            case 'DELETE':
                body = await dynamo.update(
                        {
                            TableName: tableName,
                            Key: {
                                'month': parseInt(month, 10),
                                'day': parseInt(reqBody.day, 10)
                            },
                            UpdateExpression: `remove ${reqBody.workType}`,
                            ReturnValues:"UPDATED_NEW"
                        }
                    ).promise();
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
        console.log(err);
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};