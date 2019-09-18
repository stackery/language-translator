const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const translate = new AWS.Translate();


exports.handler = async (event, context) => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));
  console.log(event.Records[0].s3.bucket.name);
  console.log(event.Records[0].s3.object.key);

  const bucketName = event.Records[0].s3.bucket.name;
  const Key = event.Records[0].s3.object.key;

  try {
    const bucketContents = await s3.getObject({
      Bucket: bucketName,
      Key
    }).promise();
    
    console.log(bucketContents.Body.toString());
    const Text = bucketContents.Body.toString();
    const TranslateParams = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'ko',
      Text
    };
    
    const TranslatedText = await translate.translateText(TranslateParams).promise();
    console.log(TranslatedText)

    
    
  } catch (error) {
    console.log(error);

  }
  return {};
};
