import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store/store';
import { logout } from './store/slices/authSlice';
import { useEffect } from 'react';
import { fetchBlogs, setPage } from './store/slices/blogSlice';
import supabase from './utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { blogs, loading, page, totalPages } = useSelector((state: RootState) => state.blogs)
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchBlogs(page))
    }, [dispatch, page])

    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch(logout());
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Blog Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user?.email}</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={() => alert("TODOO")}>
                        + New Post
                    </button>
                    <button onClick={handleLogout} className="btn btn-outline btn-error">
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Loading posts...</p>
                ) : blogs.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded shadow">
                        <p className="text-gray-500">No blogs found. Be the first to write one!</p>
                    </div>
                ) : (
                    blogs.map((blog) => (
                        <div key={blog.id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">{blog.title}</h2>
                                <p className="text-gray-600 text-sm mb-2">
                                    {new Date(blog.created_at).toLocaleDateString()}
                                </p>
                                <p>{blog.content.substring(0, 150)}...</p> 
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="max-w-4xl mx-auto mt-8 flex justify-center gap-2">
                <button
                    className="btn btn-sm"
                    disabled={page === 1}
                    onClick={() => dispatch(setPage(page - 1))}
                >
                    Previous
                </button>
                <span className="flex items-center px-4 font-bold">
                    Page {page} of {totalPages || 1}
                </span>
                <button
                    className="btn btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => dispatch(setPage(page + 1))}
                >
                    Next
                </button>
            </div>
        </div>
    );
}