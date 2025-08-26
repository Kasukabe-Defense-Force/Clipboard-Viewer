import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import { Global, css } from '@emotion/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Global
      styles={css`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
        }
      `}
    />
    <App />
  </React.StrictMode>
);
