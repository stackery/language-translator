const AWS = require('aws-sdk');
const cldrSegmentation = require('cldr-segmentation');
const s3 = new AWS.S3();
const translate = new AWS.Translate();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  // Log the event argument for debugging and for use in local development.
  console.log('Event: ', JSON.stringify(event, undefined, 2));
  console.log(`Bucket Name: ${event.Records[0].s3.bucket.name}`);
  console.log(`Bucket Key: ${event.Records[0].s3.object.key}`);

  const originalBucketName = event.Records[0].s3.bucket.name;
  const Key = event.Records[0].s3.object.key;
  const SourceLanguageCode = Key.split('/')[0];
  const TargetLanguageCode = Key.split('/')[1];

  try {
    console.log('Getting uploaded text file to translate...');
    const bucketContents = await s3.getObject({
      Bucket: originalBucketName,
      Key
    }).promise();

    const Text = bucketContents.Body.toString();
    console.log(`Original text to translate received: ${Text}`);

    /** Split into sentences and make individual calls to translateText to circumvent the service limit
     * https://docs.aws.amazon.com/translate/latest/dg/what-is-limits.html#limits.
     *
     * The cldrSegmentation package only offers limited language set for language exceptions, so segmentations might be less than perfect for other languages.
     */

    const supportedLanguageExceptions = ['de', 'en', 'es', 'fr', 'it', 'pt', 'ru'];
    let supp;

    if (supportedLanguageExceptions.includes(SourceLanguageCode)) {
      supp = cldrSegmentation.suppressions[SourceLanguageCode];
    }
    const sentences = cldrSegmentation.sentenceSplit(Text, supp);
    console.log(`Splitting into sentences: ${sentences}`);

    const results = [];
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];

      const TranslateParams = {
        SourceLanguageCode,
        TargetLanguageCode,
        Text: sentence
      };

      const { TranslatedText } = await translate.translateText(TranslateParams).promise();
      console.log(`Sentence translated into: ${TranslatedText}`);
      results.push(TranslatedText);
    }

    const uploadText = results.join(' ');
    console.log(`Starting upload to S3 translated text bucket: ${results.join(' ')}`);

    const putObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key,
      Body: uploadText
    };

    const putObjectResult = await s3.putObject(putObjectParams).promise();
    console.log(`Success uploading to S3: ${JSON.stringify(putObjectResult, null, '\t')}`);

    const putDynamoParams = {
      TableName: process.env.TABLE_NAME,
      Item: {
        Key,
        SourceLanguageCode,
        TargetLanguageCode,
        OriginalText: Text,
        TranslatedText: uploadText,
        Timestamp: Date.now()
      }
    };

    const putDynamoResult = await dynamodb.put(putDynamoParams).promise();
    console.log(`Success writing to dynamoDB: ${JSON.stringify(putDynamoResult, null, '\t')}`);
  } catch (error) {
    console.log(`An error ocurred: ${JSON.stringify(error, null, '\t')}`);
  }
};
