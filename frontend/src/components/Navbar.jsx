import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  CheckCheck,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/api';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { activePage, navigate, setMobileDrawerOpen, openSignOutModal } = useUIStore();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('/notifications')
        .then((res) => {
          setNotifications(res.data.notifications || []);
          setUnreadCount(res.data.unreadCount || 0);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, activePage]);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return user?.role === 'admin' ? 'Admin Command Center' : user?.role === 'employer' ? 'Employer Hub' : 'Student Hub';
      case 'admin':
        return 'Admin Command Center';
      case 'opportunities':
        return 'Explore Opportunities';
      case 'details':
        return 'Opportunity Details';
      case 'match':
        return 'Match Score Breakdown';
      case 'skill-gap':
        return 'Skill Gap Analysis';
      case 'learning':
        return 'Personalized Learning Roadmap';
      case 'applications':
        return 'Application Tracking';
      case 'profile':
        return 'Digital Resume & Profile';
      case 'employer-dashboard':
        return 'Employer Command Center';
      case 'create-opportunity':
        return 'Create Opportunity';
      case 'manage-opportunities':
        return 'Manage Listings';
      case 'candidate-review':
        return 'Candidate Review & Matching';
      default:
        return 'OpenPath';
    }
  };

  return (
    <header className="navbar-header">
      {/* Left: Mobile hamburger + Page Title & Welcome */}
      <div className="navbar-left">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="navbar-title">{getPageTitle()}</h2>
          {isAuthenticated && user && (
            <p className="navbar-welcome">
              Welcome back, <strong className="navbar-welcome-name">{user.name.split(' ')[0]}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications Bell & User Pill */}
      <div className="navbar-right">
        {/* Light / Dark Mode Toggle Button */}
        <ThemeToggle size="default" />

        {/* Notifications Dropdown */}
        <div className="relative-wrap">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="navbar-bell-btn"
            aria-label="Toggle notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="navbar-unread-dot" />}
          </button>

          {/* Dropdown Card */}
          {showNotifMenu && (
            <div className="card animate-fade-in navbar-dropdown-card">
              <div className="navbar-dropdown-header">
                <div className="navbar-dropdown-header-left">
                  <Bell size={16} color="#7C3AED" />
                  <strong className="navbar-dropdown-title">Notifications</strong>
                  {unreadCount > 0 && (
                    <span className="navbar-unread-pill">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="navbar-mark-read-btn">
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="navbar-dropdown-body">
                {notifications.length === 0 ? (
                  <div className="navbar-empty-notif">
                    <p className="candidate-bg-desc">No notifications right now.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`navbar-notif-item ${n.isRead ? '' : 'unread'}`}
                      onClick={() => {
                        setShowNotifMenu(false);
                        if (n.relatedApplication) navigate('applications');
                        else if (n.relatedOpportunity)
                          navigate('details', { id: n.relatedOpportunity._id || n.relatedOpportunity });
                      }}
                    >
                      <div className="navbar-notif-title-row">
                        <span className="navbar-notif-item-title">
                          {n.title}
                        </span>
                        <span className="navbar-notif-time">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="navbar-notif-message">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Role + Sign Out Button */}
        {isAuthenticated && user ? (
          <div className="navbar-user-group">
            <div
              onClick={() => navigate('profile')}
              title="View Digital Resume Profile"
              className="navbar-profile-pill"
            >
              <img
                src={
                  user.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
                }
                alt={user.name}
                className="navbar-profile-avatar"
              />
              <span className="navbar-profile-name">
                {(user.name || 'User').split(' ')[0]}
              </span>
              <span className={`navbar-role-badge role-${user.role}`}>
                {user.role}
              </span>
            </div>

            {user.role === 'admin' && activePage !== 'admin' && (
              <button
                onClick={() => navigate('admin')}
                className="btn-primary navbar-admin-btn"
              >
                Admin Command
              </button>
            )}

            <button
              onClick={openSignOutModal}
              title="Sign Out"
              className="navbar-signout-btn"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="navbar-auth-group">
            <button onClick={() => navigate('login')} className="btn-secondary navbar-btn">
              Sign In
            </button>
            <button onClick={() => navigate('register')} className="btn-primary navbar-btn">
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
