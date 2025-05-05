import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number; 
}

interface NotificationState {
    notifications: Notification[];
}

const initialState: NotificationState = {
    notifications: [],
};

export const addNotificationWithTimeout = createAsyncThunk<
    void,
    { message: string; type: NotificationType; duration?: number }
>(
    'notifications/addWithTimeout',
    async ({ message, type, duration = 5000 }, { dispatch }) => {
        const id = crypto.randomUUID().split('-')[4];
        console.log('Adding notification with id:', id);
        dispatch(addNotification({ id, message, type, duration }));

        setTimeout(() => {
            console.log('Removing notification with id:', id);
            dispatch(removeNotification({ id }));
        }, duration);
    }
);

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            console.log('Reducer: Adding notification:', action.payload);
            state.notifications.unshift(action.payload);
        },
        removeNotification: (state, action: PayloadAction<{ id: string }>) => {
            console.log('Reducer: Removing notification with id:', action.payload.id);
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload.id
            );
        },
    },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice;

