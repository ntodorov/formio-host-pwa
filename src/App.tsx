import React, { useState } from 'react';
import { Form } from '@formio/react';
import './App.css';

function App() {
  const [formUrl, setFormUrl] = useState(
    'https://formio-api-dev.azurewebsites.net/tqmhwzomotajfzu/manage/view/#/form/publicaerform1?header=1&reset=1&host=formio-api-dev.azurewebsites.net&protocol=https'
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Formio PWA</h1>
        <div>
          <input
            type="text"
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            placeholder="Enter Form.io URL"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button
            onClick={() => setFormUrl(formUrl)}
            style={{ padding: '5px 10px' }}
          >
            Load Form
          </button>
        </div>
        <Form
          key={formUrl}
          src={formUrl}
          onSubmit={(submission) => console.log(submission)}
        />
      </header>
    </div>
  );
}

export default App;
