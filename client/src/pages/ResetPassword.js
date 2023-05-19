import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';





function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const location = useLocation();

    function getQueryParams(queryString) {
        const urlSearchParams = new URLSearchParams(queryString);
        const queryParams = Object.fromEntries(urlSearchParams.entries());
        return queryParams;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage('两次输入的密码不一致');
            return false;
        }
        if (newPassword.length < 8 || !newPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
            setErrorMessage('密码至少8位，且包含数字和字母');
            return false;
        }
        setErrorMessage('');
        // 在这里添加重置密码的逻辑
        console.log('Reset password:', newPassword);
        const queryParams = getQueryParams(location.search);
        console.log(queryParams.token); // 这里将输出 token 的值

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8" style={{ paddingBottom: '10%' }}>
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                    {errorMessage && (
                        <div className="text-center text-red-500 font-semibold">
                            {errorMessage}
                        </div>
                    )}
                    <button type="submit" disabled={!newPassword || !confirmPassword}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Reset Password
                    </button>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Remember your password? <Link to="/login"
                                                  className="font-medium text-indigo-600 hover:text-indigo-500">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default ResetPassword;