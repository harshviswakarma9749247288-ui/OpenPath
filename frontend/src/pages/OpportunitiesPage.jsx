import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { useOpportunityStore } from '../store/useOpportunityStore';
import { useApplicationStore } from '../store/useApplicationStore';
import { useUIStore } from '../store/useUIStore';
import OpportunityCard from '../components/OpportunityCard';

export default function OpportunitiesPage() {
  const {
    opportunities,
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

  useEffect(() => {
    fetchOpportunities();
    fetchMyApplications();
  }, [selectedType, selectedLocation, selectedSort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedLocation('all');
    setSelectedSort('latest');
    setMinMatch(0);
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

  const filteredOpportunities = opportunities.filter((opp) => {
    if (minMatch > 0 && opp.matchScore !== null && opp.matchScore < minMatch) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* Search & Top Action Bar */}
      <div style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by title, skills (React, Node.js, Python), or company..."
              className="form-input"
              style={{ paddingLeft: '40px', height: '46px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}>
            Search
          </button>
        </form>

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
