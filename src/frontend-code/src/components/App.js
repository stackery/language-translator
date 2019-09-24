import React, { Component } from 'react';

import Config from '../config';
import Form from './Form';
import '../styles/App.css';

const AWS = require('aws-sdk');
const credentials = new AWS.Credentials(Config.accessKeyId, Config.secret);
AWS.config.credentials = credentials;
const s3 = new AWS.S3({ region: 'us-west-2' });

class App extends Component {
  constructor () {
    super();
    this.file = null;
    this.state = {
      targetLanguage: 'ar',
      sourceLanguage: 'en',
      message: '',
      inputKey: Date.now()
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSourceLanguageChange = this.handleSourceLanguageChange.bind(this);
    this.handleTargetLanguageChange = this.handleTargetLanguageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileChange (event) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  handleSourceLanguageChange (event) {
    this.setState({
      sourceLanguage: event.target.value
    });
  }

  handleTargetLanguageChange (event) {
    this.setState({
      targetLanguage: event.target.value
    });
  }

  async handleSubmit (event) {
    event.preventDefault();

    if (!this.file) {
      alert('Please select a file to upload');
      return;
    }
    if (this.file.size > 5000) {
      alert('Please pick a file smaller than 5000 bytes');
      return;
    }

    if (this.file.type !== 'text/plain') {
      alert('Please select a plaintext file');
      return;
    }

    try {
      await s3.putObject({
        Body: this.file,
        Bucket: 'language-translator-development-originalf-053662045684',
        Key: `${this.state.sourceLanguage}/${this.state.targetLanguage}/${this.file.name}`,
        ContentType: 'text/plain'
      }).promise();

      this.file = null;
      this.setState({
        sourceLanguage: 'en',
        targetLanguage: 'ar',
        message: 'Success',
        inputKey: Date.now()
      });
    } catch (error) {
      console.log('AN ERROR OCURRED');
      console.log(error);
      this.setState({
        message: 'There was an error'
      });
    }
  }

  render () {
    console.log(this.state);
    console.log('file ', this.file);
    return (
      <div className='container'>
        <h1>Language Translator</h1>
        <Form
          inputKey={this.state.inputKey}
          targetLanguage={this.state.targetLanguage}
          sourceLanguage={this.state.sourceLanguage}
          onSourceLanguageChange={this.handleSourceLanguageChange}
          onTargetLanguageChange={this.handleTargetLanguageChange}
          onFileChange={this.handleFileChange}
          onSubmit={this.handleSubmit}
          message={this.state.message}
        />
      </div>
    );
  }
}

export default App;
