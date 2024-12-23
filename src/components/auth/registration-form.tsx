import { useState } from 'react';
import { register } from '../../../auth';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegistration = async () => {
        try {
            const user = await register(email, password);
            console.log("User registered: ", user);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        };
    }

    return (
        <div className='dark:bg-neutral-600'>
            <h1 className='dark:text-white text-neutral-600 font-bold'>Register</h1>
            {error && <p className='text-red-500'>{error}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='text-black block w-full p-2 mb-4 h-12 bg-gray-200 rounded drop-shadow-md'
            />

            <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='password'
                className='text-black block w-full p-2 mb-4 h-12 bg-gray-200 rounded drop-shadow-md'
            />

            <div className='flex flex-col items-center'>
                <button
                    onClick={handleRegistration}
                    className='dark:bg-slate-500 bg-blue-500 text-white px-4 py-2 rounded shadow'
                >
                    Register
                </button>
            </div>
        </div>
    );
}