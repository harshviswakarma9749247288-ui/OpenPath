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
} from 'lucide-react';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { useApplicationStore } from '../store/useApplicationStore';
import { useUIStore } from '../store/useUIStore';
import OpportunityCard from '../components/OpportunityCard';
import BackButton from '../components/BackButton';

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
  } = useOpportunityStore();

  const { applications, fetchMyApplications, apply } = useApplicationStore();
  const { navigate, showToast } = useUIStore();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [minMatch, setMinMatch] = useState(0);
  const [showLiveDropdown, setShowLiveDropdown] = useState(false);
  const searchBoxRef = useRef(null);

  // Fetch user applications and full opportunity pool once on mount
  useEffect(() => {
    fetchMyApplications();
    if (!allOpportunities || allOpportunities.length === 0) {
      fetchOpportunities({ search: '', type: 'all', locationType: 'all', sortBy: 'latest' });
    }
  }, []);

  // Close live search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowLiveDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search & filter effect: automatically queries the database as user types or changes filters
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

  // Merge live-fetched opportunities with cached allOpportunities for instant 0ms live search
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

  // Extract live matching skill suggestions based on current search query
  const matchingSkills = useMemo(() => {
    const skillSet = new Set();
    sourceOpportunities.forEach((opp) => {
      (opp.requiredSkills || []).forEach((s) => {
        const name = typeof s === 'object' ? s.name : String(s);
        if (name) {
          if (!normalizedQuery || name.toLowerCase().includes(normalizedQuery)) {
            skillSet.add(name);
          }
        }
      });
    });
    return Array.from(skillSet).slice(0, 6);
  }, [sourceOpportunities, normalizedQuery]);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      <BackButton label="Back to Dashboard" fallbackPage="dashboard" style={{ marginBottom: '20px' }} />

      {/* Live Search & Top Action Bar */}
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
              placeholder="Live search by role title, skills (React, Node.js, Python, Docker), city, or company..."
              className="form-input"
              style={{
                paddingLeft: '44px',
                paddingRight: searchQuery ? '140px' : '115px',
                height: '50px',
                fontSize: '0.95rem',
                borderColor: showLiveDropdown && searchQuery ? '#A855F7' : undefined,
                boxShadow:
                  showLiveDropdown && searchQuery
                    ? '0 0 0 3px rgba(168, 85, 247, 0.2)'
                    : undefined,
              }}
              value={searchQuery}
              onFocus={() => setShowLiveDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowLiveDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape' || e.key === 'Enter') {
                  setShowLiveDropdown(false);
                }
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 2,
              }}
            >
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowLiveDropdown(false);
                  }}
                  title="Clear live search"
                  style={{
                    color: 'var(--secondary-text)',
                    padding: '4px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              )}
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: isLoading
                    ? 'rgba(168, 85, 247, 0.2)'
                    : 'rgba(16, 185, 129, 0.14)',
                  color: isLoading ? '#C084FC' : '#10B981',
                  border: isLoading
                    ? '1px solid rgba(168, 85, 247, 0.4)'
                    : '1px solid rgba(16, 185, 129, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={11} />
                {isLoading ? 'Syncing...' : 'Live Search'}
              </span>
            </div>
          </div>

          {/* Instant Live Search Results Dropdown */}
          {showLiveDropdown && normalizedQuery && (
            <div
              className="card animate-fade-in"
              style={{
                position: 'absolute',
                top: '56px',
                left: 0,
                right: 0,
                backgroundColor: 'var(--card-bg)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg), 0 12px 32px rgba(124, 58, 237, 0.22)',
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              {/* Dropdown Header */}
              <div
                style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--box-subtle)',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-text)' }}>
                  LIVE DATABASE RESULTS ({filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'MATCH' : 'MATCHES'})
                </span>
                {isLoading && (
                  <span style={{ fontSize: '0.72rem', color: '#C084FC', fontWeight: 600 }}>
                    Syncing with MongoDB...
                  </span>
                )}
              </div>

              {/* Matching Skills Quick Pills */}
              {matchingSkills.length > 0 && (
                <div
                  style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', marginRight: '4px' }}>
                    Matching Skills:
                  </span>
                  {matchingSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        setSearchQuery(skill);
                        setShowLiveDropdown(false);
                      }}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(168, 85, 247, 0.14)',
                        color: '#C084FC',
                        border: '1px solid rgba(168, 85, 247, 0.35)',
                        cursor: 'pointer',
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}

              {/* Live Opportunity Matches List */}
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {filteredOpportunities.length === 0 ? (
                  <div
                    style={{
                      padding: '22px 16px',
                      textAlign: 'center',
                      color: 'var(--secondary-text)',
                      fontSize: '0.875rem',
                    }}
                  >
                    No opportunities found matching "<strong style={{ color: 'var(--primary-text)' }}>{searchQuery}</strong>"
                  </div>
                ) : (
                  filteredOpportunities.slice(0, 6).map((opp) => (
                    <div
                      key={opp._id}
                      onClick={() => {
                        setShowLiveDropdown(false);
                        navigate('details', { id: opp._id });
                      }}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              color: 'var(--primary-text)',
                            }}
                          >
                            {opp.title}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor: 'rgba(168, 85, 247, 0.15)',
                              color: '#C084FC',
                            }}
                          >
                            {opp.type}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.775rem',
                            color: 'var(--secondary-text)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginTop: '4px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{opp.organization}</span>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <MapPin size={12} /> {opp.location?.type || 'Remote'}
                            {opp.location?.city ? ` (${opp.location.city})` : ''}
                          </span>
                          {(opp.requiredSkills || []).length > 0 && (
                            <>
                              <span>•</span>
                              <span style={{ color: '#A78BFA' }}>
                                {(opp.requiredSkills || [])
                                  .slice(0, 3)
                                  .map((s) => (typeof s === 'object' ? s.name : String(s)))
                                  .join(', ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        {opp.matchScore !== null && opp.matchScore !== undefined && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#10B981',
                              border: '1px solid rgba(16, 185, 129, 0.35)',
                            }}
                          >
                            {opp.matchScore}% Match
                          </span>
                        )}
                        <ArrowRight size={15} color="#C084FC" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer to close dropdown and browse filtered grid */}
              {filteredOpportunities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowLiveDropdown(false)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: 'var(--box-subtle)',
                    color: '#C084FC',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Showing {filteredOpportunities.length} live {filteredOpportunities.length === 1 ? 'result' : 'results'} in grid below
                </button>
              )}
            </div>
          )}
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
                boxShadow: selectedType === t ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none',
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
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
                boxShadow: selectedLocation === loc ? '0 0 15px rgba(6, 182, 212, 0.4)' : 'none',
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
              }}
            >
              {loc === 'all' ? 'Any Mode' : loc}
            </button>
          ))}
        </div>
      </div>

      {/* Main Browse Layout: Left Filter Panel + Right Listings */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        {/* Left Filter Panel */}
        <div
          className="card"
          style={{
            padding: '20px',
            height: 'fit-content',
            position: 'sticky',
            top: '88px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={16} /> Filters
            </strong>
            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.75rem', color: '#A78BFA', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Sort By Dropdown */}
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

          {/* Minimum Match Score Slider */}
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

          <div style={{ padding: '12px', backgroundColor: 'var(--status-blue-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '0.775rem', color: 'var(--status-blue)', marginTop: '16px' }}>
            💡 <strong>Pro Tip:</strong> Matches above 80% have strong overlap with your profile skills & coursework.
          </div>
        </div>

        {/* Right Listings Content */}
        <div>
          {/* Header with Results count & Grid/List view toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
              Showing <strong style={{ color: 'var(--primary-text)' }}>{filteredOpportunities.length}</strong> available opportunities
            </span>

            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--box-subtle)', border: '1px solid var(--border-color)', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  backgroundColor: viewMode === 'grid' ? 'var(--card-bg)' : 'transparent',
                  color: viewMode === 'grid' ? '#7C3AED' : 'var(--secondary-text)',
                  boxShadow: viewMode === 'grid' ? 'var(--shadow-subtle)' : 'none',
                }}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  backgroundColor: viewMode === 'list' ? 'var(--card-bg)' : 'transparent',
                  color: viewMode === 'list' ? '#7C3AED' : 'var(--secondary-text)',
                  boxShadow: viewMode === 'list' ? 'var(--shadow-subtle)' : 'none',
                }}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Opportunity Cards List/Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
              gap: '18px',
            }}
          >
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                onApply={handleApply}
                isApplied={appliedOppIds.includes(opp._id)}
              />
            ))}
          </div>

          {filteredOpportunities.length === 0 && !isLoading && (
            <div
              className="card"
              style={{
                padding: '48px',
                textAlign: 'center',
                color: 'var(--secondary-text)',
                marginTop: '20px',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--primary-text)' }}>
                No matching opportunities found
              </h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 16px auto' }}>
                Try adjusting your search criteria or resetting filters to view all verified listings.
              </p>
              <button onClick={handleResetFilters} className="btn-secondary">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
