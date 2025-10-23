
import React, { ReactNode } from 'react';
import { NavLink, Link, useParams } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, ChartBarIcon, LogoutIcon } from './IconComponents';
import { Role } from '../types';

interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
}

const Sidebar: React.FC<{ role: Role }> = ({ role }) => {
  const { studentId } = useParams();
  
  const navLinks = role === 'Admin' 
    ? [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Analytics', href: '#', icon: ChartBarIcon },
      ]
    : [
        { name: 'Dashboard', href: `/student/${studentId}`, icon: HomeIcon },
        { name: 'Learning Path', href: '#', icon: BookOpenIcon },
      ];

  return (
    <aside className="w-64 flex-shrink-0 bg-base-200 p-4 flex flex-col">
      <div className="text-2xl font-bold text-white mb-8">
        <Link to="/">SmartLMS</Link>
      </div>
      <nav className="flex-1 space-y-2">
        {navLinks.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-base-300 hover:text-white'
              }`
            }
          >
            <item.icon className="w-6 h-6 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div>
        <Link to="/" className="flex items-center px-4 py-3 text-lg rounded-lg text-gray-300 hover:bg-base-300 hover:text-white">
          <LogoutIcon className="w-6 h-6 mr-3" />
          Logout
        </Link>
      </div>
    </aside>
  );
};

const Header: React.FC<{ role: Role }> = ({ role }) => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm p-4 sticky top-0 z-10">
      <h1 className="text-2xl font-semibold">{role} Dashboard</h1>
    </header>
  );
};


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      <Sidebar role={role} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header role={role} />
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
