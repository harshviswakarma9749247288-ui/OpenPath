import React, { useEffect, useState } from 'react';
import {
  Layers,
  PlusCircle,
  Users,
  Eye,
  Trash2,
  Calendar,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/api';

export default function ManageOpportunitiesPage() {
  const { navigate, showToast } = useUIStore();

  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployerListings = () => {
    setIsLoading(true);
    api
      .get('/employer/opportunities')
      .then((res) => {
        setOpportunities(res.data.opportunities || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployerListings();
  }, []);

  const handleToggleStatus = async (oppId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
    try {
      await api.put(`/opportunities/${oppId}`, { status: newStatus });
      showToast(`Listing status updated to ${newStatus}`, 'success');
      fetchEmployerListings();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (oppId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/opportunities/${oppId}`);
      showToast('Listing removed successfully', 'success');
      setOpportunities(opportunities.filter((o) => o._id !== oppId));
    } catch (err) {
      showToast('Failed to delete listing', 'error');
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#FFFFFF', marginBottom: '4px' }}>
            Manage Your Opportunities
          </h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem' }}>
            Review posted roles, track applicant counts per stage, and update active listing states.
          </p>
        </div>

        <button
          onClick={() => navigate('create-opportunity')}
          className="btn-primary"
          style={{ padding: '10px 20px' }}
        >
          <PlusCircle size={16} /> Post New Opportunity
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-color)', color: 'var(--secondary-text)' }}>
                <th style={{ padding: '12px 14px' }}>Role / Organization</th>
                <th style={{ padding: '12px 14px' }}>Type & Location</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Applicants</th>
                <th style={{ padding: '12px 14px' }}>Shortlisted</th>
                <th style={{ padding: '12px 14px' }}>Deadline</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={opp._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '14px' }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--primary-text)', display: 'block' }}>
                      {opp.title}
                    </strong>
                    <span style={{ fontSize: '0.775rem', color: 'var(--secondary-text)' }}>
                      {opp.organization}
                    </span>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <span className="badge badge-internship" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>
                      {opp.type}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--secondary-text)' }}>
                      {opp.location?.type} ({opp.location?.city || 'Bengaluru'})
                    </span>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <button
                      onClick={() => handleToggleStatus(opp._id, opp.status)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: opp.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: opp.status === 'Active' ? '#34D399' : 'var(--secondary-text)',
                        border: opp.status === 'Active' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
                        cursor: 'pointer',
                      }}
                      title="Click to toggle Active/Closed"
                    >
                      {opp.status === 'Active' ? '● Active' : '○ Closed'}
                    </button>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <span style={{ fontWeight: 700, color: '#C084FC', fontSize: '1rem' }}>
                      {opp.totalApplicants || 0}
                    </span>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <span style={{ fontWeight: 600, color: '#34D399' }}>
                      {opp.shortlisted || 0}
                    </span>
                  </td>

                  <td style={{ padding: '14px', color: 'var(--secondary-text)', fontSize: '0.8rem' }}>
                    {new Date(opp.deadline).toLocaleDateString()}
                  </td>

                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => navigate('candidate-review', { opportunityId: opp._id })}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.775rem' }}
                      >
                        <Users size={14} /> Review Candidates
                      </button>
                      <button
                        onClick={() => handleDelete(opp._id)}
                        style={{
                          padding: '6px 10px',
                          color: '#F87171',
                          borderRadius: '8px',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Delete Listing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {opportunities.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
                    No opportunities posted yet. Click "Post New Opportunity" above to create your first listing.
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
