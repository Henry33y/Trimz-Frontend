import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
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
        <ThemeProvider>
          <App />
        </ThemeProvider>
        <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          style={{
            fontSize: '14px',
            fontWeight: '500',
            width: 'auto',
            maxWidth: '90vw',
          }}
          toastStyle={{
            backgroundColor: 'white',
            color: '#1e293b',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05)',
            padding: '12px 16px',
            minHeight: '48px',
            margin: '0 auto 8px',
            maxWidth: '400px',
          }}
          progressStyle={{
            background: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
            height: '3px',
          }}
        />
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);