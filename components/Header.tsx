import React from 'react';
import { UserRole, Notification } from '../types';
import Notifications from './Notifications';
import { Logo } from './Logo';

interface HeaderProps {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectOrder: (id: string) => void;
}

const roleNames: Record<UserRole, string> = {
  [UserRole.Admin]: 'Admin (Carga)',
  [UserRole.Designer]: 'Diseñador',
  [UserRole.Producer]: 'Productor',
};

const roleClasses: Record<UserRole, string> = {
    [UserRole.Admin]: 'bg-blue-600 hover:bg-blue-700',
    [UserRole.Designer]: 'bg-orange-500 hover:bg-orange-600',
    [UserRole.Producer]: 'bg-cyan-500 hover:bg-cyan-600',
};

const Header: React.FC<HeaderProps> = ({ currentUserRole, setCurrentUserRole, notifications, onMarkAsRead, onMarkAllAsRead, onSelectOrder }) => {
  return (
    <header className="bg-gray-800 p-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Logo />
          <h1 className="text-2xl font-bold text-white">
            Sd organizer
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Notifications
            notifications={notifications}
            currentUserRole={currentUserRole}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onSelectOrder={onSelectOrder}
          />
          <span className="text-gray-300 hidden sm:block">Vista como:</span>
          <div className="flex rounded-md shadow-sm">
            {(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((key) => (
              <button
                key={UserRole[key]}
                onClick={() => setCurrentUserRole(UserRole[key])}
                className={`px-4 py-2 text-sm font-medium text-white transition-colors duration-200 
                  ${currentUserRole === UserRole[key] ? `${roleClasses[UserRole[key]]} z-10 ring-2 ring-white` : 'bg-gray-700 hover:bg-gray-600'}
                  ${key === 'Admin' ? 'rounded-l-md' : ''}
                  ${key === 'Producer' ? 'rounded-r-md' : ''}
                `}
              >
                {roleNames[UserRole[key]]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;