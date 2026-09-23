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
        backgroundColor: '#FFFFFF',
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
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--primary-text)' }}>
            {getPageTitle()}
          </h2>
          {isAuthenticated && user && (
            <p style={{ fontSize: '0.775rem', color: 'var(--secondary-text)' }}>
              Welcome back, <strong style={{ color: 'var(--primary-blue)' }}>{user.name.split(' ')[0]}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Middle: Prominent Search Bar with Autocomplete Suggestions */}
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
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-color)',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              color: 'var(--primary-text)',
              outline: 'none',
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
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary-text)',
              position: 'relative',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--primary-blue)',
                  borderRadius: '50%',
                  boxShadow: '0 0 0 2px #FFFFFF',
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
                width: '340px',
                maxHeight: '420px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FAFAFA',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bell size={16} color="var(--primary-blue)" />
                  <strong style={{ fontSize: '0.875rem' }}>Notifications</strong>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#EFF6FF',
                        color: 'var(--primary-blue)',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontWeight: 600,
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
                      color: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 500,
                    }}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                    <p style={{ fontSize: '0.85rem' }}>No notifications right now.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      style={{
                        padding: '10px 16px',
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: n.isRead ? 'transparent' : '#F0F7FF',
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
                        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
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
              padding: '4px 10px 4px 4px',
              borderRadius: '9999px',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
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
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-text)' }}>
              {user.name.split(' ')[0]}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: user.role === 'employer' ? '#F5F3FF' : '#EFF6FF',
                color: user.role === 'employer' ? '#7C3AED' : 'var(--primary-blue)',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {user.role}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('login')} className="btn-secondary" style={{ padding: '6px 14px' }}>
              Sign In
            </button>
            <button onClick={() => navigate('register')} className="btn-primary" style={{ padding: '6px 14px' }}>
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
