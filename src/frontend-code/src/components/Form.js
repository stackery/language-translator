import React, { Fragment } from 'react';

import '../styles/Form.css';

function Form (props) {
  const options = (
    <Fragment>
      <option value='ar'>Arabic</option>
      <option value='zh'>Chinese (Simplified)</option>
      <option value='zh-TW'>Chinese (Traditional)</option>
      <option value='cs'>Czech</option>
      <option value='da'>Danish</option>
      <option value='nl'>Dutch</option>
      <option value='en'>English</option>
      <option value='fi'>Finnish</option>
      <option value='fr'>French</option>
      <option value='de'>German</option>
      <option value='he'>Hebrew</option>
      <option value='hi'>Hindi</option>
      <option value='id'>Indonesian</option>
      <option value='it'>Italian</option>
      <option value='ja'>Japanese</option>
      <option value='ko'>Korean</option>
      <option value='ms'>Malay</option>
      <option value='no'>Norwegian</option>
      <option value='fa'>Persian</option>
      <option value='pl'>Polish</option>
      <option value='pt'>Portuguese</option>
      <option value='ru'>Russian</option>
      <option value='es'>Spanish</option>
      <option value='sv'>Swedish</option>
      <option value='tr'>Turkish</option>
    </Fragment>
  );

  return (
    <div className='form-container'>
      <form onSubmit={props.onSubmit}>
        <label>Source Language</label>
        <select name='sourceLanguage' value={props.sourceLanguage} onChange={props.onSourceLanguageChange}>
          { options }
        </select>
        <label>Target Language</label>
        <select name='targetLanguage' value={props.targetLanguage} onChange={props.onTargetLanguageChange}>
          { options }
        </select>
        <input onChange={props.onFileChange} type='file' value={props.file} />
        <button type='submit' className='submitButton'>Submit</button>
      </form>
    </div>
  );
}

export default Form;
