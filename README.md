# Langugage Translator

This is a tool that will translate text into another language.

## Architecture
![stack](https://user-images.githubusercontent.com/12616554/65185389-50bcca00-da1c-11e9-8d63-c9213053d91f.png)

## Directions to Use
1. Deploy the stack. It is recommended to use [Stackery](https://www.stackery.io/)
2. Upload a text file to the `OriginalFiles` s3 bucket in the AWS console. Should be in format `SourceLanguageCode/TargetLanguageCode/filename.txt`.
3. The translated text will appear in the `TranslatedFiles` s3 bucket

## Frontend
- create an iam user with `s3:ObjectPut` permission to your `OriginalFiles` bucket enable programic access and take note of the access key/secret access key. Add a file `src/frontend-code/config.js` with the following:
  ```
  export default {
    accessKeyId: 'YOUR-ACCESS-KEY-ID',
    secret: 'YOUR-SECRET-ACCESS-KEY',
    region: 'YOUR-REGION',
    apiEndpoint: 'YOUR-API-ENDPOINT',
    originalBucket: 'YOUR-ORIGINAL-BUCKET-NAME'
  };
  ```


## Notes
- `translateText` has a [limit](https://docs.aws.amazon.com/translate/latest/dg/what-is-limits.html) - ensure your filesize does not exceed this
