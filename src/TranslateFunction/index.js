const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const translate = new AWS.Translate();

exports.handler = async event => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));
  console.log(event.Records[0].s3.bucket.name);
  console.log(event.Records[0].s3.object.key);

  const originalBucketName = event.Records[0].s3.bucket.name;
  const Key = event.Records[0].s3.object.key;

  try {
    const bucketContents = await s3.getObject({
      Bucket: originalBucketName,
      Key
    }).promise();

    const Text = bucketContents.Body.toString();
    console.log(Text);

    const TranslateParams = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'es',
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
  } catch (error) {
    console.log(error);
  }
};
