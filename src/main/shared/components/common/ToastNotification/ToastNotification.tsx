import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Notification, removeNotification } from '../../../../../stores/NotificationSlice';
import { AppDispatch } from '../../../../../stores';
import './ToastNotification.css';

const Icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
};

interface ToastNotificationProps {
    notification: Notification;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ notification }) => {
    const dispatch: AppDispatch = useDispatch();
    const [exiting, setExiting] = useState(false);

    const handleDismiss = () => {
        setExiting(true);
    };

    const handleAnimationEnd = () => {
        if (exiting) {
            dispatch(removeNotification({ id: notification.id }));
        }
    };

    return (
        <div
            className={`toast-notification toast-${notification.type} ${exiting ? 'exiting' : 'entering'}`}
            onAnimationEnd={handleAnimationEnd}
            role="alert"
            aria-live="assertive"
        >
            <span className="toast-icon">{Icons[notification.type]}</span>
            <p className="toast-message">{notification.message}</p>
            <button
                onClick={handleDismiss}
                className="toast-close-button"
                aria-label={`Dismiss notification: ${notification.message}`}
            >
                × {/* Símbolo de multiplicación (X) */}
            </button>
        </div>
    );
};

export default ToastNotification;