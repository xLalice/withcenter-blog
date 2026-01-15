import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store/store';
import { logout } from './store/slices/authSlice';
import { useEffect, useState } from 'react';
import { fetchBlogs, setPage, deleteBlog } from './store/slices/blogSlice';
import supabase from './utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);


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

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        console.log(user)
        if (!user) return;

        const { error } = await supabase.from('blogs').insert({
            title,
            content,
            user_id: user.id
        });

        if (error) {
            alert(error.message);
        } else {
            dispatch(fetchBlogs(1));
            setIsModalOpen(false);
            setTitle('');
            setContent('');
        }
        setIsCreating(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Blog Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user?.email}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + New Post
                    </button>

                    {isModalOpen && (
                        <div className="modal modal-open">
                            <div className="modal-box">

                                <button
                                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    ✕
                                </button>

                                <h3 className="font-bold text-lg mb-4">Create a New Story</h3>

                                <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Title</span></label>
                                        <input
                                            required
                                            type="text"
                                            className="input input-bordered w-full"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Content</span></label>
                                        <textarea
                                            required
                                            className="textarea textarea-bordered h-40 w-full"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full mt-2"
                                        disabled={isCreating}
                                    >
                                        {isCreating ? 'Publishing...' : 'Publish Post'}
                                    </button>
                                </form>
                            </div>

                            <form method="dialog" className="modal-backdrop">
                                <button onClick={() => setIsModalOpen(false)}>close</button>
                            </form>
                        </div>
                    )}
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
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="card-title">{blog.title}</h2>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
=
                                    {user?.id === blog.user_id && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this?')) {
                                                    dispatch(deleteBlog(blog.id));
                                                }
                                            }}
                                            className="btn btn-error btn-xs"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

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