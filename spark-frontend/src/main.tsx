import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';  // Import Auth0
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Auth0Provider
        domain="dev-xzszyuf238vijuhm.us.auth0.com"
        clientId="lAGok2y7Jrsz2NJE6QmQHSmWQDJCvw0T"
        authorizationParams={{
            redirect_uri: "http://localhost:5173/profile"  // Redirect to home page after login
        }}
        cacheLocation='localstorage'
    >
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Auth0Provider>
);
