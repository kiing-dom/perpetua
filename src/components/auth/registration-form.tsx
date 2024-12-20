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
            if(err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        };
    }

    return (
        <div>
            <h1>Register</h1>
            {error && <p className='text-red-500'>{error}</p>}
            <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='block w-full p-2 mb-2 bg-gray-200 rounded'
            />
            <button 
                onClick={handleRegistration}
                className='bg-blue-700 text-white px-4 py-2 rounded shadow'
            >
                Register
            </button>
        </div>
    );
}