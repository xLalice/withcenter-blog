import { useEffect, useState } from 'react';
import supabase, { uploadImage } from '../utils/supabase';
import type { Comment } from '../types';
import type { User } from '@supabase/supabase-js';
import { useDispatch } from 'react-redux';
import { addCommentToBlog, removeCommentFromBlog } from '../store/slices/blogSlice';

interface CommentSection {
    blogId: number;
    initialComments: Comment[];
    currentUser: User;
}

export const CommentSection = ({ blogId, initialComments, currentUser }: CommentSection) => {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const [commentImage, setCommentImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'saving'>('idle');
    const dispatch = useDispatch();

    useEffect(() => {
        if (!commentImage) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(commentImage);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [commentImage]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;
        setStatus('uploading');

        setIsSubmitting(true);
        let imageUrl = null;

        if (commentImage) {
            imageUrl = await uploadImage(commentImage);
            if (!imageUrl) alert("Image not uploaded")
        }
        setStatus('saving');

        const { data, error } = await supabase
            .from('comments')
            .insert({
                content: newComment,
                blog_id: blogId,
                user_id: currentUser.id,
                image_url: imageUrl
            })
            .select('*, profiles(email)')
            .single();

        if (!error && data) {
            setComments([...comments, data]); 

            dispatch(addCommentToBlog({ blogId, comment: data }));

            setNewComment('');
            setCommentImage(null);
        }
        setIsSubmitting(false);
        setStatus('idle');
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        setComments(comments.filter((c) => c.id !== commentId));

        dispatch(removeCommentFromBlog({ blogId, commentId })); 

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            alert("Failed to delete: " + error.message);
        }
    };

    return (
        <div className="mt-8 border-t pt-6">
            <h4 className="text-xl font-bold mb-4">Comments ({comments.length})</h4>

            <div className="space-y-4 mb-6">
                {comments.map((c: Comment) => {

                    console.log(`Comment ID: ${c.id}`, {
                        currentUser: currentUser?.id,
                        commentOwner: c.user_id,
                        match: currentUser?.id === c.user_id
                    });
                    return (
                        <div key={c.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sky-600 text-sm">{c.profiles?.email}</span>
                                <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                            </div>
                            {currentUser?.id === c.user_id && (
                                <button
                                    onClick={() => handleDeleteComment(c.id)}
                                    className="btn btn-ghost bg-red-500 btn-xs hover:bg-red-600 ml-auto"
                                    title="Delete comment"
                                >
                                    Trash 🗑️
                                </button>
                            )}
                            <p className="text-gray-800">{c.content}</p>
                            {c.image_url && (
                                <img src={c.image_url} alt="Comment" className="mt-2 rounded-md max-h-40 w-auto object-cover" />
                            )}
                        </div>
                    )
                })}
            </div>

            {currentUser && (
                <form onSubmit={handleAddComment} className="flex flex-col gap-3">
                    <textarea
                        className="textarea textarea-bordered w-full bg-white text-black border-blue-500"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    {previewUrl && (
                        <div className="relative w-32 h-32 mb-2 rounded-lg overflow-hidden border border-gray-300">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                className="absolute top-1 right-1 btn btn-circle btn-xs btn-error"
                                onClick={() => setCommentImage(null)}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    {status !== 'idle' && (
                        <div className="w-full animate-pulse">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{status === 'uploading' ? 'Uploading image to cloud...' : 'Finalizing comment...'}</span>
                                <span className="loading loading-spinner loading-xs"></span>
                            </div>
                            <progress className="progress progress-primary w-full"></progress>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        {!previewUrl && <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-xs bg-white"
                            onChange={(e) => setCommentImage(e.target.files?.[0] || null)}
                        />}
                        <button
                            className="btn btn-primary btn-sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};