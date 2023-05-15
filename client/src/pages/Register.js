import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 这里添加注册逻辑，例如调用API进行验证
        // 如果成功，跳转至登录页面
        if (!registrationValidation()) {
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": email,
            "password": password,
            "username": username,
            "phone": "13006601253"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
            credentials: 'include'
        };

        const response = await fetch(process.env.REACT_APP_BASE_URL + "register", requestOptions)
        const data = await response.json()
        console.log(data)
        if ('error' in data){
            console.log(data.error)
            setErrorMessage(data.error)
        }
        else {
            setErrorMessage('')
            //redirect to home page
            history('/')
        }
    };


    const registrationValidation = () => {
        if (email === '' || password === '' || username === '') {
            setErrorMessage('请填写所有字段');
            return false;
        }
        //if password is less than 8 characters or not combine of letters and numbers
        if (password.length < 8 || !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
            setErrorMessage('密码至少8位，且包含数字和字母');
            return false;
        }
        //if username is less than 5 characters
        if (username.length < 5) {
            setErrorMessage('用户名至少5位');
            return false;
        }
        //if email is not valid
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setErrorMessage('邮箱格式不正确');
            return false;
        }
        //if phone is not valid
        if (!phone.match(/^[0-9]{11}$/)) {
            setErrorMessage('手机号码格式不正确');
            return false;
        }
        return true;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '10%' }}>
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <input
                        type="text"
                        placeholder="Username"
                        autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="phone"
                        placeholder="Phone"
                        autoComplete="off"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    {errorMessage && (
                        <div className="text-center text-red-500 font-semibold">
                            {errorMessage}
                        </div>
                    )}
                    <button type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Register
                    </button>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login"
                                                   className="font-medium text-indigo-600 hover:text-indigo-500">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
