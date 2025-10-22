import React from 'react';
import { Form } from '@formio/react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Formio PWA</h1>
        <Form src="https://formio.github.io/formio.js/app/examples/form.json" onSubmit={(submission) => console.log(submission)} />
      </header>
    </div>
  );
}

export default App;
