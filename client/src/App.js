import Home from './pages/Home'
import React, {useEffect} from 'react';
import {useCookies} from 'react-cookie';
import Login from "./pages/Login";
import Register from "./pages/Register";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['id','Authorization']);
    useEffect(() => {

        if (cookies.id == null) {
            if (process.env.REACT_APP_ENV == "development"){
                const uuid='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                setCookie("id",uuid)
            }
            else {
                removeCookie("id");
                removeCookie("Authorization");
                window.location.href = '/login';
            }

        }
    }, [cookies]);

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