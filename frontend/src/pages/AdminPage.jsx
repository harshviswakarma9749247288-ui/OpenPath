import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  BookOpen,
  Activity,
  Server,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  PlusCircle,
  RefreshCw,
  ExternalLink,
  Edit,
  UserCheck,
  UserX,
  Clock,
  Filter,
  Sliders,
  Send,
  Database,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  Eye,
  Award,
  Ban,
  Check,
  Copy,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/api';
import BackButton from '../components/BackButton';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';

// SkillLoop-style Modals for Admin
import RoleChangeModal from '../components/admin/RoleChangeModal';
import UserBanModal from '../components/admin/UserBanModal';
import UserDetailsModal from '../components/admin/UserDetailsModal';
import DeleteConfirmationModal from '../components/admin/DeleteConfirmationModal';
import EditSkillModal from '../components/admin/EditSkillModal';
import OpportunityStatusModal from '../components/admin/OpportunityStatusModal';

export default function AdminPage({ initialTab = 'overview' }) {
  const { user } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState(initialTab || 'overview'); // 'overview' | 'users' | 'opportunities' | 'skills' | 'applications' | 'system'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [statsData, setStatsData] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Users tab state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Opportunities tab state
  const [opportunities, setOpportunities] = useState([]);
  const [oppSearch, setOppSearch] = useState('');
  const [oppStatusFilter, setOppStatusFilter] = useState('all');
  const [isLoadingOpps, setIsLoadingOpps] = useState(false);

  // Skills tab state
  const [skills, setSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('all');
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  // Applications tab state
  const [applications, setApplications] = useState([]);
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [isLoadingApps, setIsLoadingApps] = useState(false);

  // Platform announcement edit
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementBadge, setAnnouncementBadge] = useState('');
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);

  // --- MODAL STATES ---
  // 1. Role Change Modal
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // 2. User Ban / Suspend ID Modal
  const [banModalUser, setBanModalUser] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // 3. User Details Inspect Modal
  const [inspectUser, setInspectUser] = useState(null);

  // 4. Delete Confirmation Modal
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    type: null, // 'user' | 'opportunity' | 'skill'
    item: null, // { id, title, subtitle }
  });
  const [isDeletingResource, setIsDeletingResource] = useState(false);

  // 5. Skill Modal (Add or Edit)
  const [skillModalState, setSkillModalState] = useState({
    isOpen: false,
    skill: null, // null for create, object for edit
  });
  const [isSavingSkill, setIsSavingSkill] = useState(false);

  // 6. Opportunity Status Modal
  const [oppStatusModalOpp, setOppStatusModalOpp] = useState(null);
  const [isUpdatingOppStatus, setIsUpdatingOppStatus] = useState(false);

  // Verify Admin authorization
  const isAdmin = user?.role === 'admin';

  // 1. Fetch High Level Stats
  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await api.get('/admin/stats');
      setStatsData(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to load admin telemetry', 'error');
    } finally {
      setIsLoadingStats(false);
    }
  };

  // 2. Fetch Users
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const params = new URLSearchParams();
      if (userRoleFilter !== 'all') params.append('role', userRoleFilter);
      if (userStatusFilter !== 'all') params.append('status', userStatusFilter);
      if (userSearch.trim()) params.append('search', userSearch.trim());

      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data.users || []);
    } catch (err) {
      showToast(err.message || 'Failed to load users', 'error');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 3. Fetch Opportunities
  const fetchOpportunities = async () => {
    setIsLoadingOpps(true);
    try {
      const params = new URLSearchParams();
      if (oppStatusFilter !== 'all') params.append('status', oppStatusFilter);
      if (oppSearch.trim()) params.append('search', oppSearch.trim());

      const res = await api.get(`/admin/opportunities?${params.toString()}`);
      setOpportunities(res.data.opportunities || []);
    } catch (err) {
      showToast(err.message || 'Failed to load opportunities', 'error');
    } finally {
      setIsLoadingOpps(false);
    }
  };

  // 4. Fetch Skills
  const fetchSkills = async () => {
    setIsLoadingSkills(true);
    try {
      const params = new URLSearchParams();
      if (skillCategoryFilter !== 'all') params.append('category', skillCategoryFilter);
      if (skillSearch.trim()) params.append('search', skillSearch.trim());

      const res = await api.get(`/admin/skills?${params.toString()}`);
      setSkills(res.data.skills || []);
    } catch (err) {
      showToast(err.message || 'Failed to load skills taxonomy', 'error');
    } finally {
      setIsLoadingSkills(false);
    }
  };

  // 5. Fetch Applications
  const fetchApplications = async () => {
    setIsLoadingApps(true);
    try {
      const params = new URLSearchParams();
      if (appStatusFilter !== 'all') params.append('status', appStatusFilter);

      const res = await api.get(`/admin/applications?${params.toString()}`);
      setApplications(res.data.applications || []);
    } catch (err) {
      showToast(err.message || 'Failed to load applications', 'error');
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  // Tab change triggers
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'opportunities') fetchOpportunities();
    if (activeTab === 'skills') fetchSkills();
    if (activeTab === 'applications') fetchApplications();
  }, [activeTab, isAdmin]);

  // Debounced user search
  useEffect(() => {
    if (activeTab === 'users' && isAdmin) {
      const timer = setTimeout(() => fetchUsers(), 300);
      return () => clearTimeout(timer);
    }
  }, [userSearch, userRoleFilter, userStatusFilter]);

  // Debounced opportunity search
  useEffect(() => {
    if (activeTab === 'opportunities' && isAdmin) {
      const timer = setTimeout(() => fetchOpportunities(), 300);
      return () => clearTimeout(timer);
    }
  }, [oppSearch, oppStatusFilter]);

  // Debounced skill search
  useEffect(() => {
    if (activeTab === 'skills' && isAdmin) {
      const timer = setTimeout(() => fetchSkills(), 300);
      return () => clearTimeout(timer);
    }
  }, [skillSearch, skillCategoryFilter]);

  // --- ACTIONS WITH MODALS ---

  // 1. Confirm Role Change (from RoleChangeModal)
  const handleConfirmRoleChange = async (userId, newRole) => {
    setIsUpdatingRole(true);
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      showToast(`User role successfully changed to ${newRole.toUpperCase()}`, 'success');
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      if (inspectUser?._id === userId) {
        setInspectUser((prev) => ({ ...prev, role: newRole }));
      }
      setRoleModalUser(null);
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to update user role', 'error');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // 2. Confirm User Ban / Status Change (from UserBanModal)
  const handleConfirmUserStatus = async (userId, targetStatus, banReason) => {
    setIsUpdatingStatus(true);
    try {
      const res = await api.put(`/admin/users/${userId}/status`, {
        status: targetStatus,
        banReason: banReason || '',
      });

      const updatedUser = res.data?.user || {};
      const statusLabel =
        targetStatus === 'banned'
          ? 'Permanently Banned'
          : targetStatus === 'suspended'
          ? 'Suspended'
          : 'Reactivated';

      showToast(`User account status set to ${statusLabel}`, 'success');

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? {
                ...u,
                status: targetStatus,
                banReason: targetStatus === 'active' ? '' : banReason,
                bannedAt: targetStatus === 'active' ? null : new Date().toISOString(),
              }
            : u
        )
      );

      if (inspectUser?._id === userId) {
        setInspectUser((prev) => ({
          ...prev,
          status: targetStatus,
          banReason: targetStatus === 'active' ? '' : banReason,
          bannedAt: targetStatus === 'active' ? null : new Date().toISOString(),
        }));
      }

      setBanModalUser(null);
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to update user status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 3. Confirm Opportunity Status (from OpportunityStatusModal)
  const handleConfirmOppStatus = async (oppId, newStatus) => {
    setIsUpdatingOppStatus(true);
    try {
      await api.put(`/admin/opportunities/${oppId}/status`, { status: newStatus });
      showToast(`Listing status set to ${newStatus}`, 'success');
      setOpportunities((prev) =>
        prev.map((o) => (o._id === oppId ? { ...o, status: newStatus } : o))
      );
      setOppStatusModalOpp(null);
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to update listing status', 'error');
    } finally {
      setIsUpdatingOppStatus(false);
    }
  };

  // 4. Save Skill (Create or Update from EditSkillModal)
  const handleSaveSkill = async (skillData) => {
    setIsSavingSkill(true);
    try {
      if (skillData._id) {
        // Update existing skill
        await api.put(`/admin/skills/${skillData._id}`, {
          name: skillData.name,
          category: skillData.category,
          description: skillData.description,
        });
        showToast(`Skill "${skillData.name}" updated successfully`, 'success');
        setSkills((prev) =>
          prev.map((s) => (s._id === skillData._id ? { ...s, ...skillData } : s))
        );
      } else {
        // Create new skill
        const res = await api.post('/admin/skills', {
          name: skillData.name,
          category: skillData.category,
          description: skillData.description,
        });
        showToast(`Skill "${skillData.name}" added to canonical taxonomy`, 'success');
        fetchSkills();
        fetchStats();
      }
      setSkillModalState({ isOpen: false, skill: null });
    } catch (err) {
      showToast(err.message || 'Failed to save skill', 'error');
    } finally {
      setIsSavingSkill(false);
    }
  };

  // 5. Confirm Deletion (from DeleteConfirmationModal)
  const handleConfirmDelete = async (id) => {
    const { type } = deleteModalState;
    if (!type || !id) return;

    setIsDeletingResource(true);
    try {
      if (type === 'user') {
        await api.delete(`/admin/users/${id}`);
        showToast('User account and associated records deleted permanently', 'success');
        setUsers((prev) => prev.filter((u) => u._id !== id));
        if (inspectUser?._id === id) setInspectUser(null);
      } else if (type === 'opportunity') {
        await api.delete(`/admin/opportunities/${id}`);
        showToast('Opportunity listing removed from platform', 'success');
        setOpportunities((prev) => prev.filter((o) => o._id !== id));
      } else if (type === 'skill') {
        await api.delete(`/admin/skills/${id}`);
        showToast('Skill removed from canonical ontology', 'success');
        setSkills((prev) => prev.filter((s) => s._id !== id));
      }

      setDeleteModalState({ isOpen: false, type: null, item: null });
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Deletion operation failed', 'error');
    } finally {
      setIsDeletingResource(false);
    }
  };

  // Actions: Update Platform Content Announcement
  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    setIsSavingAnnouncement(true);
    try {
      await api.put('/admin/platform-content', {
        heroAnnouncementText: announcementText,
        heroAnnouncementBadge: announcementBadge,
      });
      showToast('Live announcement updated across platform', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update announcement', 'error');
    } finally {
      setIsSavingAnnouncement(false);
    }
  };

  // Access check fallback
  if (!isAdmin) {
    return (
      <div className="admin-access-denied-container">
        <div className="card card-featured animate-fade-in admin-access-card">
          <div className="admin-access-icon-box">
            <ShieldAlert size={32} />
          </div>
          <h2 className="admin-access-title">
            Administrative Privilege Required
          </h2>
          <p className="admin-access-desc">
            This Command Center is strictly restricted to platform administrators. Please sign in with an account having administrator permissions.
          </p>
          <div className="admin-access-actions">
            <button onClick={() => navigate('dashboard')} className="btn-secondary">
              Back to Dashboard
            </button>
            <button onClick={() => navigate('login')} className="btn-primary">
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const m = statsData?.metrics || {};
  const sys = statsData?.system || {};
  const funnel = statsData?.funnel || {};

  return (
    <div className="admin-page-container">
      <BackButton label="Back to Dashboard" fallbackPage="dashboard" className="admin-back-btn-spacing" />

      {/* 1. Header Banner */}
      <div className="card card-featured admin-header-banner">
        <div>
          <div className="admin-header-title-box">
            <span className="admin-system-tag">
              <Activity size={12} className="spin" /> SYSTEM GOVERNANCE & TELEMETRY
            </span>
            <span className="admin-db-status">
              ● DB {sys?.dbState || 'Connected'}
            </span>
          </div>

          <h1 className="admin-header-title">
            Admin <span className="gradient-text">Command Center</span>
          </h1>
          <p className="admin-header-desc">
            Global platform governance, account role switching, ID ban enforcement, listing moderation, and taxonomy control.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            onClick={() => {
              fetchStats();
              if (activeTab === 'users') fetchUsers();
              if (activeTab === 'opportunities') fetchOpportunities();
              if (activeTab === 'skills') fetchSkills();
              if (activeTab === 'applications') fetchApplications();
              showToast('Refreshed admin telemetry data', 'info');
            }}
            className="btn-secondary admin-refresh-btn"
            title="Reload metrics"
          >
            <RefreshCw size={15} className={isLoadingStats ? 'spin' : ''} /> Refresh
          </button>

          <button
            onClick={() => {
              setActiveTab('skills');
              setSkillModalState({ isOpen: true, skill: null });
            }}
            className="btn-primary"
          >
            <PlusCircle size={15} /> Add Canonical Skill
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="admin-tabs-bar">
        {[
          { id: 'overview', label: 'Platform Overview', icon: Activity, count: null },
          { id: 'users', label: 'User Governance', icon: Users, count: m.totalUsers },
          { id: 'opportunities', label: 'Opportunities Moderation', icon: Briefcase, count: m.totalOpportunities },
          { id: 'skills', label: 'Skill Taxonomy', icon: Layers, count: m.totalSkills },
          { id: 'applications', label: 'Application Oversight', icon: TrendingUp, count: m.totalApplications },
          { id: 'system', label: 'System & Diagnostics', icon: Server, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="admin-tab-badge">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENTS */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in admin-announcement-form">
          {/* Top KPI Cards Grid */}
          <div className="admin-metrics-grid">
            {[
              {
                title: 'Total Users',
                value: m.totalUsers ?? '...',
                sub: `${m.totalStudents || 0} Students • ${m.totalEmployers || 0} Employers`,
                icon: Users,
                theme: 'admin-kpi-purple',
                iconBoxClass: 'admin-kpi-icon-purple',
              },
              {
                title: 'Opportunities',
                value: m.totalOpportunities ?? '...',
                sub: `${m.activeOpportunities || 0} Active • ${m.closedOpportunities || 0} Closed`,
                icon: Briefcase,
                theme: 'admin-kpi-pink',
                iconBoxClass: 'admin-kpi-icon-pink',
              },
              {
                title: 'Platform Applications',
                value: m.totalApplications ?? '...',
                sub: `${funnel.Shortlisted || 0} Shortlisted • ${funnel.Selected || 0} Selected`,
                icon: TrendingUp,
                theme: 'admin-kpi-cyan',
                iconBoxClass: 'admin-kpi-icon-blue',
              },
              {
                title: 'Verified Skills',
                value: m.totalSkills ?? '...',
                sub: `${m.totalLearningResources || 0} Curated Roadmaps`,
                icon: Layers,
                theme: 'admin-kpi-emerald',
                iconBoxClass: 'admin-kpi-icon-green',
              },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className={`card admin-kpi-card-themed ${kpi.theme}`}>
                  <div className={`admin-kpi-icon-box ${kpi.iconBoxClass}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <span className="admin-kpi-title">{kpi.title}</span>
                    <h3 className="admin-kpi-value">{kpi.value}</h3>
                    <p className="admin-kpi-sub">{kpi.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Application Pipeline Funnel & System Heartbeat */}
          <div className="admin-dashboard-split">
            {/* Recruitment Pipeline Funnel Breakdown */}
            <div className="card admin-funnel-card">
              <div className="admin-funnel-header">
                <div>
                  <h3 className="admin-funnel-title">
                    Application Funnel Telemetry
                  </h3>
                  <p className="admin-funnel-sub">
                    Conversion stages across all candidate applications platform-wide
                  </p>
                </div>
                <span className="admin-funnel-pill">
                  Total: {m.totalApplications || 0}
                </span>
              </div>

              <div className="admin-funnel-list">
                {[
                  { label: 'Applied (Initial)', key: 'Applied', colorClass: 'stage-applied' },
                  { label: 'Under Review', key: 'Reviewing', colorClass: 'stage-reviewing' },
                  { label: 'Shortlisted by Match', key: 'Shortlisted', colorClass: 'stage-shortlisted' },
                  { label: 'Interview Scheduled', key: 'Interview', colorClass: 'stage-interview' },
                  { label: 'Offer / Selected', key: 'Selected', colorClass: 'stage-selected' },
                  { label: 'Archived / Rejected', key: 'Rejected', colorClass: 'stage-rejected' },
                ].map((stage) => {
                  const count = funnel[stage.key] || 0;
                  const total = m.totalApplications || 1;
                  const percentage = Math.round((count / total) * 100);

                  return (
                    <div key={stage.key}>
                      <div className="admin-funnel-stage-meta">
                        <span className="admin-funnel-stage-label">{stage.label}</span>
                        <span className="admin-funnel-stage-count">
                          {count} <span className="admin-funnel-stage-pct">({percentage}%)</span>
                        </span>
                      </div>
                      <div className="admin-funnel-bar-track">
                        <div
                          className={`admin-funnel-bar-fill ${stage.colorClass}`}
                          style={{
                            width: `${Math.max(percentage, count > 0 ? 3 : 0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Live Announcement Broadcast */}
            <div className="admin-recent-list">
              {/* Broadcast Announcement */}
              <div className="card admin-announcement-card">
                <h3 className="admin-announcement-title">
                  Live Platform Announcement
                </h3>
                <p className="admin-announcement-desc">
                  Update the banner announcement shown on the public landing page in real-time.
                </p>

                <form onSubmit={handleSaveAnnouncement} className="admin-announcement-form">
                  <div>
                    <label className="form-label admin-announcement-label">Badge Text</label>
                    <input
                      type="text"
                      className="form-input admin-announcement-input"
                      placeholder="e.g. SCROLLTIDE 3D ENGINE or PLATFORM UPDATE"
                      value={announcementBadge}
                      onChange={(e) => setAnnouncementBadge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label admin-announcement-label">Announcement Headline</label>
                    <input
                      type="text"
                      className="form-input admin-announcement-input"
                      placeholder="e.g. 5-Factor Vector AI Matching Engine Activated"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingAnnouncement}
                    className="btn-primary admin-announcement-submit-btn"
                  >
                    <Send size={14} /> {isSavingAnnouncement ? 'Broadcasting...' : 'Broadcast Announcement'}
                  </button>
                </form>
              </div>

              {/* Fast Jump Shortcuts */}
              <div className="card admin-shortcuts-card">
                <h4 className="admin-shortcuts-title">
                  Administrative Shortcuts
                </h4>
                <div className="admin-shortcuts-grid">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="btn-ghost admin-shortcut-btn"
                  >
                    <Users size={15} color="#A855F7" /> Audit Users
                  </button>
                  <button
                    onClick={() => setActiveTab('opportunities')}
                    className="btn-ghost admin-shortcut-btn"
                  >
                    <Briefcase size={15} color="#EC4899" /> Moderate Listings
                  </button>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className="btn-ghost admin-shortcut-btn"
                  >
                    <Layers size={15} color="#10B981" /> Taxonomy Control
                  </button>
                  <button
                    onClick={() => setActiveTab('system')}
                    className="btn-ghost admin-shortcut-btn"
                  >
                    <Server size={15} color="#06B6D4" /> Server Telemetry
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Platform Activity Streams */}
          <div className="admin-recent-streams-grid">
            {/* Recent Users */}
            <div className="card admin-recent-stream-card">
              <div className="admin-recent-header">
                <h4 className="admin-recent-title">
                  Recent Registrations
                </h4>
                <button
                  onClick={() => setActiveTab('users')}
                  className="admin-recent-link-btn"
                >
                  View All →
                </button>
              </div>

              <div className="admin-recent-list">
                {(statsData?.recentUsers || []).map((u) => (
                  <div
                    key={u._id}
                    onClick={() => setInspectUser(u)}
                    className="admin-recent-item"
                  >
                    <div className="admin-header-title-box">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60'}
                        alt={u.name}
                        className="admin-recent-avatar-sm"
                      />
                      <div>
                        <p className="admin-recent-user-name">
                          {u.name}
                        </p>
                        <p className="admin-recent-user-email">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <div className="admin-header-title-box">
                      <span className={`admin-role-pill-sm role-${u.role}`}>
                        {u.role}
                      </span>
                      <ChevronRight size={14} color="var(--secondary-text)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Opportunities */}
            <div className="card admin-recent-stream-card">
              <div className="admin-recent-header">
                <h4 className="admin-recent-title">
                  Recent Opportunities
                </h4>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className="admin-recent-link-btn"
                >
                  View All →
                </button>
              </div>

              <div className="admin-recent-list">
                {(statsData?.recentOpportunities || []).map((opp) => (
                  <div
                    key={opp._id}
                    onClick={() => setOppStatusModalOpp(opp)}
                    className="admin-recent-item"
                  >
                    <div>
                      <p className="admin-recent-user-name">
                        {opp.title}
                      </p>
                      <p className="admin-recent-user-email">
                        {opp.organization} • {opp.type}
                      </p>
                    </div>
                    <div className="admin-header-title-box">
                      <span className={`admin-opp-status-pill-sm ${opp.status === 'Active' ? 'active' : 'closed'}`}>
                        {opp.status}
                      </span>
                      <ChevronRight size={14} color="var(--secondary-text)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS GOVERNANCE */}
      {activeTab === 'users' && (
        <div className="animate-fade-in">
          {/* Controls Bar */}
          <div className="card admin-controls-card">
            {/* Search Input */}
            <div className="admin-search-field-wrapper">
              <Search
                size={16}
                className="admin-search-field-icon"
              />
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
                className="form-input admin-search-field-input"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {/* Role Filter Chips */}
            <div className="admin-filter-chips-wrap">
              {['all', 'student', 'employer', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRoleFilter(role)}
                  className={`admin-role-filter-chip ${userRoleFilter === role ? 'active' : ''}`}
                >
                  {role === 'all' ? 'All Roles' : role}
                </button>
              ))}
            </div>

            {/* Status Filter Chips */}
            <div className="admin-footer-btn-group">
              {['all', 'active', 'suspended', 'banned'].map((st) => (
                <button
                  key={st}
                  onClick={() => setUserStatusFilter(st)}
                  className={`admin-status-filter-chip ${userStatusFilter === st ? 'active-user' : ''}`}
                >
                  {st === 'all' ? 'All Status' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="card admin-table-card">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>USER & ID</th>
                  <th>ROLE</th>
                  <th>ACTIVITY</th>
                  <th>STATUS</th>
                  <th>JOINED</th>
                  <th className="text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan="6" className="admin-table-loading-cell">
                      <RefreshCw size={24} className="spin admin-spin-icon" />
                      Loading platform users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-table-empty-cell">
                      No users found matching current filters.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isSelf = user?._id === u._id;
                    const isBannedOrSuspended = u.status === 'suspended' || u.status === 'banned';

                    return (
                      <tr
                        key={u._id}
                        className={`admin-table-row ${isBannedOrSuspended ? 'suspended' : ''}`}
                      >
                        {/* User Identity & Inspect Trigger */}
                        <td>
                          <div
                            onClick={() => setInspectUser(u)}
                            className="admin-table-user-cell"
                            title="Click to inspect profile"
                          >
                            <img
                              src={
                                u.avatar ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80'
                              }
                              alt={u.name}
                              className="admin-table-avatar-md"
                            />
                            <div>
                              <div className="admin-table-user-name">
                                <span>{u.name}</span>
                                {isSelf && <span className="admin-self-tag">(You)</span>}
                              </div>
                              <div className="admin-table-user-email">{u.email}</div>
                              <div className="admin-table-user-id">
                                #{u._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge & Modal Button */}
                        <td>
                          <button
                            disabled={isSelf}
                            onClick={() => setRoleModalUser(u)}
                            title={isSelf ? 'Cannot change own role' : 'Click to change user role'}
                            className={`admin-table-role-btn role-${u.role}`}
                          >
                            <Award size={13} />
                            <span>{u.role}</span>
                            {!isSelf && <Edit size={11} className="admin-opacity-70" />}
                          </button>
                        </td>

                        {/* Activity Metric */}
                        <td className="admin-activity-cell">
                          {u.role === 'employer' ? (
                            <span>{u.postedOpportunitiesCount || 0} listings posted</span>
                          ) : (
                            <span>{u.submittedApplicationsCount || 0} applications</span>
                          )}
                        </td>

                        {/* Status with Ban Reason Pill */}
                        <td>
                          <div className="admin-table-status-stack">
                            <span
                              className={`admin-table-status-badge ${
                                u.status === 'banned'
                                  ? 'banned'
                                  : u.status === 'suspended'
                                  ? 'suspended'
                                  : 'active'
                              }`}
                            >
                              {u.status === 'banned' ? (
                                <Ban size={12} />
                              ) : u.status === 'suspended' ? (
                                <UserX size={12} />
                              ) : (
                                <UserCheck size={12} />
                              )}
                              {u.status?.toUpperCase() || 'ACTIVE'}
                            </span>
                            {u.banReason && (
                              <span
                                className="admin-table-ban-reason-text"
                                title={u.banReason}
                              >
                                {u.banReason}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="admin-joined-date-cell">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions (Inspect, Ban Modal, Delete Modal) */}
                        <td className="text-right">
                          <div className="admin-table-actions-cell">
                            {/* Inspect Profile */}
                            <button
                              onClick={() => setInspectUser(u)}
                              title="Inspect User Details"
                              className="admin-table-action-btn-inspect"
                            >
                              <Eye size={13} /> Inspect
                            </button>

                            {/* Ban / Suspend ID Modal Trigger */}
                            <button
                              disabled={isSelf}
                              onClick={() => setBanModalUser(u)}
                              title={
                                isSelf
                                  ? 'Cannot ban own account'
                                  : isBannedOrSuspended
                                  ? 'Reactivate User ID'
                                  : 'Suspend or Ban User ID'
                              }
                              className={`admin-table-action-btn-ban ${
                                isBannedOrSuspended ? 'suspended' : 'active'
                              }`}
                            >
                              {isBannedOrSuspended ? (
                                <>
                                  <UserCheck size={13} /> Reactivate
                                </>
                              ) : (
                                <>
                                  <UserX size={13} /> Ban ID
                                </>
                              )}
                            </button>

                            {/* Delete User Modal Trigger */}
                            <button
                              disabled={isSelf}
                              onClick={() =>
                                setDeleteModalState({
                                  isOpen: true,
                                  type: 'user',
                                  item: {
                                    id: u._id,
                                    title: `${u.name} (${u.email})`,
                                    subtitle: `Role: ${u.role} • ID: ${u._id}`,
                                  },
                                })
                              }
                              title={isSelf ? 'Cannot delete own account' : 'Delete User Permanently'}
                              className="admin-table-action-btn-del"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OPPORTUNITIES MODERATION */}
      {activeTab === 'opportunities' && (
        <div className="animate-fade-in">
          {/* Filter Bar */}
          <div className="card admin-controls-card">
            <div className="admin-search-field-wrapper">
              <Search
                size={16}
                className="admin-search-field-icon"
              />
              <input
                type="text"
                placeholder="Search opportunities by title or company..."
                className="form-input admin-search-field-input"
                value={oppSearch}
                onChange={(e) => setOppSearch(e.target.value)}
              />
            </div>

            <div className="admin-footer-btn-group">
              {['all', 'Active', 'Closed', 'Draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOppStatusFilter(status)}
                  className={`admin-status-filter-chip ${oppStatusFilter === status ? 'active-opp' : ''}`}
                >
                  {status === 'all' ? 'All Statuses' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunities Table */}
          <div className="card admin-table-card">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>LISTING</th>
                  <th>TYPE</th>
                  <th>POSTED BY</th>
                  <th>APPLICANTS</th>
                  <th>STATUS</th>
                  <th className="text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingOpps ? (
                  <tr>
                    <td colSpan="6" className="admin-table-loading-cell">
                      <RefreshCw size={24} className="spin admin-spin-icon" />
                      Loading opportunities...
                    </td>
                  </tr>
                ) : opportunities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-table-empty-cell">
                      No opportunities found matching search parameters.
                    </td>
                  </tr>
                ) : (
                  opportunities.map((opp) => (
                    <tr key={opp._id} className="admin-table-row">
                      {/* Title & Org */}
                      <td>
                        <div className="admin-opp-title-text">{opp.title}</div>
                        <div className="admin-opp-sub-text">
                          {opp.organization} • {opp.location?.type || 'Remote'}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td>
                        <span className="admin-opp-type-badge">
                          {opp.type}
                        </span>
                      </td>

                      {/* Created By */}
                      <td className="admin-opp-creator-cell">
                        {opp.createdBy?.name || 'Recruiter'}
                        <div className="admin-opp-creator-email">{opp.createdBy?.email}</div>
                      </td>

                      {/* Applicants */}
                      <td className="admin-opp-applicants-val">
                        {opp.applicantCount || 0} candidates
                      </td>

                      {/* Status Modal Trigger */}
                      <td>
                        <button
                          onClick={() => setOppStatusModalOpp(opp)}
                          title="Click to change listing status"
                          className={`admin-opp-status-badge-btn ${
                            opp.status === 'Active'
                              ? 'active'
                              : opp.status === 'Closed'
                              ? 'closed'
                              : 'draft'
                          }`}
                        >
                          {opp.status === 'Active' ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          <span>{opp.status}</span>
                          <Edit size={10} className="admin-opacity-70" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="text-right">
                        <div className="admin-table-actions-cell">
                          <button
                            onClick={() => navigate('details', { id: opp._id })}
                            title="View Public Details"
                            className="admin-table-action-btn-icon"
                          >
                            <ExternalLink size={14} />
                          </button>

                          <button
                            onClick={() => setOppStatusModalOpp(opp)}
                            title="Moderate Status"
                            className={`admin-table-action-btn-icon ${opp.status === 'Active' ? 'admin-text-amber' : 'admin-text-green'}`}
                          >
                            {opp.status === 'Active' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                          </button>

                          <button
                            onClick={() =>
                              setDeleteModalState({
                                isOpen: true,
                                type: 'opportunity',
                                item: {
                                    id: opp._id,
                                    title: `${opp.title} (${opp.organization})`,
                                    subtitle: `Type: ${opp.type} • ID: ${opp._id}`,
                                },
                              })
                            }
                            title="Delete Opportunity"
                            className="admin-table-action-btn-del"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SKILL TAXONOMY */}
      {activeTab === 'skills' && (
        <div className="animate-fade-in">
          {/* Header & Add Button */}
          <div className="card admin-controls-card">
            <div className="admin-search-field-wrapper">
              <Search
                size={16}
                className="admin-search-field-icon"
              />
              <input
                type="text"
                placeholder="Search canonical skills by name..."
                className="form-input admin-search-field-input"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
              />
            </div>

            <div className="admin-header-actions">
              <select
                value={skillCategoryFilter}
                onChange={(e) => setSkillCategoryFilter(e.target.value)}
                className="form-input admin-category-select-control"
              >
                <option value="all">All Categories</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Programming">Programming</option>
                <option value="Database">Database</option>
                <option value="DevOps & Tools">DevOps & Tools</option>
                <option value="Design">Design</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Cloud">Cloud</option>
              </select>

              <button
                onClick={() => setSkillModalState({ isOpen: true, skill: null })}
                className="btn-primary"
              >
                <PlusCircle size={15} /> Add Canonical Skill
              </button>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="admin-skills-grid-container">
            {isLoadingSkills ? (
              <div className="admin-grid-full-loading">
                <RefreshCw size={24} className="spin admin-spin-icon" />
                Loading skills taxonomy...
              </div>
            ) : skills.length === 0 ? (
              <div className="admin-grid-full-loading">
                No skills found matching filter.
              </div>
            ) : (
              skills.map((skill) => (
                <div
                  key={skill._id}
                  className="card admin-skill-taxonomy-card"
                >
                  <div>
                    <div className="admin-skill-card-top">
                      <span className="admin-skill-category-tag">
                        {skill.category}
                      </span>
                      <span className="admin-skill-listings-count">
                        {skill.opportunityCount || 0} listings
                      </span>
                    </div>

                    <h4 className="admin-skill-card-title">
                      {skill.name}
                    </h4>
                    <p className="admin-skill-card-desc">
                      {skill.description || 'Verified canonical competency.'}
                    </p>
                  </div>

                  <div className="admin-skill-card-footer">
                    <button
                      onClick={() => setSkillModalState({ isOpen: true, skill })}
                      title="Edit Skill"
                      className="admin-skill-action-btn-edit"
                    >
                      <Edit size={12} /> Edit
                    </button>

                    <button
                      onClick={() =>
                        setDeleteModalState({
                          isOpen: true,
                          type: 'skill',
                          item: {
                            id: skill._id,
                            title: skill.name,
                            subtitle: `Category: ${skill.category} • ID: ${skill._id}`,
                          },
                        })
                      }
                      title="Delete Skill"
                      className="admin-skill-action-btn-del"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: APPLICATION OVERSIGHT */}
      {activeTab === 'applications' && (
        <div className="animate-fade-in">
          {/* Status Filter */}
          <div className="card admin-controls-card">
            <div>
              <h3 className="admin-funnel-title">
                Platform-Wide Candidate Applications
              </h3>
              <p className="admin-funnel-sub">
                Audit log of all student submissions and live recruitment milestones
              </p>
            </div>

            <div className="admin-filter-chips-wrap">
              {['all', 'Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setAppStatusFilter(status)}
                  className={`admin-status-filter-chip ${appStatusFilter === status ? 'active-app' : ''}`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Table */}
          <div className="card admin-table-card">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>OPPORTUNITY</th>
                  <th>ORGANIZATION</th>
                  <th>STATUS</th>
                  <th>APPLIED DATE</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingApps ? (
                  <tr>
                    <td colSpan="5" className="admin-table-loading-cell">
                      <RefreshCw size={24} className="spin admin-spin-icon" />
                      Loading application audit log...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-table-empty-cell">
                      No applications recorded for current filter.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id} className="admin-table-row">
                      {/* Candidate */}
                      <td>
                        <div
                          onClick={() => {
                            if (app.user) setInspectUser(app.user);
                          }}
                          className="admin-header-title-box pointer"
                          title="Click to inspect candidate"
                        >
                          <img
                            src={
                              app.user?.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60'
                            }
                            alt="User"
                            className="admin-recent-avatar-sm"
                          />
                          <div>
                            <div className="admin-opp-title-text">
                              {app.user?.name || 'Candidate'}
                            </div>
                            <div className="admin-recent-user-email">
                              {app.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Opp Title */}
                      <td className="admin-opp-title-text">
                        {app.opportunity?.title || 'Opportunity'}
                      </td>

                      {/* Organization */}
                      <td className="admin-joined-date-cell">
                        {app.opportunity?.organization || 'Organization'}
                      </td>

                      {/* Status Badge */}
                      <td>
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      {/* Applied Date */}
                      <td className="admin-joined-date-cell">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SYSTEM & DIAGNOSTICS */}
      {activeTab === 'system' && (
        <div className="animate-fade-in admin-diagnostics-grid">
          {/* Server Runtime */}
          <div className="card admin-diagnostics-card">
            <div className="admin-diagnostics-header">
              <div className="admin-diagnostics-icon-cpu">
                <Cpu size={22} />
              </div>
              <div>
                <h3 className="admin-diagnostics-title">
                  Runtime Environment
                </h3>
                <span className="admin-diagnostics-subtitle">Node.js Process Telemetry</span>
              </div>
            </div>

            <div className="admin-diagnostics-rows-list">
              <div className="admin-diagnostics-row">
                <span className="admin-diagnostics-label">Node Version</span>
                <span className="admin-diagnostics-val">{sys.nodeVersion || 'v20+'}</span>
              </div>
              <div className="admin-diagnostics-row">
                <span className="admin-diagnostics-label">OS Platform</span>
                <span className="admin-diagnostics-val">{sys.platform} ({sys.arch})</span>
              </div>
              <div className="admin-diagnostics-row">
                <span className="admin-diagnostics-label">Server Uptime</span>
                <span className="admin-diagnostics-val-green">
                  {Math.floor((sys.uptime || 0) / 60)} mins {(sys.uptime || 0) % 60} secs
                </span>
              </div>
              <div className="admin-diagnostics-row">
                <span className="admin-diagnostics-label">Heap Memory Used</span>
                <span className="admin-diagnostics-val">{sys.memoryHeapMB || 0} MB</span>
              </div>
              <div className="admin-diagnostics-row-noborder">
                <span className="admin-diagnostics-label">RSS Memory</span>
                <span className="admin-diagnostics-val">{sys.memoryRssMB || 0} MB</span>
              </div>
            </div>
          </div>

          {/* Database Health */}
          <div className="card admin-diagnostics-card">
            <div className="admin-diagnostics-header">
              <div className="admin-diagnostics-icon-db">
                <Database size={22} />
              </div>
              <div>
                <h3 className="admin-diagnostics-title">
                  Database Connectivity
                </h3>
                <span className="admin-diagnostics-subtitle">MongoDB Cluster Telemetry</span>
              </div>
            </div>

            <div className="admin-diagnostics-rows-list">
              <div className="admin-diagnostics-row">
                <span className="admin-diagnostics-label">Connection State</span>
                <span className="admin-diagnostics-val-emerald">● {sys.dbState || 'Connected'}</span>
              </div>
              <div className="admin-diagnostics-row">
                <span className="admin-diagnostics-label">User Records</span>
                <span className="admin-diagnostics-val">{m.totalUsers || 0}</span>
              </div>
              <div className="admin-diagnostics-row">
                <span className="admin-diagnostics-label">Opportunity Records</span>
                <span className="admin-diagnostics-val">{m.totalOpportunities || 0}</span>
              </div>
              <div className="admin-diagnostics-row">
                <span className="admin-diagnostics-label">Application Records</span>
                <span className="admin-diagnostics-val">{m.totalApplications || 0}</span>
              </div>
              <div className="admin-diagnostics-row-noborder">
                <span className="admin-diagnostics-label">Indexed Skill Taxonomy</span>
                <span className="admin-diagnostics-val">{m.totalSkills || 0} nodes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ALL SKILLLOOP-STYLE CENTERED MODALS --- */}

      {/* 1. Role Change Modal */}
      <RoleChangeModal
        isOpen={!!roleModalUser}
        onClose={() => setRoleModalUser(null)}
        user={roleModalUser}
        onConfirm={handleConfirmRoleChange}
        isLoading={isUpdatingRole}
      />

      {/* 2. User Ban / Suspend ID Modal */}
      <UserBanModal
        isOpen={!!banModalUser}
        onClose={() => setBanModalUser(null)}
        user={banModalUser}
        onConfirm={handleConfirmUserStatus}
        isLoading={isUpdatingStatus}
      />

      {/* 3. User Details Inspection Modal */}
      <UserDetailsModal
        isOpen={!!inspectUser}
        onClose={() => setInspectUser(null)}
        user={inspectUser}
        onRequestRoleChange={(u) => setRoleModalUser(u)}
        onRequestBanToggle={(u) => setBanModalUser(u)}
        onRequestDelete={(u) =>
          setDeleteModalState({
            isOpen: true,
            type: 'user',
            item: {
              id: u._id,
              title: `${u.name} (${u.email})`,
              subtitle: `Role: ${u.role} • ID: ${u._id}`,
            },
          })
        }
      />

      {/* 4. Opportunity Status Moderate Modal */}
      <OpportunityStatusModal
        isOpen={!!oppStatusModalOpp}
        onClose={() => setOppStatusModalOpp(null)}
        opportunity={oppStatusModalOpp}
        onConfirm={handleConfirmOppStatus}
        isLoading={isUpdatingOppStatus}
      />

      {/* 5. Edit / Add Skill Modal */}
      <EditSkillModal
        isOpen={skillModalState.isOpen}
        onClose={() => setSkillModalState({ isOpen: false, skill: null })}
        skill={skillModalState.skill}
        onSave={handleSaveSkill}
        isLoading={isSavingSkill}
      />

      {/* 6. Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, type: null, item: null })}
        type={deleteModalState.type}
        item={deleteModalState.item}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingResource}
      />
    </div>
  );
}
