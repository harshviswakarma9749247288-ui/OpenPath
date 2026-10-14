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
import BackButton from '../components/BackButton';

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
        } else if (opps.length === 0) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
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
        .catch(() => {
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
    <div className="dashboard-container">
      <BackButton label="Back to Employer Hub" fallbackPage="employer-dashboard" />

      {/* Top Header & Opportunity Selector */}
      <div className="card card-featured dashboard-header-banner">
        <div>
          <span className="header-category-pill">
            CANDIDATE INTELLIGENCE
          </span>
          <h1 className="header-title-main">
            Candidate Review & Matching
          </h1>
          <p className="header-sub-text">
            Applicants ranked algorithmically by technical skill overlap and background compatibility.
          </p>
        </div>

        {/* Opportunity Selector Dropdown */}
        <div className="review-selector-wrap">
          <label className="form-label">Filter by Position</label>
          <select
            className="form-select"
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
            disabled={opportunities.length === 0}
          >
            {opportunities.length === 0 && <option value="">No opportunities posted</option>}
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
        <div className="dashboard-section-header">
          <h3 className="dashboard-section-title">
            Ranked Candidates for{' '}
            <strong className="text-accent-purple">{oppDetails?.title || 'Selected Role'}</strong>
          </h3>
          <span className="candidate-card-sub">
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

        {opportunities.length === 0 && !isLoading && (
          <div className="card dashboard-empty-state">
            <Briefcase size={36} color="#CBD5E1" className="dashboard-empty-icon" />
            <h4 className="dashboard-empty-title">
              No opportunities created yet
            </h4>
            <p className="dashboard-empty-sub">
              Post an internship or entry-level job to start receiving algorithmically matched talent!
            </p>
            <button onClick={() => navigate('create-opportunity')} className="btn-primary">
              Post an Opportunity
            </button>
          </div>
        )}

        {opportunities.length > 0 && candidates.length === 0 && !isLoading && (
          <div className="card dashboard-empty-state">
            <Users size={36} color="#CBD5E1" className="dashboard-empty-icon" />
            <h4 className="dashboard-empty-title">
              No candidates have applied to this role yet
            </h4>
            <p className="dashboard-empty-sub no-margin">
              Student applications will automatically appear here with their 5-factor match score!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
