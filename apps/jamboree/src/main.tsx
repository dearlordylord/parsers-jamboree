import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'highlight.js/styles/github-dark-dimmed.css';

import App from './app/app';
import { igor } from '@parsers-jamboree/checker';
import { prefixCustomerId } from '../../../libs/checker/src/lib/breaker';

console.log('prefixCustomerId', prefixCustomerId(igor));


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
