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
        backgroundColor: '#FFFFFF',
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
            {/* Logo Mark */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.1rem',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
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
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--secondary-navy)',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Open<span style={{ color: 'var(--primary-blue)' }}>Path</span>
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
        <nav style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                  color: isActive ? 'var(--primary-blue)' : 'var(--secondary-text)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                  position: 'relative',
                  transition: 'var(--transition-normal)',
                }}
              >
                <Icon size={20} color={isActive ? 'var(--primary-blue)' : 'currentColor'} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Role Switcher & User Profile / Logout */}
      <div style={{ padding: '14px 10px', borderTop: '1px solid var(--border-color)' }}>
        {/* Quick Demo Switcher */}
        {!isSidebarCollapsed && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed #CBD5E1',
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
                  color: isEmployer ? '#7C3AED' : 'var(--primary-blue)',
                  backgroundColor: isEmployer ? '#F5F3FF' : '#EFF6FF',
                  padding: '1px 6px',
                  borderRadius: '4px',
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
                color: 'var(--primary-blue)',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <ArrowRightLeft size={12} /> Switch to {isEmployer ? 'Student View' : 'Employer View'}
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
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
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
              color: '#94A3B8',
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
