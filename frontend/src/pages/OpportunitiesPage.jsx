import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  IndianRupee,
  RotateCcw,
  X,
  Sparkles,
  ArrowRight,
  Building2,
  Bookmark,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { useApplicationStore } from '../store/useApplicationStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import BackButton from '../components/BackButton';

// Safe sanitizers to eliminate React Child Object errors (#31)
const formatLocation = (loc) => {
  if (!loc) return 'Remote';
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object') {
    const parts = [loc.city, loc.state].filter(Boolean);
    if (parts.length > 0) return parts.join(', ');
    return loc.type || loc.country || 'Remote';
  }
  return 'Remote';
};

const formatOrganization = (org, company) => {
  const target = org || company;
  if (!target) return 'Direct Employer';
  if (typeof target === 'string') return target;
  if (typeof target === 'object') return target.name || 'Direct Employer';
  return 'Direct Employer';
};

const formatSkill = (skill) => {
  if (!skill) return '';
  if (typeof skill === 'string') return skill;
  if (typeof skill === 'object') return skill.name || skill.title || '';
  return String(skill);
};

export default function OpportunitiesPage() {
  const {
    opportunities,
    allOpportunities,
    fetchOpportunities,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedLocation,
    setSelectedLocation,
    selectedSort,
    setSelectedSort,
    isLoading,
    toggleSaveOpportunity,
    savedIds,
  } = useOpportunityStore();

  const { applications, fetchMyApplications, apply } = useApplicationStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const { navigate, showToast, openMentorForOpportunity } = useUIStore();

  const [viewMode, setViewMode] = useState('grid');
  const [minMatch, setMinMatch] = useState(0);
  const [showLiveDropdown, setShowLiveDropdown] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    fetchMyApplications();
    if (!allOpportunities || allOpportunities.length === 0) {
      fetchOpportunities({ search: '', type: 'all', locationType: 'all', sortBy: 'latest' });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowLiveDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delay = searchQuery ? 120 : 0;
    const timer = setTimeout(() => {
      fetchOpportunities();
    }, delay);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedType, selectedLocation, selectedSort]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedLocation('all');
    setSelectedSort('latest');
    setMinMatch(0);
    setShowLiveDropdown(false);
    fetchOpportunities({ search: '', type: 'all', locationType: 'all', sortBy: 'latest' });
  };

  const handleApply = async (opportunity) => {
    const res = await apply(opportunity._id);
    if (res.success) {
      showToast(`Applied successfully to ${opportunity.title}!`, 'success');
    } else {
      showToast(res.error || 'Could not submit application', 'error');
    }
  };

  const appliedOppIds = applications.map((a) => a.opportunity?._id || a.opportunity);

  const sourceOpportunities = useMemo(() => {
    const map = new Map();
    (allOpportunities || []).forEach((o) => {
      if (o && o._id) map.set(o._id, o);
    });
    (opportunities || []).forEach((o) => {
      if (o && o._id) map.set(o._id, o);
    });
    const merged = Array.from(map.values());
    if (selectedSort === 'match') {
      merged.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (selectedSort === 'deadline') {
      merged.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
    } else {
      merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return merged;
  }, [opportunities, allOpportunities, selectedSort]);

  const normalizedQuery = (searchQuery || '').trim().toLowerCase();

  const filteredOpportunities = sourceOpportunities.filter((opp) => {
    if (minMatch > 0 && opp.matchScore !== null && opp.matchScore < minMatch) {
      return false;
    }
    if (selectedType && selectedType !== 'all' && opp.type !== selectedType) {
      return false;
    }
    if (selectedLocation && selectedLocation !== 'all' && opp.location?.type !== selectedLocation) {
      return false;
    }
    if (normalizedQuery) {
      const skillNames = (opp.requiredSkills || [])
        .map((s) => (typeof s === 'object' ? s.name : String(s)))
        .join(' ');
      const interestsText = (opp.interests || []).join(' ');
      const haystack = [
        opp.title,
        opp.organization,
        opp.description,
        opp.type,
        opp.location?.city,
        opp.location?.state,
        opp.location?.type,
        skillNames,
        interestsText,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      <BackButton label="Back to Dashboard" fallbackPage="dashboard" style={{ marginBottom: '20px' }} />

      {/* Live Search & Filter Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div ref={searchBoxRef} style={{ position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={18}
              color="#A855F7"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}
            />
            <input
              type="text"
              placeholder="Live search by role title, skills (React, Node.js, Python), city, or company..."
              className="form-input"
              style={{
                paddingLeft: '44px',
                paddingRight: searchQuery ? '140px' : '115px',
                height: '50px',
                fontSize: '0.95rem',
              }}
              value={searchQuery}
              onFocus={() => setShowLiveDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowLiveDropdown(true);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary-text)',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {['all', 'Internship', 'Apprenticeship', 'Entry-level Job'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              style={{
                fontSize: '0.8rem',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: selectedType === t ? 'var(--primary-gradient)' : 'var(--chip-bg)',
                color: selectedType === t ? '#FFFFFF' : 'var(--secondary-text)',
                border: selectedType === t ? '1px solid transparent' : '1px solid var(--chip-border)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t === 'all' ? 'All Roles' : t}
            </button>
          ))}
          {['all', 'Remote', 'Hybrid', 'On-site'].map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              style={{
                fontSize: '0.8rem',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: selectedLocation === loc ? 'linear-gradient(135deg, #06B6D4, #3B82F6)' : 'var(--chip-bg)',
                color: selectedLocation === loc ? '#FFFFFF' : 'var(--secondary-text)',
                border: selectedLocation === loc ? '1px solid transparent' : '1px solid var(--chip-border)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {loc === 'all' ? 'Any Mode' : loc}
            </button>
          ))}
        </div>
      </div>

      {/* Main Browse Layout */}
      <div className="opportunities-browse-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        {/* Left Filter Panel */}
        <div className="card filter-panel-sidebar" style={{ padding: '20px', height: 'fit-content', position: 'sticky', top: '88px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={16} /> Filters
            </strong>
            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.75rem', color: '#A78BFA', display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Sort Listings By</label>
            <select
              className="form-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '8px' }}
            >
              <option value="latest">Latest First</option>
              <option value="match">Highest Match Score</option>
              <option value="deadline">Approaching Deadline</option>
            </select>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <label className="form-label" style={{ margin: 0 }}>Min Match Score</label>
              <strong style={{ color: '#A78BFA' }}>{minMatch}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--aurora-violet)' }}
            />
          </div>
        </div>

        {/* Right Listings Content */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
              Showing <strong style={{ color: 'var(--primary-text)' }}>{filteredOpportunities.length}</strong> available opportunities
            </span>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
              gap: '18px',
            }}
          >
            {filteredOpportunities.map((opp) => {
              const displayCompany = formatOrganization(opp.organization, opp.company);
              const displayLocation = formatLocation(opp.location);
              const safeSkills = Array.isArray(opp.requiredSkills || opp.skills) ? (opp.requiredSkills || opp.skills) : [];
              const matchScore = opp.matchScore ?? opp.matchDetails?.overallScore;
              const isSaved = Array.isArray(savedIds) && savedIds.includes(opp._id);
              const isApplied = appliedOppIds.includes(opp._id);

              return (
                <div
                  key={opp._id}
                  className="card card-hover"
                  onClick={() => navigate('details', { id: opp._id })}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(168, 85, 247, 0.15)',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#C084FC',
                            fontWeight: 700,
                            fontSize: '1rem',
                          }}
                        >
                          {displayCompany.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-text)', margin: '0 0 2px 0' }}>
                            {opp.title}
                          </h3>
                          <span style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Building2 size={13} /> {displayCompany}
                          </span>
                        </div>
                      </div>

                      {!isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (toggleSaveOpportunity) toggleSaveOpportunity(opp._id);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: isSaved ? '#EC4899' : 'var(--secondary-text)',
                            padding: '4px',
                          }}
                        >
                          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(16, 185, 129, 0.14)',
                          color: '#34D399',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        {opp.type || 'Internship'}
                      </span>

                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(6, 182, 212, 0.12)',
                          color: '#38BDF8',
                          border: '1px solid rgba(6, 182, 212, 0.25)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <MapPin size={11} /> {displayLocation}
                      </span>

                      {opp.salary?.amount && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '3px 9px',
                            borderRadius: '9999px',
                            backgroundColor: 'var(--box-subtle)',
                            color: 'var(--primary-text)',
                            border: '1px solid var(--border-color)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <IndianRupee size={11} /> {opp.salary.amount} / {opp.salary.period || 'mo'}
                        </span>
                      )}
                    </div>

                    {/* Required Skills Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {safeSkills.slice(0, 4).map((skillItem, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.74rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--box-subtle)',
                            color: 'var(--secondary-text)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          {formatSkill(skillItem)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: AI Gap Analysis + Details + Apply */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border-color)',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMentorForOpportunity({
                          id: opp._id,
                          title: opp.title,
                          company: displayCompany,
                          requiredSkills: safeSkills.map(formatSkill),
                          matchScore: matchScore ?? 75,
                        });
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        padding: '7px 11px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(37, 99, 235, 0.12)',
                        border: '1px solid rgba(37, 99, 235, 0.35)',
                        color: '#60a5fa',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={13} color="#60a5fa" />
                      <span>AI Gap Analysis</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('details', { id: opp._id });
                        }}
                        className="btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                      >
                        Details <ChevronRight size={13} />
                      </button>

                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('admin');
                          }}
                          className="btn-primary"
                          style={{
                            fontSize: '0.78rem',
                            padding: '6px 14px',
                            background: 'linear-gradient(135deg, #EF4444 0%, #A855F7 100%)',
                          }}
                        >
                          Moderate
                        </button>
                      ) : isApplied ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.78rem',
                            color: '#10b981',
                            fontWeight: 600,
                            padding: '6px 10px',
                          }}
                        >
                          <CheckCircle2 size={14} /> Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(opp);
                          }}
                          className="btn-primary"
                          style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}