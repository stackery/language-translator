import React, { Component } from 'react';
import { Storage } from 'aws-amplify';

import Form from './Form';
import '../styles/App.css';

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

    try {
      await Storage.put(`en/es/${this.file.name}`, this.file, {
        contentType: this.file.type
      });
      this.file = null;
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
