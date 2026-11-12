
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// Leaflet's map styles first, so the site's map styles in index.css override them
import 'leaflet/dist/leaflet.css';
import './index.css';
import { installErrorCollector } from './utils/errorCollector';
import { prepareSavedLanguage } from './context/LanguageContext';

// Remember recent browser errors so bug reports can include them
installErrorCollector();

// A returning visitor's language is fetched before the first render (English is built in)
prepareSavedLanguage().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});
