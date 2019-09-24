const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const translate = new AWS.Translate();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));
  console.log(event.Records[0].s3.bucket.name);
  console.log(event.Records[0].s3.object.key);

  const originalBucketName = event.Records[0].s3.bucket.name;
  const Key = event.Records[0].s3.object.key;
  const SourceLanguageCode = Key.split('/')[0];
  const TargetLanguageCode = Key.split('/')[1];

  try {
    const bucketContents = await s3.getObject({
      Bucket: originalBucketName,
      Key
    }).promise();

    const Text = bucketContents.Body.toString();
    console.log(Text);

    const TranslateParams = {
      SourceLanguageCode,
      TargetLanguageCode,
      Text
    };

    const translatedText = await translate.translateText(TranslateParams).promise();
    console.log(translatedText);

    const putObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key,
      Body: translatedText.TranslatedText
    };

    const putObjectResult = await s3.putObject(putObjectParams).promise();
    console.log(putObjectResult);

    const putDynamoParams = {
      TableName: process.env.TABLE_NAME,
      Item: {
        Key,
        SourceLanguageCode,
        TargetLanguageCode,
        OriginalText: Text,
        TranslatedText: translatedText.TranslatedText
      }
    };

    const putDynamoResult = await dynamodb.put(putDynamoParams).promise();
    console.log(putDynamoResult);
  } catch (error) {
    console.log(error);
  }
};
