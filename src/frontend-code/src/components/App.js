import React, { Component } from 'react';

import Config from '../config';
import Form from './Form';
import Table from './Table';
import '../styles/App.css';

const AWS = require('aws-sdk');
const credentials = new AWS.Credentials(Config.accessKeyId, Config.secret);
AWS.config.credentials = credentials;
const s3 = new AWS.S3({ region: 'us-west-2' });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class App extends Component {
  constructor () {
    super();
    this.file = null;
    this.state = {
      targetLanguage: 'ar',
      sourceLanguage: 'en',
      message: '',
      inputKey: Date.now(),
      rows: []
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSourceLanguageChange = this.handleSourceLanguageChange.bind(this);
    this.handleTargetLanguageChange = this.handleTargetLanguageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount () {
    try {
      // Note fetch may not work in IE11
      const rows = await fetch(`${Config.apiEndpoint}/translations`);
      const rowsJson = await rows.json();
      this.setState({
        rows: rowsJson
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleFileChange (event) {
    this.file = event.target.files[0];
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
      const Key = `${this.state.sourceLanguage}/${this.state.targetLanguage}/${this.file.name}`;

      await s3.putObject({
        Body: this.file,
        Bucket: Config.originalBucket,
        Key,
        ContentType: 'text/plain'
      }).promise();

      this.file = null;
      this.setState({
        sourceLanguage: 'en',
        targetLanguage: 'ar',
        message: 'Processing...',
        inputKey: Date.now()
      });

      // It takes a while for the translation to process
      // Wait 5 seconds then get the item from the dynamoDB table
      // TODO: add more sophisticated retry behavior
      await delay(3000);
      const item = await fetch(`${Config.apiEndpoint}/translations?key=${Key}`);
      const rowJson = await item.json();
      console.log('RESULT ', rowJson);
      // Item exists
      if (!('Item' in rowJson)) {
        this.setState({
          rows: [
            rowJson,
            ...this.state.rows
          ],
          message: 'Success'
        });
      }
      await delay(2000);
      this.setState({
        message: ''
      });
    } catch (error) {
      console.log('AN ERROR OCURRED');
      console.log(error);
      this.setState({
        message: 'There was an error'
      });
      await delay(2000);
      this.setState({
        message: ''
      });
    }
  }

  render () {
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
        <Table rows={this.state.rows} />
      </div>
    );
  }
}

export default App;
