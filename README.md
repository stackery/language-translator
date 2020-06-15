# Langugage Translator

This is a tool that will translate text into another language. It is recommended to use [Stackery](https://www.stackery.io/) to get this setup.

## Architecture
![stack](https://user-images.githubusercontent.com/12616554/68421943-1934e900-0154-11ea-8601-b6fc164acffc.png)

## Directions to Use
1. [Create an IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) with `s3:PutObject` permission and enable programic access. Take note of the access key/secret access key.
2. Add the `accessKeyId` and `secret` to your [environment](https://docs.stackery.io/docs/using-stackery/environments/#setting-configuration-store-values).
3. Deploy the stack.
4. Take note of the `OriginalFiles` bucket ARN and scope the permission for the IAM user you created in step 1 to `s3:ObjectPut` for just that bucket. The policy document should look something like this...be sure to replace the `<>` content with your own.

  ```
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::language-translator-<YOUR STACKERY ENVIRONMENT NAME HERE>-originalf-<YOUR AWS ACCOUNT ID HERE>/*"
            ]
        }
    ]
  }
  ```

4. Upload a text file to the `OriginalFiles` s3 bucket in the AWS console. Should be in format `SourceLanguageCode/TargetLanguageCode/filename.txt`.
5. The translated text will appear in the `TranslatedFiles` s3 bucket under the same file path `SourceLanguageCode/TargetLanguageCode/filename.txt`.
6. Alternatively, you can head to the url for your frontend. It'll be something like `http://<STACKERY STACK NAME>-<STACKERY ENVIRONMENT NAME>-frontend.s3-website-<AWS ACCOUNT REGION>.amazonaws.com/`.

## Running the Frontend Locally Against a Deployed Backend
- Add a file `src/PopulateFrontend/frontend-code/src/config.js` with the following:
  ```
  export default {
    accessKeyId: '<YOUR-ACCESS-KEY-ID>',
    secret: '<YOUR-SECRET-ACCESS-KEY>',
    region: '<YOUR-REGION>',
    apiEndpoint: '<YOUR-API-ENDPOINT>',
    originalBucket: '<YOUR-ORIGINAL-BUCKET-NAME>'
  };
  ```

## Notes
- DynamoDB has an item size [limit](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html#limits-items). GitHub issue with suggestions on how to fix this [here](https://github.com/stackery/language-translator/issues/6).
- Supported language codes and pairs can be found [here](https://docs.aws.amazon.com/translate/latest/dg/what-is.html)

### Outstanding TODO Items / Open Bugs
See [open issues](https://github.com/stackery/language-translator/issues)

### Logging Issues
If you find a bug or have a question, feel free to open a new issue and our maintainers will reply as soon as they possibly can. Please describe the issue including steps to reproduce if there are any.

### Pull Request Process
1. Fork the respository
2. Make any changes you'd like
3. Open a new PR against `master` with a description of the proposed changes as well as any other information you find relevant.
4. If your PR fixes an open issue be sure to write `fixes #[ issue number here ]`

### Finding Help
Please send a direct message to [@deeheber on Twitter](https://twitter.com/deeheber) or [@FarrahC32 on Twitter](https://twitter.com/FarrahC32) if any of your questions have not been addressed by the documentation in this repository.
