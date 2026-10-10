import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/api';
import MatchScoreBadge from '../components/MatchScoreBadge';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import BackButton from '../components/BackButton';

export default function EmployerDashboard() {
  const { navigate } = useUIStore();

  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get('/employer/dashboard-stats')
      .then((res) => {
        setStats(res.data.stats);
        setRecentApplications(res.data.recentApplications || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <BackButton label="Back to Home" fallbackPage="landing" />

      {/* 1. Header Banner & Post CTA */}
      <div className="card card-featured dashboard-header-banner">
        <div>
          <span className="header-category-pill">
            EMPLOYER COMMAND CENTER
          </span>
          <h1 className="header-title-main">
            Recruitment Overview
          </h1>
          <p className="header-sub-text">
            Manage early-talent postings and evaluate candidates ranked by algorithmic skill match.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button
            onClick={() => navigate('manage-opportunities')}
            className="btn-secondary"
          >
            <Layers size={16} /> Manage Listings
          </button>
          <button
            onClick={() => navigate('create-opportunity')}
            className="btn-primary"
          >
            <PlusCircle size={16} /> Post New Opportunity
          </button>
        </div>
      </div>

      {/* 2. Metrics Bar */}
      <div className="kpi-grid">
        <div className="card kpi-card kpi-purple">
          <span className="kpi-label">
            ACTIVE LISTINGS
          </span>
          <h3 className="kpi-value purple">
            {stats?.activeListings ?? 0}
          </h3>
          <span className="kpi-subtext">Verified roles published</span>
        </div>

        <div className="card kpi-card kpi-cyan">
          <span className="kpi-label">
            TOTAL CANDIDATES
          </span>
          <h3 className="kpi-value cyan">
            {stats?.totalApplications ?? 0}
          </h3>
          <span className="kpi-subtext">Applications submitted</span>
        </div>

        <div className="card kpi-card kpi-pink">
          <span className="kpi-label">
            SHORTLISTED
          </span>
          <h3 className="kpi-value pink">
            {stats?.shortlistedCount ?? 0}
          </h3>
          <span className="kpi-subtext">High compatibility fit</span>
        </div>

        <div className="card kpi-card kpi-amber">
          <span className="kpi-label">
            INTERVIEWS
          </span>
          <h3 className="kpi-value amber">
            {stats?.interviewCount ?? 0}
          </h3>
          <span className="kpi-subtext">Scheduled technical rounds</span>
        </div>
      </div>

      {/* 3. Recent Applicants Quick Review Table */}
      <div className="card dashboard-section-card">
        <div className="dashboard-section-header">
          <div>
            <h3 className="dashboard-section-title">
              Recent Candidate Applications
            </h3>
            <p className="dashboard-section-subtitle">
              Candidates automatically matched against opportunity required skills.
            </p>
          </div>
          <button
            onClick={() => navigate('candidate-review')}
            className="btn-primary"
          >
            Open Candidate Review Portal <ArrowRight size={14} />
          </button>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr className="dashboard-table-head-row">
                <th className="dashboard-table-th">Candidate</th>
                <th className="dashboard-table-th">Applied Role</th>
                <th className="dashboard-table-th">Date</th>
                <th className="dashboard-table-th">Status</th>
                <th className="dashboard-table-th align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr key={app._id} className="dashboard-table-row">
                  <td className="dashboard-table-td primary-bold">
                    <div className="candidate-card-title-row">
                      <div className="dashboard-user-avatar-initials">
                        {app.user?.name?.substring(0, 2).toUpperCase() || 'CA'}
                      </div>
                      <div>
                        <span>{app.user?.name || 'Applicant'}</span>
                        <span className="candidate-bg-desc">
                          {app.user?.education?.degree || app.user?.email || 'Candidate'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="dashboard-table-td">
                    {app.opportunity?.title}
                  </td>
                  <td className="dashboard-table-td">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="dashboard-table-td">
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td className="dashboard-table-td align-right">
                    <button
                      onClick={() => navigate('candidate-review', { opportunityId: app.opportunity?._id })}
                      className="btn-secondary candidate-review-btn"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {recentApplications.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="dashboard-table-empty">
                    No applications submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
