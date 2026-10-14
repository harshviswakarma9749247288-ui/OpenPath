import React, { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  Eye,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApplicationStore } from '../store/useApplicationStore';
import { useUIStore } from '../store/useUIStore';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import ApplicationTimeline from '../components/ApplicationTimeline';
import BackButton from '../components/BackButton';

export default function ApplicationsPage() {
  const { applications, fetchMyApplications, isLoading } = useApplicationStore();
  const { navigate } = useUIStore();

  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'kanban'

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const total = applications.length;
  const reviewing = applications.filter((a) => a.status === 'Reviewing').length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviews = applications.filter((a) => a.status === 'Interview').length;
  const selected = applications.filter((a) => a.status === 'Selected').length;

  const filtered =
    activeTab === 'all'
      ? applications
      : applications.filter((a) => a.status.toLowerCase() === activeTab.toLowerCase());

  const kanbanStages = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Selected'];

  return (
    <div className="dashboard-container">
      <BackButton label="Back to Dashboard" fallbackPage="dashboard" />

      {/* 1. Header & Summary Metric Dashboard */}
      <div className="dashboard-section-wrap">
        <h1 className="header-title-main">
          My Applications
        </h1>
        <p className="header-sub-text">
          Track your real-time recruitment progression, hiring feedback, and interview schedules.
        </p>

        {/* Metrics Bar */}
        <div className="kpi-grid">
          <div className="card kpi-card kpi-purple">
            <span className="kpi-label">TOTAL SUBMITTED</span>
            <h3 className="kpi-value purple">{total}</h3>
          </div>
          <div className="card kpi-card kpi-amber">
            <span className="kpi-label">UNDER REVIEW</span>
            <h3 className="kpi-value amber">{reviewing}</h3>
          </div>
          <div className="card kpi-card kpi-pink">
            <span className="kpi-label">SHORTLISTED</span>
            <h3 className="kpi-value pink">{shortlisted}</h3>
          </div>
          <div className="card kpi-card kpi-cyan">
            <span className="kpi-label">INTERVIEW CALLS</span>
            <h3 className="kpi-value cyan">{interviews}</h3>
          </div>
          <div className="card kpi-card kpi-emerald">
            <span className="kpi-label">OFFERS / SELECTED</span>
            <h3 className="kpi-value emerald">{selected}</h3>
          </div>
        </div>
      </div>

      {/* 2. Controls: Filter tabs & Kanban toggle */}
      <div className="app-controls-row">
        <div className="app-filter-tabs-container">
          {[
            { id: 'all', label: `All (${total})` },
            { id: 'applied', label: 'Applied' },
            { id: 'reviewing', label: 'Reviewing' },
            { id: 'shortlisted', label: 'Shortlisted' },
            { id: 'interview', label: 'Interview' },
            { id: 'selected', label: 'Selected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`filter-tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="mode-toggle-group">
          <button
            onClick={() => setViewMode('cards')}
            className={`mode-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
          >
            <List size={14} /> Timeline View
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`mode-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
          >
            <LayoutGrid size={14} /> Kanban Board
          </button>
        </div>
      </div>

      {/* 3. View Mode Rendering */}
      {viewMode === 'cards' ? (
        /* Detailed Timeline Cards View */
        <div className="app-cards-view-wrap">
          {filtered.map((app) => {
            const opp = app.opportunity || {};
            return (
              <div key={app._id} className="card app-item-card">
                <div className="app-item-header-row">
                  <div>
                    <div className="candidate-card-title-row">
                      <h3
                        className="candidate-card-title clickable"
                        onClick={() => navigate('details', { id: opp._id })}
                      >
                        {opp.title || 'Opportunity'}
                      </h3>
                      <ApplicationStatusBadge status={app.status} />
                    </div>
                    <p className="candidate-bg-desc">
                      {opp.organization} • Applied on{' '}
                      {new Date(app.appliedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('details', { id: opp._id })}
                    className="btn-outline"
                  >
                    View Listing <ExternalLink size={14} />
                  </button>
                </div>

                {/* Vertical Stage Timeline Component */}
                <ApplicationTimeline timeline={app.timeline} interviewDetails={app.interviewDetails} />
              </div>
            );
          })}

          {filtered.length === 0 && !isLoading && (
            <div className="card dashboard-empty-state">
              <FileText size={36} color="#CBD5E1" className="dashboard-empty-icon" />
              <h3 className="dashboard-empty-title">
                No applications in this category
              </h3>
              <p className="dashboard-empty-sub">
                Explore open roles and apply with 1-click matching!
              </p>
              <button onClick={() => navigate('opportunities')} className="btn-primary">
                Browse Opportunities
              </button>
            </div>
          )}
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="kanban-board-wrapper">
          {kanbanStages.map((stage) => {
            const stageApps = applications.filter((a) => a.status === stage);
            return (
              <div key={stage} className="kanban-col">
                <div className="kanban-col-header">
                  <strong className="kanban-col-title">{stage}</strong>
                  <span className="kanban-col-count">
                    {stageApps.length}
                  </span>
                </div>

                <div className="kanban-col-cards">
                  {stageApps.map((app) => (
                    <div
                      key={app._id}
                      className="card kanban-card"
                      onClick={() => navigate('details', { id: app.opportunity?._id || app.opportunity })}
                    >
                      <h4 className="kanban-card-title">
                        {app.opportunity?.title || 'Role'}
                      </h4>
                      <p className="kanban-card-org">
                        {app.opportunity?.organization}
                      </p>
                      <span className="kanban-card-date">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {stageApps.length === 0 && (
                    <div className="kanban-empty-state">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
