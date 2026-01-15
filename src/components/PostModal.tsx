import type React from "react";

interface FormData {
    id: number;
    title: string;
    content: string;
}

interface PostModal {
    isOpen: boolean;
    mode: 'create' | 'edit';
    formData: FormData;
    setFormData: (data: FormData) => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;

}

export const PostModal = ({
    isOpen,
    mode,
    formData,
    setFormData,
    onClose,
    onSubmit,
    isSubmitting
}: PostModal) => {
    if (!isOpen) return null;
    
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

                <form onSubmit={onSubmit} className="flex flex-col gap-5">
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

                    <button 
                        type="submit" 
                        className={`btn w-full mt-4 text-white border-none text-lg ${
                            mode === 'create' 
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