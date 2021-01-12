const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider({ region: process.env.REGION });

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    AWS.config.update({ region: process.env.REGION });

    let tableName = 'ourhomeDbSetting';
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    };

    try {
        if(process.env.ENV && process.env.ENV !== 'NONE') {
          tableName = tableName + '-' + process.env.ENV;
        }
        var type = event.pathParameters.type;

        switch (event.httpMethod) {
            case 'GET':
                body = await dynamo.query(
                    {
                        TableName: tableName,
                        KeyConditionExpression: '#type = :type',
                        ExpressionAttributeNames: { '#type': 'type' },
                        ExpressionAttributeValues:{ ':type':  type}
                    }
                ).promise();
                break;
            case 'POST':
                var reqBody = JSON.parse(event.body);
                var username = reqBody.isForAllUsers ? 'allUsers' : (await getUser(event)).Username;
                var now = new Date(new Date().getTime() - (300 * 60000)).toISOString();

                body = await dynamo.update(
                    {
                        TableName: tableName,
                        Key: {
                            'type': type,
                        },
                        UpdateExpression: `set ${username} = :settingValue, updatedAt = :timeStamp`,
                        ExpressionAttributeValues:{
                            ':settingValue': reqBody.settingValue,
                            ':timeStamp': now
                        },
                        ReturnValues:'UPDATED_NEW'
                    }
                ).promise();
                break;
            default:
                throw new Error(`Unsupported method '${event.httpMethod}'`);
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

async function getUser(event) {
    // Get the unique ID given by cognito for this user, it is passed to lambda as part of a large string in event.requestContext.identity.cognitoAuthenticationProvider
    var userSub = event.requestContext.identity.cognitoAuthenticationProvider.split(':')[2];
    var params = {
        UserPoolId: process.env.USERPOOLID,
        Filter: `sub='${userSub}'`,
        Limit: 1
    };
    var cognitoRes = await cognito.listUsers(params).promise();
    return cognitoRes.Users[0];
}