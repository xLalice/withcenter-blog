import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import supabase from './utils/supabase';
import { setSession } from './store/slices/authSlice';

interface AuthFormProps {
    mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
    const isLogin = mode === 'login';
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message);
            } else {
                dispatch(setSession(data.session));
                navigate('/dashboard');
            }
        } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setError(error.message);
            } else {
                alert('Registration successful! Please log in.');
                navigate('/login');
            }
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold">{isLogin ? "Welcome back" : "Create Account"}</h1>
            <p className="mb-10 text-white/80">
                {isLogin ? "Log in to continue writing" : "Sign up to start your journey"}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="form-control flex flex-col">
                    <label className="label text-white">Email</label>
                    <input required type="email" name="email" className="input input-bordered text-black w-full" />
                </div>

                <div className="form-control flex flex-col">
                    <label className="label text-white">Password</label>
                    <input required type="password" name="password" className="input input-bordered text-black w-full" />
                </div>

                <button disabled={loading} className="btn btn-neutral mt-5 border-none bg-sky-900 hover:bg-sky-800 text-white">
                    {loading
                        ? (isLogin ? 'Logging in...' : 'Creating account...')
                        : (isLogin ? 'Log in' : 'Register')
                    }
                </button>

                {error && <div className="alert alert-error text-sm mt-2">{error}</div>}

                <div className="text-sm mt-4 text-center text-white">
                    {isLogin ? "No account? " : "Already have an account? "}
                    <Link to={isLogin ? "/register" : "/login"} className="underline font-bold">
                        {isLogin ? "Register here" : "Log in"}
                    </Link>
                </div>
            </form>
        </div>
    );
}