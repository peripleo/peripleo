import { createRoot } from 'react-dom/client';
import { RuntimeConfig } from '@peripleo/peripleo';
import { App } from './App';
import { normalize } from './CoreDataConfig';
import './index.css';

const root = createRoot(document.getElementById('app'));
root.render(
  <RuntimeConfig
    preprocess={normalize}>
    <App />
  </RuntimeConfig>
);