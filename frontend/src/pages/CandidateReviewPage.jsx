import React, { useEffect, useState } from 'react';
import {
  Users,
  Briefcase,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/api';
import EmployerCandidateCard from '../components/EmployerCandidateCard';

export default function CandidateReviewPage({ opportunityId }) {
  const { navigate, showToast } = useUIStore();

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState(opportunityId || '');
  const [candidates, setCandidates] = useState([]);
  const [oppDetails, setOppDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load all employer opportunities first
  useEffect(() => {
    api
      .get('/employer/opportunities')
      .then((res) => {
        const opps = res.data.opportunities || [];
        setOpportunities(opps);
        if (!selectedOppId && opps.length > 0) {
          setSelectedOppId(opps[0]._id);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch candidates whenever selectedOppId changes
  useEffect(() => {
    if (selectedOppId) {
      setIsLoading(true);
      api
        .get(`/employer/opportunities/${selectedOppId}/candidates`)
        .then((res) => {
          setCandidates(res.data.candidates || []);
          setOppDetails(res.data.opportunity);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [selectedOppId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
        note: `Employer moved application to ${newStatus} stage.`,
      });
      showToast(`Candidate status updated to ${newStatus}!`, 'success');
      // Update local state
      setCandidates((prev) =>
        prev.map((c) => (c.applicationId === applicationId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      <button
        onClick={() => navigate('employer-dashboard')}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Top Header & Opportunity Selector */}
      <div
        className="card card-featured"
        style={{
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#C084FC',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              padding: '4px 12px',
              borderRadius: '9999px',
              letterSpacing: '0.05em',
            }}
          >
            CANDIDATE INTELLIGENCE
          </span>
          <h1 style={{ fontSize: '1.85rem', marginTop: '10px', color: 'var(--primary-text)' }}>
            Candidate Review & Matching
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
            Applicants ranked algorithmically by technical skill overlap and background compatibility.
          </p>
        </div>

        {/* Opportunity Selector Dropdown */}
        <div style={{ minWidth: '260px' }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Position</label>
          <select
            className="form-select"
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
          >
            {opportunities.map((opp) => (
              <option key={opp._id} value={opp._id}>
                {opp.title} ({opp.totalApplicants || 0} applicants)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-text)' }}>
            Ranked Candidates for{' '}
            <strong style={{ color: '#C084FC' }}>{oppDetails?.title || 'Selected Role'}</strong>
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
            {candidates.length} Candidate{candidates.length !== 1 ? 's' : ''} Evaluated
          </span>
        </div>

        {candidates.map((cand) => (
          <EmployerCandidateCard
            key={cand.applicationId}
            candidate={cand}
            onStatusChange={handleStatusChange}
          />
        ))}

        {candidates.length === 0 && !isLoading && (
          <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--secondary-text)' }}>
            <Users size={36} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-text)', marginBottom: '6px' }}>
              No candidates have applied to this role yet
            </h4>
            <p style={{ fontSize: '0.85rem' }}>
              Student applications will automatically appear here with their 5-factor match score!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
