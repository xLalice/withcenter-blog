import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase';
import type { Blog } from '../../types';

interface BlogState {
    blogs: Blog[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
}

const initialState: BlogState = {
    blogs: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
};

export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (page: number, { rejectWithValue }) => {
        const ITEMS_PER_PAGE = 5;
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        try {
            const { data, count, error } = await supabase
                .from('blogs')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            return { data, count, page };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteBlog = createAsyncThunk(
    'blogs/deleteBlog',
    async (id: number, { rejectWithValue }) => {
        try {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBlog = createAsyncThunk(
    'blogs/updateBlog',
    async ({ id, title, content }: { id: number, title: string, content: string }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .update({ title, content })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload.data || [];
                state.page = action.payload.page;
                const totalCount = action.payload.count || 0;
                state.totalPages = Math.ceil(totalCount / 5);
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
                if (index !== -1) {
                    state.blogs[index] = action.payload;
                }
            });
    },
});

export const { setPage } = blogSlice.actions;
export default blogSlice.reducer;