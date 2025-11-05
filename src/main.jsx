import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthContextProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Handle OAuth token passed via hash fragment from backend redirects
const handleHashOAuth = () => {
  try {
    const hash = window.location.hash || '';
    if (!hash.includes('token=')) return;
    
    const params = new URLSearchParams(hash.replace('#/', ''));
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      // Clean the URL
      const cleanHash = hash.split('?')[0];
      window.location.hash = cleanHash;
    }
  } catch (error) {
    console.error('Error handling OAuth redirect:', error);
  }
};

// Initialize OAuth handling
handleHashOAuth();

// Create the root element and render the app
const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <HashRouter>
      <AuthContextProvider>
        <App />
        <ToastContainer 
          theme='dark'
          position='top-right' 
          autoClose={3000} 
          closeOnClick 
          pauseOnHover={false}
        />
      </AuthContextProvider>
    </HashRouter>
  </StrictMode>
);