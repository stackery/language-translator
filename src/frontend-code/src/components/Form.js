import React from 'react';

function Form (props) {
  return (
    <div>
      <form onSubmit={props.onSubmit}>
        <input onChange={props.onFileChange} type='file' />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default Form;
