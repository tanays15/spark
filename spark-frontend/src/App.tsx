import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import Results from './pages/Results';
import Recording from './pages/Recording';

import React from 'react'
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme"; // Import theme file

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/logout" element={<Results />} />
            <Route path='/recording' element={<Recording />} />
        </Routes>
    );
}

export default App;
