
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import type { AppDispatch, RootState } from "./store/store";
import { deleteBlog, fetchBlogs, setPage } from "./store/slices/blogSlice";
import supabase from "./utils/supabase";
import { logout } from "./store/slices/authSlice";
import type { Blog } from "./types";
import { PostModal } from "./components/PostModal";
import { ReadModal } from "./components/ReadModal";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const user = useSelector((state: RootState) => state.auth.user);
    const { blogs, loading, page, totalPages } = useSelector((state: RootState) => state.blogs);

    const [viewBlog, setViewBlog] = useState<Blog | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

    useEffect(() => {
        dispatch(fetchBlogs(page));
    }, [dispatch, page]);


    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch(logout());
        navigate('/login');
    };

    const openCreateModal = () => {
        setFormMode('create');
        setIsFormOpen(true);
    };

    const openEditModal = () => {
        setFormMode('edit');
        setIsFormOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            dispatch(deleteBlog(id));
        }
    };

    if (!user) return;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Blog Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user?.email}</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        className="btn bg-sky-500 hover:bg-sky-600 text-white border-none"
                        onClick={openCreateModal}
                    >
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
                        <div key={blog.id} className="card bg-sky-500 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="card-title">{blog.title}</h2>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {new Date(blog.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {user?.id === blog.user_id && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => openEditModal()} 
                                                className="btn btn-warning btn-xs text-white"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(blog.id)} 
                                                className="btn btn-error btn-xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-700 mb-4">{blog.content.substring(0, 150)}...</p>
                                <div className="card-actions justify-end">
                                    <button 
                                        className="btn bg-sky-900 hover:bg-sky-600 text-white border-none btn-sm"
                                        onClick={() => setViewBlog(blog)}
                                    >
                                        Read Full Story
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="max-w-4xl mx-auto mt-8 flex justify-center gap-2">
                <button 
                    className="btn btn-sm bg-sky-500 border-none"
                    disabled={page === 1} 
                    onClick={() => dispatch(setPage(page - 1))}
                >
                    Previous
                </button>
                <span className="flex items-center px-4 font-bold text-black">
                    Page {page} of {totalPages || 1}
                </span>
                <button 
                    className="btn btn-sm bg-sky-500 border-none"
                    disabled={page >= totalPages} 
                    onClick={() => dispatch(setPage(page + 1))}
                >
                    Next
                </button>
            </div>

            <PostModal
                isOpen={isFormOpen}
                mode={formMode}
                onClose={() => setIsFormOpen(false)}
                user={user}
                
            />

            <ReadModal
                blog={viewBlog} 
                onClose={() => setViewBlog(null)} 
            />
        </div>
    );
}