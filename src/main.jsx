import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthContextProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Using BrowserRouter; OAuth handled via /auth/callback route

// Create the root element and render the app
const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </StrictMode>
);