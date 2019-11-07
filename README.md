# Langugage Translator

This is a tool that will translate text into another language.

## Architecture
![stack](https://user-images.githubusercontent.com/12616554/65185389-50bcca00-da1c-11e9-8d63-c9213053d91f.png)

## Directions to Use
1. Deploy the stack. It is recommended to use [Stackery](https://www.stackery.io/)
2. Upload a text file to the `OriginalFiles` s3 bucket in the AWS console. It'll need to be in the format of `[sourceLanguageCode]/[targetLanguageCode]/[filename].txt`. Example: If I want to translate the contents of a file named `hello.txt` from English to Spanish, I'd upload it to `en/es/hello.txt`.
3. The translated text will appear in the `TranslatedFiles` s3 bucket under the same path/filename you uploaded to the `OriginalFiles` bucket.
4. Take a look at the [frontend branch](https://github.com/stackery/language-translator/tree/frontend) if you'd like a web user interface (still a work in progress).

## Notes
- Supported language codes and pairs can be found [here](https://docs.aws.amazon.com/translate/latest/dg/what-is.html)
- AWS Translate does some weird things with non `txt` files. For best results, we recommend using `txt` files only.

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
