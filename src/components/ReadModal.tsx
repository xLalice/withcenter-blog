import type { Blog } from "../types";

export const ReadModal = ({ blog, onClose }: { blog: Blog | null, onClose: () => void }) => {
    if (!blog) return null;
    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-4xl h-5/6 bg-white text-black overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-bold">{blog.title}</h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Posted on {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <button className="btn btn-circle btn-sm btn-ghost" onClick={onClose}>✕</button>
                </div>
                <div className="divider"></div>
                <article className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-800">{blog.content}</p>
                </article>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};