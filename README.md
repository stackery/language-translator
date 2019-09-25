# Langugage Translator

This is a tool that will translate text into another language.

## Architecture
![stack](https://user-images.githubusercontent.com/12616554/65185389-50bcca00-da1c-11e9-8d63-c9213053d91f.png)

## Directions to Use
1. Deploy the stack. It is recommended to use [Stackery](https://www.stackery.io/)
2. Upload a text file to the `OriginalFiles` s3 bucket in the AWS console. Should be in format `SourceLanguageCode/TargetLanguageCode/filename.txt`.
3. The translated text will appear in the `TranslatedFiles` s3 bucket

## Frontend
- add the following CORS configuration to your `OriginalFiles` bucket
  ```
  <?xml version="1.0" encoding="UTF-8"?>
  <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
      <AllowedOrigin>*</AllowedOrigin>
      <AllowedMethod>PUT</AllowedMethod>
      <AllowedMethod>GET</AllowedMethod>
      <AllowedMethod>POST</AllowedMethod>
      <AllowedMethod>DELETE</AllowedMethod>
      <AllowedHeader>*</AllowedHeader>
  </CORSRule>
  </CORSConfiguration>
  ```
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
- edit the `SourceLanguageCode` and `TargetLanguageCode` in `src/TranslateFunction/index.js` if you'd like to do a combo aside from English to Spanish. Supported language codes are [here](https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes).
