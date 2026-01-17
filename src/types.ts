export interface Blog {
    id: number;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
    comments: Comment[];
    image_url?: string;
}

export interface Comment {
    id: number;
    content: string;
    user_id: string;
    created_at: string;
    image_url?: string;
    profiles: {
        email: string;
    }
}

export interface FormData {
    id: number;
    title: string;
    content: string;
    image_url?: string | null;
}