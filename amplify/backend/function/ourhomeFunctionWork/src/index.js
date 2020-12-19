const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    AWS.config.update({ region: process.env.TABLE_REGION });

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };
    let tableName = "ourhomeDbWork";
    if(process.env.ENV && process.env.ENV !== "NONE") {
      tableName = tableName + '-' + process.env.ENV;
    }

    try {
        var date = event.pathParameters.date;
        var reqBody = event.body ? JSON.parse(event.body) : '{}';

        switch (event.httpMethod) {
            case 'GET':
                body = await dynamo.get(
                        {
                            TableName: tableName,
                            Key: { 'date': date }
                        }
                    ).promise();
                break;
            case 'POST':
                body = await dynamo.update(
                        {
                            TableName: tableName,
                            Key: { 'date': date },
                            UpdateExpression: `set ${reqBody.key} = :value`,
                            ExpressionAttributeValues:{
                                ":value": reqBody.value
                            },
                            ReturnValues:"UPDATED_NEW"
                        }
                    ).promise();
                break;
            case 'DELETE':
                body = await dynamo.update(
                        {
                            TableName: tableName,
                            Key: { 'date': date },
                            UpdateExpression: `remove ${reqBody.key}`,
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
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
