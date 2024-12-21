import { useState } from 'react';
import { login } from '../../../auth';

interface LoginProps {
    onLogin: (uid: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const user = await login(email, password);
            console.log("User logged in: ", user);
            onLogin(user.uid);

        } catch (err) {
            if(err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    }

    return (
        <div>
            <h1>Login</h1>
            {error && <p className='text-red-500'>{error}</p>}
            <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='block w-full p-2 mb-2 bg-gray-200 rounded'
            />
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                className='block w-full p-2 mb-2 bg-gray-200 rounded'
            />
            <button
                onClick={handleLogin}
                className='bg-blue-500 text-white px-4 py-2 rounded'
            >
                Login
            </button>
        </div>
    )
}
