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
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* 1. Header Banner & Post CTA */}
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
            EMPLOYER COMMAND CENTER
          </span>
          <h1 style={{ fontSize: '1.9rem', marginTop: '10px', color: 'var(--primary-text)' }}>
            Recruitment Overview
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
            Manage early-talent postings and evaluate candidates ranked by algorithmic skill match.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('manage-opportunities')}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.875rem' }}
          >
            <Layers size={16} /> Manage Listings
          </button>
          <button
            onClick={() => navigate('create-opportunity')}
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.875rem' }}
          >
            <PlusCircle size={16} /> Post New Opportunity
          </button>
        </div>
      </div>

      {/* 2. Metrics Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #8B5CF6' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
            ACTIVE LISTINGS
          </span>
          <h3 style={{ fontSize: '2rem', color: '#C084FC', marginTop: '2px' }}>
            {stats?.activeListings || 6}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Verified roles published</span>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #06B6D4' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
            TOTAL CANDIDATES
          </span>
          <h3 style={{ fontSize: '2rem', color: '#38BDF8', marginTop: '2px' }}>
            {stats?.totalApplications || 2}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Applications submitted</span>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #C026D3' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
            SHORTLISTED
          </span>
          <h3 style={{ fontSize: '2rem', color: '#F472B6', marginTop: '2px' }}>
            {stats?.shortlistedCount || 1}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>High compatibility fit</span>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #F59E0B' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
            INTERVIEWS
          </span>
          <h3 style={{ fontSize: '2rem', color: '#FBBF24', marginTop: '2px' }}>
            {stats?.interviewCount || 0}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Scheduled technical rounds</span>
        </div>
      </div>

      {/* 3. Recent Applicants Quick Review Table */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-text)' }}>
              Recent Candidate Applications
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
              Candidates automatically matched against opportunity required skills.
            </p>
          </div>
          <button
            onClick={() => navigate('candidate-review')}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.825rem' }}
          >
            Open Candidate Review Portal <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-color)', color: 'var(--secondary-text)' }}>
                <th style={{ padding: '12px 14px' }}>Candidate</th>
                <th style={{ padding: '12px 14px' }}>Applied Role</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px', fontWeight: 600, color: 'var(--primary-text)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(124, 58, 237, 0.2)',
                          color: '#C084FC',
                          border: '1px solid rgba(168, 85, 247, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {app.user?.name?.substring(0, 2).toUpperCase() || 'AL'}
                      </div>
                      <div>
                        <span>{app.user?.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', display: 'block' }}>
                          {app.user?.education?.degree || 'B.Tech CS'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--secondary-text)' }}>
                    {app.opportunity?.title}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--secondary-text)' }}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button
                      onClick={() => navigate('candidate-review', { opportunityId: app.opportunity?._id })}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.775rem' }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {recentApplications.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--secondary-text)' }}>
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
