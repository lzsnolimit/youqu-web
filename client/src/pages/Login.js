import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useCookies} from "react-cookie";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [cookies, setCookie] = useCookies(['Authorization']);

    const handleSubmit = async (e) => {
        e.preventDefault();
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        //if email is not valid
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setErrorMessage('邮箱格式不正确');
            return false;
        }



        const raw = JSON.stringify({
            "email": email,
            "password": password
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch(process.env.REACT_APP_BASE_URL + "login", requestOptions)
        const data = await response.json()
        if ('error' in data){
            setErrorMessage(data.error)
        }
        else {
            setErrorMessage('')
            const expires = new Date();
            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
            setCookie('Authorization', data.token, { expires })
            //redirect to home page
            window.location.href = '/'
        }
        console.log(data)
        // 这里添加登录逻辑，例如调用API进行验证
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '10%' }}>
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    {errorMessage && (
                    <div className="text-center text-red-500 font-semibold">
                        {errorMessage}
                    </div>
                    )}
                    <button type="submit" disabled={!email || !password}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Login
                    </button>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register"
                                                 className="font-medium text-indigo-600 hover:text-indigo-500">Register</Link>
                </p>
                <p className="text-center text-sm text-gray-600">
                    Forgot your password? <Link to="/forget_password" className="font-medium text-indigo-600 hover:text-indigo-500">Reset it here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;