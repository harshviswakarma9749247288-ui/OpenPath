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
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div
          className="card card-featured animate-fade-in"
          style={{
            padding: '40px 24px',
            borderRadius: '24px',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#F87171',
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px', color: 'var(--primary-text)' }}>
            Administrative Privilege Required
          </h2>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>
            This Command Center is strictly restricted to platform administrators. Please sign in with an account having administrator permissions.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
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
    <div style={{ maxWidth: '1340px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      <BackButton label="Back to Dashboard" fallbackPage="dashboard" style={{ marginBottom: '18px' }} />

      {/* 1. Header Banner */}
      <div
        className="card card-featured admin-header-banner"
        style={{
          padding: '28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.88) 0%, rgba(15, 23, 42, 0.92) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '22px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#EC4899',
                backgroundColor: 'rgba(236, 72, 153, 0.16)',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                padding: '4px 12px',
                borderRadius: '9999px',
                letterSpacing: '0.06em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Activity size={12} className="spin" /> SYSTEM GOVERNANCE & TELEMETRY
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#34D399',
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                padding: '3px 10px',
                borderRadius: '9999px',
              }}
            >
              ● DB {sys?.dbState || 'Connected'}
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              marginTop: '10px',
              color: 'var(--primary-text)',
              letterSpacing: '-0.5px',
            }}
          >
            Admin <span className="gradient-text">Command Center</span>
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
            Global platform governance, account role switching, ID ban enforcement, listing moderation, and taxonomy control.
          </p>
        </div>

        <div className="admin-header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => {
              fetchStats();
              if (activeTab === 'users') fetchUsers();
              if (activeTab === 'opportunities') fetchOpportunities();
              if (activeTab === 'skills') fetchSkills();
              if (activeTab === 'applications') fetchApplications();
              showToast('Refreshed admin telemetry data', 'info');
            }}
            className="btn-secondary"
            title="Reload metrics"
            style={{ padding: '9px 15px', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} className={isLoadingStats ? 'spin' : ''} /> Refresh
          </button>

          <button
            onClick={() => {
              setActiveTab('skills');
              setSkillModalState({ isOpen: true, skill: null });
            }}
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.85rem' }}
          >
            <PlusCircle size={15} /> Add Canonical Skill
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'rgba(124, 58, 237, 0.22)' : 'var(--chip-bg)',
                border: isActive ? '1px solid #A855F7' : '1px solid var(--border-color)',
                color: isActive ? 'var(--primary-text)' : 'var(--secondary-text)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={16} color={isActive ? '#F472B6' : 'currentColor'} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '1px 7px',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#F472B6' : 'inherit',
                    fontWeight: 700,
                  }}
                >
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
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top KPI Cards Grid */}
          <div
            className="admin-metrics-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                title: 'Total Users',
                value: m.totalUsers ?? '...',
                sub: `${m.totalStudents || 0} Students • ${m.totalEmployers || 0} Employers`,
                icon: Users,
                color: '#A855F7',
                bg: 'rgba(124, 58, 237, 0.14)',
                border: 'rgba(124, 58, 237, 0.3)',
              },
              {
                title: 'Opportunities',
                value: m.totalOpportunities ?? '...',
                sub: `${m.activeOpportunities || 0} Active • ${m.closedOpportunities || 0} Closed`,
                icon: Briefcase,
                color: '#EC4899',
                bg: 'rgba(236, 72, 153, 0.14)',
                border: 'rgba(236, 72, 153, 0.3)',
              },
              {
                title: 'Platform Applications',
                value: m.totalApplications ?? '...',
                sub: `${funnel.Shortlisted || 0} Shortlisted • ${funnel.Selected || 0} Selected`,
                icon: TrendingUp,
                color: '#06B6D4',
                bg: 'rgba(6, 182, 212, 0.14)',
                border: 'rgba(6, 182, 212, 0.3)',
              },
              {
                title: 'Verified Skills',
                value: m.totalSkills ?? '...',
                sub: `${m.totalLearningResources || 0} Curated Roadmaps`,
                icon: Layers,
                color: '#10B981',
                bg: 'rgba(16, 185, 129, 0.14)',
                border: 'rgba(16, 185, 129, 0.3)',
              },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1px solid ${kpi.border}`,
                    background: `linear-gradient(135deg, ${kpi.bg} 0%, rgba(15, 23, 42, 0.5) 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      backgroundColor: kpi.bg,
                      border: `1px solid ${kpi.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: kpi.color,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', fontWeight: 600 }}>
                      {kpi.title}
                    </span>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-text)', margin: '2px 0' }}>
                      {kpi.value}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>{kpi.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Application Pipeline Funnel & System Heartbeat */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '20px',
            }}
            className="admin-dashboard-split"
          >
            {/* Recruitment Pipeline Funnel Breakdown */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                    Application Funnel Telemetry
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                    Conversion stages across all candidate applications platform-wide
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#A855F7',
                    fontWeight: 700,
                    backgroundColor: 'rgba(168, 85, 247, 0.12)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  Total: {m.totalApplications || 0}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Applied (Initial)', key: 'Applied', color: '#818CF8' },
                  { label: 'Under Review', key: 'Reviewing', color: '#FBBF24' },
                  { label: 'Shortlisted by Match', key: 'Shortlisted', color: '#C084FC' },
                  { label: 'Interview Scheduled', key: 'Interview', color: '#38BDF8' },
                  { label: 'Offer / Selected', key: 'Selected', color: '#34D399' },
                  { label: 'Archived / Rejected', key: 'Rejected', color: '#F87171' },
                ].map((stage) => {
                  const count = funnel[stage.key] || 0;
                  const total = m.totalApplications || 1;
                  const percentage = Math.round((count / total) * 100);

                  return (
                    <div key={stage.key}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.825rem',
                          marginBottom: '4px',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--primary-text)' }}>{stage.label}</span>
                        <span style={{ color: 'var(--secondary-text)', fontWeight: 700 }}>
                          {count} <span style={{ opacity: 0.6 }}>({percentage}%)</span>
                        </span>
                      </div>
                      <div
                        style={{
                          height: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.max(percentage, count > 0 ? 3 : 0)}%`,
                            backgroundColor: stage.color,
                            borderRadius: '9999px',
                            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Live Announcement Broadcast */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Broadcast Announcement */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-text)', marginBottom: '4px' }}>
                  Live Platform Announcement
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', marginBottom: '16px' }}>
                  Update the banner announcement shown on the public landing page in real-time.
                </p>

                <form onSubmit={handleSaveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Badge Text</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      placeholder="e.g. SCROLLTIDE 3D ENGINE or PLATFORM UPDATE"
                      value={announcementBadge}
                      onChange={(e) => setAnnouncementBadge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Announcement Headline</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      placeholder="e.g. 5-Factor Vector AI Matching Engine Activated"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingAnnouncement}
                    className="btn-primary"
                    style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    <Send size={14} /> {isSavingAnnouncement ? 'Broadcasting...' : 'Broadcast Announcement'}
                  </button>
                </form>
              </div>

              {/* Fast Jump Shortcuts */}
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-text)', marginBottom: '12px' }}>
                  Administrative Shortcuts
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', fontSize: '0.82rem', padding: '8px 10px' }}
                  >
                    <Users size={15} color="#A855F7" /> Audit Users
                  </button>
                  <button
                    onClick={() => setActiveTab('opportunities')}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', fontSize: '0.82rem', padding: '8px 10px' }}
                  >
                    <Briefcase size={15} color="#EC4899" /> Moderate Listings
                  </button>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', fontSize: '0.82rem', padding: '8px 10px' }}
                  >
                    <Layers size={15} color="#10B981" /> Taxonomy Control
                  </button>
                  <button
                    onClick={() => setActiveTab('system')}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', fontSize: '0.82rem', padding: '8px 10px' }}
                  >
                    <Server size={15} color="#06B6D4" /> Server Telemetry
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Platform Activity Streams */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '20px',
            }}
          >
            {/* Recent Users */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                  Recent Registrations
                </h4>
                <button
                  onClick={() => setActiveTab('users')}
                  style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(statsData?.recentUsers || []).map((u) => (
                  <div
                    key={u._id}
                    onClick={() => setInspectUser(u)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--chip-bg)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60'}
                        alt={u.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-text)', margin: 0 }}>
                          {u.name}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', margin: 0 }}>
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontWeight: 700,
                          backgroundColor:
                            u.role === 'admin'
                              ? 'rgba(239, 68, 68, 0.18)'
                              : u.role === 'employer'
                              ? 'rgba(236, 72, 153, 0.18)'
                              : 'rgba(124, 58, 237, 0.18)',
                          color:
                            u.role === 'admin' ? '#F87171' : u.role === 'employer' ? '#F472B6' : '#C084FC',
                        }}
                      >
                        {u.role}
                      </span>
                      <ChevronRight size={14} color="var(--secondary-text)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Opportunities */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                  Recent Opportunities
                </h4>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  View All →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(statsData?.recentOpportunities || []).map((opp) => (
                  <div
                    key={opp._id}
                    onClick={() => setOppStatusModalOpp(opp)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--chip-bg)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-text)', margin: 0 }}>
                        {opp.title}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', margin: 0 }}>
                        {opp.organization} • {opp.type}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontWeight: 700,
                          backgroundColor:
                            opp.status === 'Active' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(100, 116, 139, 0.2)',
                          color: opp.status === 'Active' ? '#34D399' : '#94A3B8',
                        }}
                      >
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
          <div
            className="card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <Search
                size={16}
                color="#64748B"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            {/* Role Filter Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['all', 'student', 'employer', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRoleFilter(role)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    border: userRoleFilter === role ? '1px solid #A855F7' : '1px solid var(--border-color)',
                    backgroundColor: userRoleFilter === role ? 'rgba(124, 58, 237, 0.2)' : 'var(--chip-bg)',
                    color: userRoleFilter === role ? 'var(--primary-text)' : 'var(--secondary-text)',
                    cursor: 'pointer',
                  }}
                >
                  {role === 'all' ? 'All Roles' : role}
                </button>
              ))}
            </div>

            {/* Status Filter Chips */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'active', 'suspended', 'banned'].map((st) => (
                <button
                  key={st}
                  onClick={() => setUserStatusFilter(st)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    border: userStatusFilter === st ? '1px solid #EC4899' : '1px solid var(--border-color)',
                    backgroundColor: userStatusFilter === st ? 'rgba(236, 72, 153, 0.2)' : 'var(--chip-bg)',
                    color: userStatusFilter === st ? 'var(--primary-text)' : 'var(--secondary-text)',
                    cursor: 'pointer',
                  }}
                >
                  {st === 'all' ? 'All Status' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="card admin-table-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '18px' }}>
            <table className="admin-data-table" style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--box-subtle)' }}>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>USER & ID</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>ROLE</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>ACTIVITY</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>JOINED</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700, textAlign: 'right' }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingUsers ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                      <RefreshCw size={24} className="spin" style={{ margin: '0 auto 10px auto' }} />
                      Loading platform users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
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
                        style={{
                          borderBottom: '1px solid var(--border-color)',
                          transition: 'background-color 0.15s ease',
                          opacity: isBannedOrSuspended ? 0.75 : 1,
                        }}
                      >
                        {/* User Identity & Inspect Trigger */}
                        <td style={{ padding: '14px 18px' }}>
                          <div
                            onClick={() => setInspectUser(u)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                            title="Click to inspect profile"
                          >
                            <img
                              src={
                                u.avatar ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80'
                              }
                              alt={u.name}
                              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--primary-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>{u.name}</span>
                                {isSelf && <span style={{ color: '#F472B6', fontSize: '0.72rem' }}>(You)</span>}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>{u.email}</div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)', fontFamily: 'monospace', opacity: 0.7 }}>
                                #{u._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge & Modal Button */}
                        <td style={{ padding: '14px 18px' }}>
                          <button
                            disabled={isSelf}
                            onClick={() => setRoleModalUser(u)}
                            title={isSelf ? 'Cannot change own role' : 'Click to change user role'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              backgroundColor:
                                u.role === 'admin'
                                  ? 'rgba(239, 68, 68, 0.18)'
                                  : u.role === 'employer'
                                  ? 'rgba(236, 72, 153, 0.18)'
                                  : 'rgba(124, 58, 237, 0.18)',
                              color:
                                u.role === 'admin' ? '#F87171' : u.role === 'employer' ? '#F472B6' : '#C084FC',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                              textTransform: 'capitalize',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Award size={13} />
                            <span>{u.role}</span>
                            {!isSelf && <Edit size={11} style={{ opacity: 0.7, marginLeft: '2px' }} />}
                          </button>
                        </td>

                        {/* Activity Metric */}
                        <td style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontSize: '0.8rem' }}>
                          {u.role === 'employer' ? (
                            <span>{u.postedOpportunitiesCount || 0} listings posted</span>
                          ) : (
                            <span>{u.submittedApplicationsCount || 0} applications</span>
                          )}
                        </td>

                        {/* Status with Ban Reason Pill */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '9999px',
                                backgroundColor:
                                  u.status === 'banned'
                                    ? 'rgba(239, 68, 68, 0.22)'
                                    : u.status === 'suspended'
                                    ? 'rgba(245, 158, 11, 0.2)'
                                    : 'rgba(16, 185, 129, 0.15)',
                                color:
                                  u.status === 'banned'
                                    ? '#F87171'
                                    : u.status === 'suspended'
                                    ? '#FBBF24'
                                    : '#34D399',
                                border: '1px solid var(--border-color)',
                              }}
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
                                style={{
                                  fontSize: '0.68rem',
                                  color: 'var(--secondary-text)',
                                  maxWidth: '180px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                                title={u.banReason}
                              >
                                {u.banReason}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontSize: '0.78rem' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions (Inspect, Ban Modal, Delete Modal) */}
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {/* Inspect Profile */}
                            <button
                              onClick={() => setInspectUser(u)}
                              title="Inspect User Details"
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                background: 'none',
                                border: '1px solid var(--border-color)',
                                color: 'var(--secondary-text)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                              }}
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
                              style={{
                                padding: '6px 9px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: isBannedOrSuspended
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : 'rgba(239, 68, 68, 0.12)',
                                color: isBannedOrSuspended ? '#10B981' : '#F87171',
                                cursor: isSelf ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
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
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                background: 'none',
                                border: '1px solid var(--border-color)',
                                color: '#F43F5E',
                                cursor: isSelf ? 'not-allowed' : 'pointer',
                              }}
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
          <div
            className="card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <Search
                size={16}
                color="#64748B"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search opportunities by title or company..."
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                value={oppSearch}
                onChange={(e) => setOppSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'Active', 'Closed', 'Draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOppStatusFilter(status)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: oppStatusFilter === status ? '1px solid #EC4899' : '1px solid var(--border-color)',
                    backgroundColor: oppStatusFilter === status ? 'rgba(236, 72, 153, 0.2)' : 'var(--chip-bg)',
                    color: oppStatusFilter === status ? 'var(--primary-text)' : 'var(--secondary-text)',
                    cursor: 'pointer',
                  }}
                >
                  {status === 'all' ? 'All Statuses' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunities Table */}
          <div className="card admin-table-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '18px' }}>
            <table className="admin-data-table" style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--box-subtle)' }}>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>LISTING</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>TYPE</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>POSTED BY</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>APPLICANTS</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700, textAlign: 'right' }}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingOpps ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                      <RefreshCw size={24} className="spin" style={{ margin: '0 auto 10px auto' }} />
                      Loading opportunities...
                    </td>
                  </tr>
                ) : opportunities.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                      No opportunities found matching search parameters.
                    </td>
                  </tr>
                ) : (
                  opportunities.map((opp) => (
                    <tr key={opp._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      {/* Title & Org */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{opp.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>
                          {opp.organization} • {opp.location?.type || 'Remote'}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(124, 58, 237, 0.12)',
                            color: '#C084FC',
                            fontWeight: 600,
                          }}
                        >
                          {opp.type}
                        </span>
                      </td>

                      {/* Created By */}
                      <td style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontSize: '0.78rem' }}>
                        {opp.createdBy?.name || 'Recruiter'}
                        <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>{opp.createdBy?.email}</div>
                      </td>

                      {/* Applicants */}
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#38BDF8' }}>
                        {opp.applicantCount || 0} candidates
                      </td>

                      {/* Status Modal Trigger */}
                      <td style={{ padding: '14px 18px' }}>
                        <button
                          onClick={() => setOppStatusModalOpp(opp)}
                          title="Click to change listing status"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.75rem',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            backgroundColor:
                              opp.status === 'Active'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : opp.status === 'Closed'
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(100, 116, 139, 0.18)',
                            color:
                              opp.status === 'Active'
                                ? '#34D399'
                                : opp.status === 'Closed'
                                ? '#FBBF24'
                                : '#94A3B8',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                          }}
                        >
                          {opp.status === 'Active' ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          <span>{opp.status}</span>
                          <Edit size={10} style={{ opacity: 0.6 }} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => navigate('details', { id: opp._id })}
                            title="View Public Details"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'none',
                              border: '1px solid var(--border-color)',
                              color: 'var(--secondary-text)',
                              cursor: 'pointer',
                            }}
                          >
                            <ExternalLink size={14} />
                          </button>

                          <button
                            onClick={() => setOppStatusModalOpp(opp)}
                            title="Moderate Status"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'none',
                              border: '1px solid var(--border-color)',
                              color: opp.status === 'Active' ? '#F59E0B' : '#10B981',
                              cursor: 'pointer',
                            }}
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
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              background: 'none',
                              border: '1px solid var(--border-color)',
                              color: '#F43F5E',
                              cursor: 'pointer',
                            }}
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
          <div
            className="card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <Search
                size={16}
                color="#64748B"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search canonical skills by name..."
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={skillCategoryFilter}
                onChange={(e) => setSkillCategoryFilter(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.82rem', padding: '7px 12px', width: 'auto' }}
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
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                <PlusCircle size={15} /> Add Canonical Skill
              </button>
            </div>
          </div>

          {/* Skills Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {isLoadingSkills ? (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                <RefreshCw size={24} className="spin" style={{ margin: '0 auto 10px auto' }} />
                Loading skills taxonomy...
              </div>
            ) : skills.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                No skills found matching filter.
              </div>
            ) : (
              skills.map((skill) => (
                <div
                  key={skill._id}
                  className="card"
                  style={{
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderRadius: '16px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(16, 185, 129, 0.14)',
                          color: '#34D399',
                          fontWeight: 700,
                        }}
                      >
                        {skill.category}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#A855F7',
                          fontWeight: 700,
                        }}
                      >
                        {skill.opportunityCount || 0} listings
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                      {skill.name}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', marginTop: '4px', lineHeight: '1.4' }}>
                      {skill.description || 'Verified canonical competency.'}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '8px',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '10px',
                    }}
                  >
                    <button
                      onClick={() => setSkillModalState({ isOpen: true, skill })}
                      title="Edit Skill"
                      style={{
                        padding: '4px 10px',
                        background: 'none',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: 'var(--primary-text)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
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
                      style={{
                        padding: '4px 8px',
                        background: 'none',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: '#F43F5E',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
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
          <div
            className="card"
            style={{
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                Platform-Wide Candidate Applications
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                Audit log of all student submissions and live recruitment milestones
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['all', 'Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setAppStatusFilter(status)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: appStatusFilter === status ? '1px solid #38BDF8' : '1px solid var(--border-color)',
                    backgroundColor: appStatusFilter === status ? 'rgba(56, 189, 248, 0.2)' : 'var(--chip-bg)',
                    color: appStatusFilter === status ? 'var(--primary-text)' : 'var(--secondary-text)',
                    cursor: 'pointer',
                  }}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Table */}
          <div className="card admin-table-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '18px' }}>
            <table className="admin-data-table" style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--box-subtle)' }}>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>CANDIDATE</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>OPPORTUNITY</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>ORGANIZATION</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontWeight: 700 }}>APPLIED DATE</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingApps ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                      <RefreshCw size={24} className="spin" style={{ margin: '0 auto 10px auto' }} />
                      Loading application audit log...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                      No applications recorded for current filter.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      {/* Candidate */}
                      <td style={{ padding: '14px 18px' }}>
                        <div
                          onClick={() => {
                            if (app.user) setInspectUser(app.user);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                          title="Click to inspect candidate"
                        >
                          <img
                            src={
                              app.user?.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60'
                            }
                            alt="User"
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--primary-text)' }}>
                              {app.user?.name || 'Candidate'}
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--secondary-text)' }}>
                              {app.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Opp Title */}
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--primary-text)' }}>
                        {app.opportunity?.title || 'Opportunity'}
                      </td>

                      {/* Organization */}
                      <td style={{ padding: '14px 18px', color: 'var(--secondary-text)' }}>
                        {app.opportunity?.organization || 'Organization'}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '14px 18px' }}>
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      {/* Applied Date */}
                      <td style={{ padding: '14px 18px', color: 'var(--secondary-text)', fontSize: '0.78rem' }}>
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
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Server Runtime */}
          <div className="card" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                  color: '#06B6D4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cpu size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-text)', margin: 0 }}>
                  Runtime Environment
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>Node.js Process Telemetry</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>Node Version</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{sys.nodeVersion || 'v20+'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>OS Platform</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{sys.platform} ({sys.arch})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>Server Uptime</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>
                  {Math.floor((sys.uptime || 0) / 60)} mins {(sys.uptime || 0) % 60} secs
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>Heap Memory Used</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{sys.memoryHeapMB || 0} MB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>RSS Memory</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{sys.memoryRssMB || 0} MB</span>
              </div>
            </div>
          </div>

          {/* Database Health */}
          <div className="card" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Database size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-text)', margin: 0 }}>
                  Database Connectivity
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>MongoDB Cluster Telemetry</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>Connection State</span>
                <span style={{ fontWeight: 700, color: '#34D399' }}>● {sys.dbState || 'Connected'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>User Records</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{m.totalUsers || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>Opportunity Records</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{m.totalOpportunities || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>Application Records</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{m.totalApplications || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--secondary-text)' }}>Indexed Skill Taxonomy</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-text)' }}>{m.totalSkills || 0} nodes</span>
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
