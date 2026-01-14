import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { logout } from './store/slices/authSlice';

export default function Dashboard() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    return (
        <div>
            <div className='flex justify-between p-4'>
                <h1 className='font-bold text-4xl'>WithCenter Blog</h1>
                <button className='btn btn-error' onClick={() => dispatch(logout())}>Logout</button>
            </div>
            <div className='p-10'>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="mt-4">
                    Welcome back, <span className="font-bold text-blue-500">{user?.email || 'User'}</span>!
                </p>

                <div className="mt-10 p-5 bg-gray-100 rounded-lg">
                    <p>Blog posts will load here...</p>
                </div>
            </div>
        </div>
    )
}