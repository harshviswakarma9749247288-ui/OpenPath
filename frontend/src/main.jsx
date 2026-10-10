import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Global Design System Tokens & Base Reset
import './index.css';

// Modular Feature Stylesheets
import './styles/navigation.css';
import './styles/auth.css';
import './styles/admin.css';
import './styles/landing.css';
import './styles/dashboard.css';
import './styles/opportunities.css';
import './styles/profile.css';
import './styles/components.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
