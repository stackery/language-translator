const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));

  let response;
  let statusCode;

  // determine if we're getting a single item or all items
  if (event.queryStringParameters !== null && 'key' in event.queryStringParameters) {
    const getParams = {
      TableName: process.env.TABLE_NAME,
      Key: { Key: event.queryStringParameters.key }
    };

    try {
      const result = await dynamodb.get(getParams).promise();
      // Fetch does some weird things when trying to parse an {}
      // Dynamo returns {} if item is not in the table, so alter this to prevent fetch from barfing
      if (!('Item' in result)) {
        response = { Item: 'not found' };
      } else {
        response = result.Item;
      }
      statusCode = 200;
    } catch (err) {
      console.log('An error occurred pulling from the table: ', err);
      response = err.message;
      statusCode = err.statusCode;
    }
  } else {
    const listParams = {
      TableName: process.env.TABLE_NAME,
      Select: 'ALL_ATTRIBUTES'
    };

    try {
      const { Items } = await dynamodb.scan(listParams).promise();
      /* TODO: Figure out if there's a way to sort scan results from dynamo
      * Initial search showed this may not be an option and/or is hard to implement
      */
      const sortedItems = Items.sort((a, b) => b.Timestamp - a.Timestamp);
      console.log('SORTED RESULTS FROM DB ', sortedItems);
      response = sortedItems;
      statusCode = 200;
    } catch (err) {
      console.log('An error occurred scanning the table: ', err);
      response = err.message;
      statusCode = err.statusCode;
    }
  }

  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(response)
  };
};
