# Langugage Translator

This is a tool that will translate text into another language.

## Architecture
![stack](https://user-images.githubusercontent.com/12616554/65185389-50bcca00-da1c-11e9-8d63-c9213053d91f.png)

## Directions to Use
1. Deploy the stack. It is recommended to use [Stackery](https://www.stackery.io/)
2. Upload a text file to the `OriginalFiles` s3 bucket in the AWS console. It'll need to be in the format of `[sourceLanguageCode]/[targetLanguageCode]/[filename].txt`. Example: If I want to translate the contents of a file named `hello.txt` from English to Spanish, I'd upload it to `en/es/hello.txt`.
3. The translated text will appear in the `TranslatedFiles` s3 bucket under the same path/filename you uploaded to the `OriginalFiles` bucket.

## Notes
Supported language codes and pairs can be found [here](https://docs.aws.amazon.com/translate/latest/dg/what-is.html)
