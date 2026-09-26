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
  Sparkles,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const { user, logout, demoLogin } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar, activePage, navigate } = useUIStore();

  const isEmployer = user?.role === 'employer';

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

  const navItems = isEmployer ? employerNavItems : studentNavItems;

  return (
    <aside
      className="sidebar-desktop"
      style={{
        width: isSidebarCollapsed ? '72px' : '240px',
        backgroundColor: 'var(--sidebar-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      <div>
        {/* Brand Logo & Collapse Toggle */}
        <div
          style={{
            height: '68px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            padding: isSidebarCollapsed ? '0' : '0 18px',
          }}
        >
          <div
            onClick={() => navigate('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            {/* Cyber Aurora Logo Mark */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #C026D3 50%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.1rem',
                boxShadow: '0 0 15px rgba(236, 72, 153, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                flexShrink: 0,
              }}
            >
              OP
            </div>
            {!isSidebarCollapsed && (
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--primary-text)',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Open<span className="gradient-text">Path</span>
                </span>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              title="Collapse Sidebar"
              style={{
                color: 'var(--secondary-text)',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Toggle for Collapsed Mode */}
        {isSidebarCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
            <button
              onClick={toggleSidebar}
              title="Expand Sidebar"
              style={{
                color: 'var(--secondary-text)',
                padding: '4px',
                borderRadius: '6px',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                title={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isSidebarCollapsed ? '12px 0' : '10px 14px',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: 'var(--radius-md)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(236, 72, 153, 0.2) 100%)'
                    : 'transparent',
                  color: isActive ? 'var(--primary-text)' : 'var(--secondary-text)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  border: isActive
                    ? '1px solid rgba(168, 85, 247, 0.45)'
                    : '1px solid transparent',
                  boxShadow: isActive ? '0 0 15px rgba(124, 58, 237, 0.25)' : 'none',
                  position: 'relative',
                  transition: 'var(--transition-normal)',
                }}
              >
                <Icon
                  size={19}
                  color={isActive ? '#F472B6' : 'currentColor'}
                />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Theme Toggle, Role Switcher & User Profile / Logout */}
      <div style={{ padding: '14px 10px', borderTop: '1px solid var(--border-color)' }}>
        {/* Appearance / Theme Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            marginBottom: '12px',
            padding: isSidebarCollapsed ? '0' : '0 4px',
          }}
        >
          {!isSidebarCollapsed && (
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--secondary-text)', letterSpacing: '0.5px' }}>
              THEME
            </span>
          )}
          <ThemeToggle showLabel={!isSidebarCollapsed} size="sm" />
        </div>

        {/* Quick Demo Switcher */}
        {!isSidebarCollapsed && (
          <div
            style={{
              padding: '10px',
              backgroundColor: 'var(--card-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
                CURRENT ROLE
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: isEmployer ? '#F472B6' : '#C084FC',
                  backgroundColor: isEmployer ? 'rgba(236, 72, 153, 0.15)' : 'rgba(124, 58, 237, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: isEmployer ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid rgba(124, 58, 237, 0.3)',
                }}
              >
                {user?.role || 'Guest'}
              </span>
            </div>
            <button
              onClick={() => {
                demoLogin(isEmployer ? 'student' : 'employer');
                navigate(isEmployer ? 'dashboard' : 'employer-dashboard');
              }}
              style={{
                width: '100%',
                padding: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--primary-text)',
                backgroundColor: 'var(--box-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <ArrowRightLeft size={12} /> Switch to {isEmployer ? 'Student Hub' : 'Employer Hub'}
            </button>
          </div>
        )}

        {/* User Card & Logout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            gap: '8px',
          }}
        >
          {!isSidebarCollapsed && (
            <div
              onClick={() => navigate('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', overflow: 'hidden' }}
            >
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
                }
                alt={user?.name || 'User'}
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <p
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--primary-text)',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {user?.name || 'OpenPath User'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>
                  {isEmployer ? 'Employer Access' : 'Student Access'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              logout();
              navigate('login');
            }}
            title="Log Out"
            style={{
              color: '#64748B',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
