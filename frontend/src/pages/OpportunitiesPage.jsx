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
    <div className="opportunities-page-container">
      <BackButton label="Back to Dashboard" fallbackPage="dashboard" className="profile-back-btn" />

      {/* Live Search & Filter Bar */}
      <div className="opp-search-section">
        <div ref={searchBoxRef} className="opp-search-box-wrap">
          <div className="opp-search-input-wrap">
            <Search
              size={18}
              color="#A855F7"
              className="opp-search-icon"
            />
            <input
              type="text"
              placeholder="Live search by role title, skills (React, Node.js, Python), city, or company..."
              className={`form-input opp-search-input ${searchQuery ? 'has-query' : ''}`}
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
                className="opp-search-clear-btn"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="opp-quick-chips-row">
          {['all', 'Internship', 'Apprenticeship', 'Entry-level Job'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`opp-filter-chip ${selectedType === t ? 'active' : ''}`}
            >
              {t === 'all' ? 'All Roles' : t}
            </button>
          ))}
          {['all', 'Remote', 'Hybrid', 'On-site'].map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`opp-loc-chip ${selectedLocation === loc ? 'active' : ''}`}
            >
              {loc === 'all' ? 'Any Mode' : loc}
            </button>
          ))}
        </div>
      </div>

      {/* Main Browse Layout */}
      <div className="opportunities-browse-layout">
        {/* Left Filter Panel */}
        <div className="card filter-panel-sidebar">
          <div className="filter-header-row">
            <strong className="filter-section-title">
              <SlidersHorizontal size={16} /> Filters
            </strong>
            <button
              onClick={handleResetFilters}
              className="filter-reset-link"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Sort Listings By</label>
            <select
              className="form-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="match">Highest Match Score</option>
              <option value="deadline">Approaching Deadline</option>
            </select>
          </div>

          <div className="form-group">
            <div className="filter-score-row">
              <label className="form-label">Min Match Score</label>
              <strong className="filter-score-val">{minMatch}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="filter-range-input"
            />
          </div>
        </div>

        {/* Right Listings Content */}
        <div>
          <div className="opp-results-header">
            <span>
              Showing <strong className="var-primary-text">{filteredOpportunities.length}</strong> available opportunities
            </span>
          </div>

          {/* Cards Grid */}
          <div className="opp-cards-grid">
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
                  className="card card-hover opp-item-card"
                  onClick={() => navigate('details', { id: opp._id })}
                >
                  <div>
                    <div className="opp-item-header">
                      <div className="opp-company-block">
                        <div className="opp-company-logo">
                          {displayCompany.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="opp-item-title">
                            {opp.title}
                          </h3>
                          <span className="opp-item-company-name">
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
                          className={`opp-item-bookmark-btn ${isSaved ? 'saved' : ''}`}
                        >
                          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      )}
                    </div>

                    <div className="opp-item-badges-row">
                      <span className="opp-item-role-badge">
                        {opp.type || 'Internship'}
                      </span>

                      <span className="opp-item-loc-badge">
                        <MapPin size={11} /> {displayLocation}
                      </span>

                      {opp.salary?.amount && (
                        <span className="opp-item-salary-badge">
                          <IndianRupee size={11} /> {opp.salary.amount} / {opp.salary.period || 'mo'}
                        </span>
                      )}
                    </div>

                    {/* Required Skills Chips */}
                    <div className="opp-item-skills-row">
                      {safeSkills.slice(0, 4).map((skillItem, idx) => (
                        <span
                          key={idx}
                          className="opp-item-skill-chip"
                        >
                          {formatSkill(skillItem)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: AI Gap Analysis + Details + Apply */}
                  <div className="opp-item-footer">
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
                      className="opp-item-mentor-btn"
                    >
                      <Sparkles size={13} color="#60a5fa" />
                      <span>AI Gap Analysis</span>
                    </button>

                    <div className="opp-item-actions-row">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('details', { id: opp._id });
                        }}
                        className="btn-secondary opp-item-details-btn"
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
                          className="btn-primary opp-item-admin-btn"
                        >
                          Moderate
                        </button>
                      ) : isApplied ? (
                        <span className="opp-item-applied-badge">
                          <CheckCircle2 size={14} /> Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(opp);
                          }}
                          className="btn-primary opp-item-apply-btn"
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