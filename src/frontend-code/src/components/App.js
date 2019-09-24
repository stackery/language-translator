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
    this.state = {};

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileChange (event) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  async handleSubmit (event) {
    event.preventDefault();

    if (this.file && this.file.size > 5000) {
      alert('Please pick a file smaller than 5000 bytes');
      return;
    }

    if (this.file && this.file.type !== 'text/plain') {
      alert('Please select a plaintext file');
      return;
    }

    try {
      console.log('START UPLOAD');
      const result = await s3.putObject({
        Body: this.file,
        Bucket: 'language-translator-development-originalf-053662045684',
        Key: `en/ru/${this.file.name}`,
        ContentType: 'text/plain'
      }).promise();
      this.file = null;
      console.log('FINISH UPLOAD ', result);
    } catch (error) {
      console.log('AN ERROR OCURRED');
      console.log(error);
    }
  }

  render () {
    return (
      <div className='container'>
        <h1>Language Translator</h1>
        <Form
          onFileChange={this.handleFileChange}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default App;
