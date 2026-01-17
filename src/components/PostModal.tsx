import type { User } from "@supabase/supabase-js";
import type React from "react";
import { useEffect, useState } from "react";
import { uploadImage } from "../utils/supabase";
import { createBlog, updateBlog } from "../store/slices/blogSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import type { FormData } from "../types";

interface PostModal {
    isOpen: boolean;
    mode: 'create' | 'edit';
    onClose: () => void;
    user: User;
    blogToEdit?: FormData | null;
}

export const PostModal = ({
    isOpen,
    mode,
    onClose,
    user,
    blogToEdit
}: PostModal) => {
    const [formData, setFormData] = useState<FormData>({ id: 0, title: "", content: "", image_url: "" });
    const [file, setFile] = useState<File | null>(null);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && blogToEdit) {
                setFormData({
                    id: blogToEdit.id,
                    title: blogToEdit.title,
                    content: blogToEdit.content,
                    image_url: blogToEdit.image_url
                });
                setBlobUrl(null);
                setFile(null);
            } else {
                setFormData({ id: 0, title: "", content: "", image_url: "" });
                setFile(null);
                setBlobUrl(null);
            }
        }
    }, [isOpen, mode, blogToEdit]);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [blobUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(e.target.files?.[0] || null)
            const newUrl = URL.createObjectURL(selectedFile);
            setBlobUrl(newUrl);
        } else {
            setBlobUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);

        try {
            let finalImageUrl = formData.image_url;

            if (file) {
                const uploadedUrl = await uploadImage(file);
                if (uploadedUrl) finalImageUrl = uploadedUrl;
            }

            if (mode === 'create') {
                await dispatch(createBlog({
                    title: formData.title,
                    content: formData.content,
                    image_url: finalImageUrl || "",
                    user_id: user.id
                })).unwrap();

            } else {
                await dispatch(updateBlog({
                    ...formData,
                    image_url: finalImageUrl || ""
                })).unwrap();
            }

            onClose();

        } catch (error: any) {
            alert("Error saving post: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const displayImage = blobUrl || formData.image_url;

    return (
        <div className="modal modal-open">
            <div className="modal-box bg-white text-black border border-gray-200 shadow-2xl">

                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h3 className="font-bold text-2xl mb-6 text-gray-800">
                    {mode === 'create' ? 'Create a New Story' : 'Edit Story'}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Title</span>
                        </label>
                        <input
                            required
                            type="text"
                            className="input input-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-sky-500 focus:outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Content</span>
                        </label>
                        <textarea
                            required
                            className="textarea textarea-bordered h-40 w-full bg-white text-gray-900 border-gray-300 focus:border-sky-500 focus:outline-none leading-relaxed"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-control flex flex-col gap-2">
                        <label className="label">
                            <span className="label-text font-semibold text-gray-700">Cover Image</span>
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered file-input-info w-full bg-white text-gray-700"
                            onChange={handleFileChange}
                        />

                        {displayImage && (
                            <div className="mt-4 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                                <img
                                    src={displayImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                {blobUrl && (
                                    <div className="absolute top-2 right-2 badge badge-info text-white">
                                        New Upload
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`btn w-full mt-4 text-white border-none text-lg ${mode === 'create'
                            ? 'bg-sky-500 hover:bg-sky-600'
                            : 'bg-amber-500 hover:bg-amber-600'
                            }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Publish Post' : 'Save Changes'}
                    </button>
                </form>
            </div>

            <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
        </div>
    );
};