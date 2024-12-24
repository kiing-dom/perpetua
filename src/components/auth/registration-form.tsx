import { useState } from 'react';
import { register, login } from '../../../auth';

interface RegisterProps {
    onRegister: (uid: string) => void;
}

export default function Register({ onRegister }: RegisterProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [displayName, setDisplayName] = useState('');

    const handleRegistration = async () => {
        try {
            await register(email, password);
            

            const user = await login(email, password);
            onRegister(user.uid);
            console.log("User registered successfully: ", user.uid);


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
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder='Display Name'
                className='text-black block w-full p-2 mb-4 h-12 bg-gray-200 rounded drop-shadow-md'
            />

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
                placeholder='Password'
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