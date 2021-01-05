const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    AWS.config.update({ region: process.env.REGION });

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    };

    try {
        switch (event.httpMethod) {
            case 'GET':
                body = {'env': process.env.ENV};
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