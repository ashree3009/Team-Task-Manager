import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, FolderIcon, CheckSquareIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Tasks', href: '/tasks', icon: CheckSquareIcon },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen hidden md:flex fixed z-10">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <CheckSquareIcon className="w-6 h-6" />
          TaskMaster
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-1 w-full flex items-center justify-between">
          <Link to="/profile" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user?.name}</p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{user?.role}</p>
            </div>
          </Link>
          <button onClick={logout} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <LogOutIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
