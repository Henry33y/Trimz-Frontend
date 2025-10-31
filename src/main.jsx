// Importing React's StrictMode, which helps with highlighting potential issues in the app
import { StrictMode } from 'react';

// Importing React's new createRoot API to manage the React app's rendering
import { createRoot } from 'react-dom/client';

// Importing the main App component, which contains the structure of your application
import App from './App.jsx';

// Importing global styles from the index.css file
import './index.css';

// Importing BrowserRouter from react-router-dom to handle routing in the app
import { BrowserRouter } from 'react-router-dom';

// Importing toast notifications
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Importing the merged AuthContextProvider that now includes notification functionality
import { AuthContextProvider } from './context/AuthContext.jsx';

// Handle OAuth token passed via hash fragment from backend redirects like
// https://your-frontend.com/#/users/profile/me?token=...&method=googleoauth
// This keeps server-side changes minimal: backend can redirect to /#/<path>?token=...
// and this code will extract the token, store it, and rewrite the URL to the SPA path
;(function handleHashOAuth() {
  try {
    const hash = window.location.hash || '';
    if (!hash.startsWith('#/')) return;

    // Split the hash into path and querystring
    const withoutHash = hash.slice(2); // remove '#/'
    const [rawPath, rawQuery] = withoutHash.split('?');
    if (!rawQuery) return; // no query, nothing to do

    const params = new URLSearchParams(rawQuery);
    const token = params.get('token');
    if (token) {
      // store token where the app expects it (localStorage used across the app)
      localStorage.setItem('token', token);
    }
    // Replace the URL to the clean path (remove hash) so BrowserRouter can route normally
    const newPath = '/' + rawPath + (params.toString() ? ('?' + params.toString().replace(/(^|&)token=[^&]+/,'').replace(/^&/,'').replace(/&$/,'')) : '');
    // If the only param was token, newPath may end with '?' or empty query - clean it
    const cleanedPath = newPath.replace(/\?$|\?&|&$/g, '');
    if (cleanedPath !== window.location.pathname + window.location.search) {
      window.history.replaceState({}, document.title, cleanedPath);
    }
  } catch (e) {
    // Non-fatal: if parsing fails just continue rendering the app
    // eslint-disable-next-line no-console
    console.error('Error handling OAuth hash redirect:', e);
  }
})();

// Rendering the root element of the React app into the 'root' DOM element
createRoot(document.getElementById('root')).render(
  // Wrapping the app in StrictMode to check for potential problems
  <StrictMode>
    {/* Wrapping the app with BrowserRouter to enable routing in the app */}
    <BrowserRouter>
      <AuthContextProvider>
        <ToastContainer 
          theme='dark'
          position='top-right' 
          autoClose={3000} 
          closeOnClick 
          pauseOnHover={false}
        />
        <App /> {/* The main App component that contains the app's layout and routes */}
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);