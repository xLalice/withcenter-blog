import { useState } from 'react';
import supabase from './utils/supabase';
import { useDispatch } from 'react-redux';
import { setSession } from './store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            dispatch(setSession(data.session));
            navigate('/dashboard');
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mb-10">Log in to continue writing and sharing your stories</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                    required
                    type="email"
                    name="email"
                    className="input input-bordered w-full"
                />

                <label htmlFor="password">Password</label>
                <input
                    required
                    type="password"
                    name="password"
                    className="input input-bordered w-full"
                />

                <button disabled={loading} className="btn btn-neutral mt-5">
                    {loading ? 'Logging in...' : 'Log in'}
                </button>

                {error && <p className='text-red-400'>{error}</p>}

                <p className="text-sm mt-4">
                    No account? <Link to="/register" className="underline">Register here</Link>
                </p>
            </form>
        </>
    );
}