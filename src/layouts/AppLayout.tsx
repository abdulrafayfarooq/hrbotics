
import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, Video, FileText, LogOut, Menu } from 'lucide-react';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Interview', path: '/interview', icon: Video },
    { name: 'Results', path: '/results', icon: FileText },
    { name: 'Resume', path: '/resume', icon: FileText },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-white shadow-lg",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-full flex-col py-6">
          <div className="flex items-center justify-between px-4 mb-6">
            {sidebarOpen && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-virtualhr-purple">VirtualHR</h2>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-gray-500 hover:bg-virtualhr-purple-soft hover:text-virtualhr-purple"
            >
              <Menu size={20} />
            </Button>
          </div>

          <nav className="flex flex-col flex-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center py-3 px-3 mb-1 rounded-lg transition-all",
                  isActive
                    ? "bg-virtualhr-purple text-white"
                    : "text-gray-700 hover:bg-virtualhr-purple-soft hover:text-virtualhr-purple",
                )}
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="px-2 py-4 mt-auto">
            {sidebarOpen && (
              <div className="px-2 py-2 mb-3 animate-fade-in">
                <div className="text-sm font-semibold">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "flex items-center w-full rounded-lg py-3 transition-all text-gray-700 hover:bg-red-50 hover:text-red-600",
                !sidebarOpen && "justify-center"
              )}
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Log out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-64" : "ml-16"
      )}>
        <div className="container py-8 px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
