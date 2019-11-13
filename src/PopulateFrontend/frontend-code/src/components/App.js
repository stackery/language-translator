import React, { Component } from 'react';

import Config from '../config';
import Form from './Form';
import Table from './Table';
import '../styles/App.css';

const AWS = require('aws-sdk');
const credentials = new AWS.Credentials(Config.accessKeyId, Config.secret);
AWS.config.credentials = credentials;
const s3 = new AWS.S3({ region: Config.region });

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

      /** TODO: add more sophisticated retry behavior with websockets, IoT, or something similar
       * Longer translations take a while to process
       * Attempt to fetch the new translation every 4 seconds until found
       * Stop retry behavior after 5 min
       */
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      const interval = 4000;
      let totalWaitTime = 300000;
      let itemFound = false;

      while (totalWaitTime > 0) {
        await delay(interval);
        const item = await fetch(`${Config.apiEndpoint}/translations?key=${Key}`);
        const rowJson = await item.json();

        // The translation is complete
        if (!('Item' in rowJson)) {
          this.setState({
            rows: [
              rowJson,
              ...this.state.rows
            ],
            message: 'Success'
          });
          itemFound = true;
          break;
        }
        totalWaitTime -= interval;
      }

      if (itemFound) {
        await delay(interval);
        this.setState({
          message: ''
        });
      } else {
        this.setState({
          message: 'Item still processing...check back later and refresh your browser to see the translation.'
        });
      }
    } catch (error) {
      console.log('AN ERROR OCURRED');
      console.log(error);
      this.setState({
        message: 'There was an error'
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
