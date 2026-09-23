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
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* 1. Header & Summary Metric Dashboard */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--secondary-navy)', marginBottom: '6px' }}>
          My Applications
        </h1>
        <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem' }}>
          Track your real-time recruitment progression, hiring feedback, and interview schedules.
        </p>

        {/* Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginTop: '20px',
          }}
        >
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid var(--primary-blue)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>TOTAL SUBMITTED</span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-blue)', marginTop: '2px' }}>{total}</h3>
          </div>
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid #D97706' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>UNDER REVIEW</span>
            <h3 style={{ fontSize: '1.8rem', color: '#D97706', marginTop: '2px' }}>{reviewing}</h3>
          </div>
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid #7C3AED' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>SHORTLISTED</span>
            <h3 style={{ fontSize: '1.8rem', color: '#7C3AED', marginTop: '2px' }}>{shortlisted}</h3>
          </div>
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid #0891B2' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>INTERVIEW CALLS</span>
            <h3 style={{ fontSize: '1.8rem', color: '#0891B2', marginTop: '2px' }}>{interviews}</h3>
          </div>
          <div className="card" style={{ padding: '16px', borderLeft: '4px solid #059669' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>OFFERS / SELECTED</span>
            <h3 style={{ fontSize: '1.8rem', color: '#059669', marginTop: '2px' }}>{selected}</h3>
          </div>
        </div>
      </div>

      {/* 2. Controls: Filter tabs & Kanban toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? 600 : 500,
                backgroundColor: activeTab === tab.id ? '#EFF6FF' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary-blue)' : 'var(--secondary-text)',
                border: activeTab === tab.id ? '1px solid #BFDBFE' : '1px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setViewMode('cards')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500,
              backgroundColor: viewMode === 'cards' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'cards' ? 'var(--primary-blue)' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <List size={14} /> Timeline View
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500,
              backgroundColor: viewMode === 'kanban' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'kanban' ? 'var(--primary-blue)' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LayoutGrid size={14} /> Kanban Board
          </button>
        </div>
      </div>

      {/* 3. View Mode Rendering */}
      {viewMode === 'cards' ? (
        /* Detailed Timeline Cards View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map((app) => {
            const opp = app.opportunity || {};
            return (
              <div key={app._id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3
                        style={{ fontSize: '1.2rem', color: 'var(--primary-text)', cursor: 'pointer' }}
                        onClick={() => navigate('details', { id: opp._id })}
                      >
                        {opp.title || 'Opportunity'}
                      </h3>
                      <ApplicationStatusBadge status={app.status} />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
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
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
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
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--secondary-text)' }}>
              <FileText size={36} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-text)', marginBottom: '6px' }}>
                No applications in this category
              </h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
                Explore open roles and apply with 1-click matching!
              </p>
              <button onClick={() => navigate('opportunities')} className="btn-primary">
                Browse Opportunities
              </button>
            </div>
          )}
        </div>
      ) : (
        /* KANBAN BOARD VIEW (Per UI/UX Brief optional Kanban specification) */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(220px, 1fr))',
            gap: '14px',
            overflowX: 'auto',
            paddingBottom: '20px',
          }}
        >
          {kanbanStages.map((stage) => {
            const stageApps = applications.filter((a) => a.status === stage);
            return (
              <div
                key={stage}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  border: '1px solid var(--border-color)',
                  minHeight: '400px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--secondary-navy)' }}>{stage}</strong>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {stageApps.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stageApps.map((app) => (
                    <div
                      key={app._id}
                      className="card"
                      style={{ padding: '12px', cursor: 'pointer' }}
                      onClick={() => navigate('details', { id: app.opportunity?._id || app.opportunity })}
                    >
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--primary-text)', marginBottom: '4px' }}>
                        {app.opportunity?.title || 'Role'}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>
                        {app.opportunity?.organization}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {stageApps.length === 0 && (
                    <div style={{ padding: '20px 10px', textAlign: 'center', color: '#94A3B8', fontSize: '0.75rem' }}>
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
