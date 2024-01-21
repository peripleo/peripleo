import { createRoot } from 'react-dom/client';
import { Peripleo, Router, RuntimeConfig } from '@peripleo/peripleo';
import { App } from './App';
import { TypeSenseSearch } from './components';
import { normalize } from './CoreDataConfig';

import './index.css';

const root = createRoot(document.getElementById('app'));
root.render(
  <RuntimeConfig
    preprocess={normalize}>
    <Peripleo>
      <TypeSenseSearch>
        <Router>
          <App />
        </Router>
      </TypeSenseSearch>
    </Peripleo>
  </RuntimeConfig>
);