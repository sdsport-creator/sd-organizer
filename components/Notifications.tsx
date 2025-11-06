import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Notification, UserRole } from '../types';
import { BellIcon } from './Icons';

interface NotificationsProps {
    notifications: Notification[];
    currentUserRole: UserRole;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onSelectOrder: (id: string) => void;
}

function formatDistanceToNow(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `hace ${seconds}s`;
    if (minutes < 60) return `hace ${minutes}m`;
    if (hours < 24) return `hace ${hours}h`;
    return `hace ${days}d`;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, currentUserRole, onMarkAsRead, onMarkAllAsRead, onSelectOrder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userNotifications = useMemo(() => {
        return notifications
            .filter(n => n.targetRoles.includes(currentUserRole))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [notifications, currentUserRole]);
    
    const unreadCount = useMemo(() => {
        return userNotifications.filter(n => !n.isRead).length;
    }, [userNotifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }
        onSelectOrder(notification.orderId);
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-300 hover:text-white">
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-20">
                    <div className="p-3 flex justify-between items-center border-b border-gray-600">
                        <h4 className="font-bold text-white">Notificaciones</h4>
                        {userNotifications.length > 0 && <button onClick={onMarkAllAsRead} className="text-sm text-blue-400 hover:underline">Marcar todas como leídas</button>}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {userNotifications.length === 0 ? (
                            <p className="text-gray-400 p-4 text-center">No hay notificaciones.</p>
                        ) : (
                            userNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-600 ${notification.isRead ? 'opacity-60' : 'bg-gray-700/50'}`}
                                >
                                    <p className="text-sm text-gray-200">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(notification.timestamp)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
