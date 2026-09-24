import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  CheckCheck,
  ExternalLink,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { useOpportunityStore } from '../store/useOpportunityStore';
import api from '../utils/api';

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { activePage, navigate, setMobileDrawerOpen } = useUIStore();
  const { setSearchQuery } = useOpportunityStore();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [navSearch, setNavSearch] = useState('');

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      setSearchQuery(navSearch.trim());
      navigate('opportunities');
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Student Hub';
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
    <header
      style={{
        height: '68px',
        backgroundColor: 'rgba(7, 10, 19, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: Mobile hamburger + Page Title & Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          style={{
            display: 'none',
            color: 'var(--secondary-text)',
            padding: '6px',
          }}
          className="mobile-menu-btn"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
            {getPageTitle()}
          </h2>
          {isAuthenticated && user && (
            <p style={{ fontSize: '0.775rem', color: 'var(--secondary-text)' }}>
              Welcome back, <strong style={{ color: '#C084FC' }}>{user.name.split(' ')[0]}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Middle: Cyber Aurora Search Bar */}
      <div style={{ flex: '1', maxWidth: '440px', margin: '0 20px' }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <Search
            size={18}
            color="#94A3B8"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search roles, skills (e.g. React, Python), companies..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 14px 9px 40px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              color: '#F8FAFC',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'var(--transition-normal)',
            }}
          />
        </form>
      </div>

      {/* Right: Notifications Bell & User Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#CBD5E1',
              position: 'relative',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '7px',
                  right: '7px',
                  width: '9px',
                  height: '9px',
                  backgroundColor: '#EC4899',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px #EC4899',
                }}
              />
            )}
          </button>

          {/* Dropdown Card */}
          {showNotifMenu && (
            <div
              className="card animate-fade-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '350px',
                maxHeight: '420px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(13, 18, 34, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(124, 58, 237, 0.25)',
                zIndex: 100,
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={16} color="#A78BFA" />
                  <strong style={{ fontSize: '0.875rem', color: '#F8FAFC' }}>Notifications</strong>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: 'rgba(236, 72, 153, 0.2)',
                        color: '#F472B6',
                        border: '1px solid rgba(236, 72, 153, 0.4)',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontWeight: 700,
                      }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      fontSize: '0.75rem',
                      color: '#C084FC',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '28px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                    <p style={{ fontSize: '0.85rem' }}>No notifications right now.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      style={{
                        padding: '12px 18px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: n.isRead ? 'transparent' : 'rgba(124, 58, 237, 0.1)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onClick={() => {
                        setShowNotifMenu(false);
                        if (n.relatedApplication) navigate('applications');
                        else if (n.relatedOpportunity)
                          navigate('details', { id: n.relatedOpportunity._id || n.relatedOpportunity });
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#F8FAFC' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.775rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Role */}
        {isAuthenticated && user ? (
          <div
            onClick={() => navigate('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 12px 4px 4px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            <img
              src={
                user.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
              }
              alt={user.name}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>
              {user.name.split(' ')[0]}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                background: user.role === 'employer' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(124, 58, 237, 0.25)',
                color: user.role === 'employer' ? '#F472B6' : '#C084FC',
                border: user.role === 'employer' ? '1px solid rgba(236, 72, 153, 0.4)' : '1px solid rgba(124, 58, 237, 0.4)',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {user.role}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('login')} className="btn-secondary" style={{ padding: '6px 16px' }}>
              Sign In
            </button>
            <button onClick={() => navigate('register')} className="btn-primary" style={{ padding: '6px 18px' }}>
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
