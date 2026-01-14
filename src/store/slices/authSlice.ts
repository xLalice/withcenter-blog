import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
    session: Session | null,
    user: any;
    isLoggedIn: boolean;
}

const initialState: AuthState = {
    session: null,
    user: null,
    isLoggedIn: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<Session | null>) => {
            state.session = action.payload;
            state.user = action.payload?.user || null;
            state.isLoggedIn = !!action.payload;
        },
        logout: (state) => {
            state.session = null;
            state.user = null;
            state.isLoggedIn = false;
        }
    }
})

export const { setSession, logout } = authSlice.actions;
export default authSlice.reducer;