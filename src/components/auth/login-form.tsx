import { useState } from 'react';
import { login } from '../../../auth';

interface LoginProps {
    onLogin: (uid: string, displayName: string | null) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const user = await login(email, password);
            console.log("User logged in: ", user);
            onLogin(user.uid, user.displayName);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    }

    return (
        <div className='dark:bg-neutral-600'>
            <h1 className='dark:text-neutral-200 text-neutral-700 font-bold'>Login</h1>
            {error && <p className='text-red-500'>{error}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='block w-full p-2 mb-4 h-12 bg-gray-200 rounded text-black drop-shadow-md'
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                className='block w-full p-2 mb-4 h-12 bg-gray-200 rounded text-black drop-shadow-md'
            />
            <div className='flex flex-col items-center'>
                <button
                    onClick={handleLogin}
                    className='dark:bg-slate-500 bg-blue-500 text-white px-4 py-2 rounded mb-2 shadow'
                >
                    Login
                </button>
            </div>
        </div>
    )
}
