import React from 'react';
import {
  Compass,
  Briefcase,
  FileText,
  BookOpen,
  User,
  LayoutDashboard,
  PlusCircle,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import ThemeToggle from './ThemeToggle';
import AnimatedLogo from './AnimatedLogo';

export default function Sidebar() {
  const { user } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar, activePage, navigate, openSignOutModal } = useUIStore();

  const isEmployer = user?.role === 'employer';
  const isAdmin = user?.role === 'admin';

  const studentNavItems = [
    { id: 'dashboard', label: 'Student Hub', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Explore & Browse', icon: Compass },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'learning', label: 'Skills & Learning', icon: BookOpen },
    { id: 'profile', label: 'Digital Resume', icon: User },
  ];

  const employerNavItems = [
    { id: 'employer-dashboard', label: 'Employer Hub', icon: LayoutDashboard },
    { id: 'create-opportunity', label: 'Post Opportunity', icon: PlusCircle },
    { id: 'manage-opportunities', label: 'Manage Listings', icon: Layers },
    { id: 'candidate-review', label: 'Candidate Review', icon: Users },
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Command', icon: ShieldCheck },
    { id: 'opportunities', label: 'Browse Listings', icon: Compass },
    { id: 'profile', label: 'Admin Profile', icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : isEmployer ? employerNavItems : studentNavItems;

  return (
    <aside
      className={`sidebar-desktop ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}
    >
      <div>
        {/* Brand Logo & Collapse Toggle */}
        <div
          className={`sidebar-header ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}
        >
          <div
            onClick={() => navigate('landing')}
            className="sidebar-logo-brand"
          >
            {/* 3D Animated Logo Mark */}
            <AnimatedLogo size="sm" showRings={!isSidebarCollapsed} />
            {!isSidebarCollapsed && (
              <div>
                <span className="sidebar-logo-text">
                  Open<span className="gradient-text">Path</span>
                </span>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              title="Collapse Sidebar"
              className="btn-ghost"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Toggle for Collapsed Mode */}
        {isSidebarCollapsed && (
          <div className="sidebar-expand-btn-wrap">
            <button
              onClick={toggleSidebar}
              title="Expand Sidebar"
              className="btn-ghost"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="sidebar-nav-container">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                title={item.label}
                className={`sidebar-nav-item ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}
              >
                <Icon size={19} color={isActive ? '#F472B6' : 'currentColor'} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Theme Toggle & User Profile / Logout */}
      <div className="sidebar-footer">
        {/* Appearance / Theme Toggle */}
        <div className={`sidebar-theme-wrap ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
          {!isSidebarCollapsed && (
            <span className="sidebar-theme-label">
              THEME
            </span>
          )}
          <ThemeToggle showLabel={!isSidebarCollapsed} size="sm" />
        </div>

        {/* User Card & Logout */}
        <div className={`sidebar-user-wrap ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
          {!isSidebarCollapsed && (
            <div
              onClick={() => navigate('profile')}
              className="sidebar-user-profile"
            >
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
                }
                alt={user?.name || 'User'}
                className="sidebar-user-avatar"
              />
              <div className="sidebar-user-meta">
                <p className="sidebar-user-name">
                  {user?.name || 'OpenPath User'}
                </p>
                <p className="sidebar-user-role">
                  {isAdmin ? 'System Administrator' : isEmployer ? 'Employer Access' : 'Student Access'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={openSignOutModal}
            title="Log Out"
            className="navbar-signout-btn"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
