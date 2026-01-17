
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

export const uploadImage = async (file: File, bucket: string = 'images'): Promise<string | null> => {
    if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
        alert("Only PNG, JPEG, and GIF images are allowed");
        return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

    if (error) {
        console.error("Upload error:", error);
        alert("Upload failed: " + error.message);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
};