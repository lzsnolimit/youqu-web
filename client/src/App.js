import Home from './pages/Home'
import React, {useEffect} from 'react';
import {useCookies} from 'react-cookie';
import Login from "./pages/Login";
import Register from "./pages/Register";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const App = () => {
    return (

        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Add more routes if needed */}
            </Routes>
        </Router>

    );
}


export default App