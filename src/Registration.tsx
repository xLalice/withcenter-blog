import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import supabase from './utils/supabase';

export default function Registration() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            alert('Registration successful! Please log in.');
            navigate('/login');
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="mb-10">Sign in to continue writing and sharing your stories</p>

            <form onSubmit={handleRegister} className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input required type='email' name="email" className="input input-bordered w-full" />

                <label htmlFor="password">Password</label>
                <input required type="password" name="password" className="input input-bordered w-full" />

                <button disabled={loading} className="btn btn-neutral mt-5">
                    {loading ? 'Creating Account...' : 'Register'}
                </button>

                {error && <p className='text-red-400'>{error}</p>}

                <p className="text-sm mt-4">
                    Already have an account? <Link to="/login" className="underline">Log in</Link>
                </p>
            </form>
        </>
    )
}