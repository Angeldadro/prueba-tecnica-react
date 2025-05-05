import React from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../stores';
import ToastNotification from './ToastNotification';
import './ToastContainer.css';

const ToastContainer: React.FC = () => {
    // Obtiene la lista de notificaciones del estado de Redux
    const notifications = useSelector((state: RootState) => state.notifications.notifications);

    // Busca o crea el elemento del DOM donde se renderizará el portal
    let portalRoot = document.getElementById('toast-portal');
    if (!portalRoot) {
        portalRoot = document.createElement('div');
        portalRoot.setAttribute('id', 'toast-portal');
        document.body.appendChild(portalRoot);
    }

    return createPortal(
        <div className="toast-container">
            {/* Mapea las notificaciones y renderiza cada una */}
            {notifications.map((notification) => (
                <ToastNotification
                    key={notification.id} // ¡Key es esencial!
                    notification={notification}
                />
            ))}
        </div>,
        portalRoot // Renderiza dentro del elemento portalRoot
    );
};

export default ToastContainer;