# Langugage Translator

This is a tool that will translate text into another language.

## Directions to Use
1. Deploy the stack. It is recommended to use [Stackery](https://www.stackery.io/)
2. Upload a text file to the `OriginalFiles` s3 bucket in the AWS console
3. The translated text will appear in the `TranslatedFiles` s3 bucket

## Notes 
- `translateText` has a [limit](https://docs.aws.amazon.com/translate/latest/dg/what-is-limits.html) - ensure your filesize does not exceed this
- edit the `SourceLanguageCode` and `TargetLanguageCode` in `src/TranslateFunction/index.js` if you'd like to do a combo aside from English to Spanish. Supported language codes are [here](https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes).
