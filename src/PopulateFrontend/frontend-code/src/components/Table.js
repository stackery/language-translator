import React from 'react';

import '../styles/Table.css';

function Table (props) {
  // Sort rows by timestamp
  // TODO fix this serverside
  const sortedRows = props.rows.sort((a, b) => {
    a = new Date(a.Timestamp);
    b = new Date(b.Timestamp);
    return a > b ? -1 : a < b ? 1 : 0;
  });

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
