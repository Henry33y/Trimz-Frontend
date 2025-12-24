/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer, useContext, useCallback, useRef } from "react";
import { io } from 'socket.io-client';
import { BASE_URL } from "../config"; // use BASE_URL directly

// Initial state setup
const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    role: localStorage.getItem('role') || null,
    token: localStorage.getItem('token') || null,
    unreadNotifications: 0
};

// Create AuthContext
export const AuthContext = createContext(initialState);

// Reducer to handle login, logout, and other actions
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, user: null, role: null, token: null };
        case 'LOGIN_SUCCESS':
            return { ...state, user: action.payload.user, token: action.payload.token, role: action.payload.role };
        case 'LOGOUT':
            localStorage.clear();
            return { ...state, user: null, role: null, token: null, unreadNotifications: 0 };
        case 'UPDATE_USER':
            return { ...state, user: action.payload };
        case 'SET_NOTIFICATION_COUNT':
            return { ...state, unreadNotifications: action.payload };
        default:
            return state;
    }
};

// AuthContextProvider
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const socketRef = useRef(null);

    // Sync localStorage with state
    useEffect(() => {
        if (state.user) localStorage.setItem('user', JSON.stringify(state.user));
        else localStorage.removeItem('user');

        if (state.role) localStorage.setItem('role', state.role);
        else localStorage.removeItem('role');

        if (state.token) localStorage.setItem('token', state.token);
        else localStorage.removeItem('token');
    }, [state.user, state.role, state.token]);

    // Notification refresh function
    const refreshNotifications = useCallback(async () => {
        if (!state.user || !state.user._id || state.role !== "provider") {
            dispatch({ type: 'SET_NOTIFICATION_COUNT', payload: 0 });
            return;
        }

        try {
            const token = localStorage.getItem('token'); // read token dynamically
            const res = await fetch(`${BASE_URL}/users/${state.user._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch notifications");

            const data = await res.json();
            const unread = typeof data?.unread === 'number' ? data.unread : 0;
            dispatch({ type: 'SET_NOTIFICATION_COUNT', payload: unread });
        } catch (err) {
            console.error("Error fetching notification count:", err);
        }
    }, [state.user, state.role]);

    // Initialize socket and notifications
    useEffect(() => {
        if (state.user && state.user._id && state.role === "provider" && state.token) {
            refreshNotifications();

            if (!socketRef.current) {
                socketRef.current = io(BASE_URL.replace('/api/v1', ''), { // remove /api/v1 for socket
                    auth: { token: state.token },
                    transports: ['websocket']
                });

                socketRef.current.on('connect', () => {
                    console.log('Socket connected');
                });

                ['notification:new', 'notification:update', 'notification:delete'].forEach(event => {
                    socketRef.current.on(event, refreshNotifications);
                });
            }
        } else {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }
    }, [state.user, state.role, state.token, refreshNotifications]);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                token: state.token,
                role: state.role,
                unreadCount: state.unreadNotifications,
                dispatch,
                refreshNotifications
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);