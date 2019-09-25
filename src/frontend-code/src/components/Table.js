import React from 'react';

import '../styles/Table.css';

function Table (props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Source Language</th>
          <th>Original Text</th>
          <th>Target Language</th>
          <th>Translated Text</th>
        </tr>
      </thead>

      <tbody>
        {props.rows.map(row => (
          <tr key={row.Key}>
            <td>{row.Key}</td>
            <td>{row.SourceLanguageCode}</td>
            <td>{row.OriginalText}</td>
            <td>{row.TargetLanguageCode}</td>
            <td>{row.TranslatedText}</td>
          </tr>
        ))}

        { props.rows.length < 1 && <tr><td colSpan='5'>No translation records found. Start adding some using the form above.</td></tr>}
      </tbody>
    </table>
  );
}

export default Table;
