import { createRoot } from 'react-dom/client';
import { RuntimeConfig } from './RuntimeConfig';
import { App } from './App';

import './index.css';

const root = createRoot(document.getElementById('app'));
root.render(
  <RuntimeConfig>
    <App />
  </RuntimeConfig>
);