import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgetPassword() {

    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // 新增状态，用于判断是否显示隐藏的页面

    async function handleSubmit(event) {
        event.preventDefault();

        //if email is not valid
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setErrorMessage('邮箱格式不正确');
            return false;
        }

        const response = await sendCode(email);

        if (!response || response.message !== "Reset password email sent") {
            setErrorMessage('Error sending reset email, please try again');
        } else {
            setErrorMessage('');
            setShowSuccessMessage(true); // 发送成功后，将 showSuccessMessage 状态设置为 true
        }
    }

    async function sendCode(email) {
        try {
            const response = await fetch(process.env.REACT_APP_BASE_URL + 'sendcode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {showSuccessMessage ? ( // 根据 showMessage 状态决定显示的内容
                <div className="absolute top-0 left-0 mt-6 ml-6 space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">Please check your mailbox.</h2>
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                        Go to login page
                    </Link>
                </div>
            ) : (
                <div className="max-w-md w-full space-y-8">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        />
                        {errorMessage && (
                            <div className="text-center text-red-500 font-semibold">
                                {errorMessage}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={!email}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Send Reset Email
                        </button>
                    </form>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Login
                        </Link>
                    </p>
                </div>
            )}
        </div>
    );
}

export default ForgetPassword;