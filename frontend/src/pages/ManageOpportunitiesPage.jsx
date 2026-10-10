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
import BackButton from '../components/BackButton';

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
    <div className="dashboard-container">
      <BackButton label="Back to Employer Hub" fallbackPage="employer-dashboard" />

      <div className="dashboard-header-banner">
        <div>
          <h1 className="header-title-main">
            Manage Your Opportunities
          </h1>
          <p className="header-sub-text">
            Review posted roles, track applicant counts per stage, and update active listing states.
          </p>
        </div>

        <button
          onClick={() => navigate('create-opportunity')}
          className="btn-primary"
        >
          <PlusCircle size={16} /> Post New Opportunity
        </button>
      </div>

      <div className="card dashboard-section-card">
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr className="dashboard-table-head-row">
                <th className="dashboard-table-th">Role / Organization</th>
                <th className="dashboard-table-th">Type & Location</th>
                <th className="dashboard-table-th">Status</th>
                <th className="dashboard-table-th">Applicants</th>
                <th className="dashboard-table-th">Shortlisted</th>
                <th className="dashboard-table-th">Deadline</th>
                <th className="dashboard-table-th align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={opp._id} className="dashboard-table-row">
                  <td className="dashboard-table-td">
                    <strong className="candidate-bg-title">
                      {opp.title}
                    </strong>
                    <span className="candidate-bg-desc">
                      {opp.organization}
                    </span>
                  </td>

                  <td className="dashboard-table-td">
                    <span className="badge badge-internship">
                      {opp.type}
                    </span>
                    <span className="candidate-bg-desc">
                      {opp.location?.type} ({opp.location?.city || (opp.location?.type === 'Remote' ? 'Remote' : 'Location not specified')})
                    </span>
                  </td>

                  <td className="dashboard-table-td">
                    <button
                      onClick={() => handleToggleStatus(opp._id, opp.status)}
                      className={`opp-status-toggle-btn ${opp.status === 'Active' ? 'active' : 'closed'}`}
                      title="Click to toggle Active/Closed"
                    >
                      {opp.status === 'Active' ? '● Active' : '○ Closed'}
                    </button>
                  </td>

                  <td className="dashboard-table-td">
                    <span className="table-stat-purple">
                      {opp.totalApplicants || 0}
                    </span>
                  </td>

                  <td className="dashboard-table-td">
                    <span className="table-stat-green">
                      {opp.shortlisted || 0}
                    </span>
                  </td>

                  <td className="dashboard-table-td">
                    {new Date(opp.deadline).toLocaleDateString()}
                  </td>

                  <td className="dashboard-table-td align-right">
                    <div className="dashboard-table-actions">
                      <button
                        onClick={() => navigate('candidate-review', { opportunityId: opp._id })}
                        className="btn-primary candidate-review-btn"
                      >
                        <Users size={14} /> Review Candidates
                      </button>
                      <button
                        onClick={() => handleDelete(opp._id)}
                        className="btn-table-delete"
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
                  <td colSpan={7} className="dashboard-table-empty">
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
