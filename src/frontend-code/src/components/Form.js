import React from 'react';

import '../styles/Form.css';

function Form (props) {
  return (
    <div className='form-container'>
      <form onSubmit={props.onSubmit}>
        <input onChange={props.onFileChange} type='file' />
        <button type='submit' className='submitButton'>Submit</button>
      </form>
    </div>
  );
}

export default Form;
