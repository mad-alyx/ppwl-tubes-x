import { useState, useCallback } from 'react';
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import { BACKEND_URL } from '../constants';
import { elysiaErr } from '../lib/elysiaErr';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useGoogleAuth = () => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated, setAuth, logout: clearStore } = useAuthStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error] = useState<string | null>(null);

    const handleGoogleSuccess = async (tokenResponse: TokenResponse) => {
        try {
            setIsLoading(true);

            const backendRes = await axios.post(`${BACKEND_URL}/api/auth/google`, {
                access_token: tokenResponse.access_token
            });

            const jwtToken = backendRes.data.token;
            const created = backendRes.data.created;

            setAuth(backendRes.data.user, jwtToken);
            toast.success(`Anda berhasil login. ${created ? ' [Akun Dibuat]' : ''}`);
            navigate('/beranda', { replace: true });
        } catch (err: any) {
            elysiaErr(err);
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => console.log("Login Failed"),
    });

    const logout = useCallback(() => {
        clearStore();
        window.location.href = '/';
    }, [clearStore]);

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        loginWithGoogle,
        logout,
    };
};