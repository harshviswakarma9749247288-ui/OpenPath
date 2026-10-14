import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Target,
  GraduationCap,
  MapPin,
  Heart,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { useOpportunityStore } from '../store/useOpportunityStore';
import api from '../utils/api';
import MatchScoreBadge from '../components/MatchScoreBadge';
import HoloRadar3D from '../components/HoloRadar3D';
import Tilt3DCard from '../components/Tilt3DCard';
import CyberLoader from '../components/CyberLoader';
import BackButton from '../components/BackButton';

export default function MatchExplanationPage({ opportunityId }) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const { navigate } = useUIStore();
  const { opportunities } = useOpportunityStore();

  const [matchData, setMatchData] = useState(null);
  const [opp, setOpp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [targetId, setTargetId] = useState(opportunityId || opportunities[0]?._id || null);

  useEffect(() => {
    if (opportunityId) {
      setTargetId(opportunityId);
    } else if (opportunities.length > 0) {
      setTargetId(opportunities[0]._id);
    } else {
      api
        .get('/opportunities?limit=1')
        .then((res) => {
          if (res.data?.opportunities?.[0]?._id) {
            setTargetId(res.data.opportunities[0]._id);
          } else {
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [opportunityId, opportunities]);

  useEffect(() => {
    if (targetId) {
      setIsLoading(true);
      api
        .get(`/opportunities/${targetId}/match`)
        .then((res) => {
          setMatchData(res.data.match);
          setOpp(res.data.opportunity);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [targetId]);

  if (isLoading) {
    return <CyberLoader message="Synthesizing 5-Factor Algorithmic Match Breakdown..." />;
  }

  if (!matchData) {
    return (
      <div className="card dashboard-empty-state">
        <AlertTriangle size={48} color="#F59E0B" className="dashboard-empty-icon" />
        <h2 className="dashboard-empty-title">No Opportunity Selected</h2>
        <p className="dashboard-empty-sub">
          Please select an opportunity from the dashboard or listings to analyze your personalized match breakdown.
        </p>
        <button onClick={() => navigate('opportunities')} className="btn-primary">
          Browse Opportunities
        </button>
      </div>
    );
  }

  const { overallScore, breakdown, matchedSkills = [], missingSkills = [], summary } = matchData;

  const factors = [
    {
      title: '1. Skill Match',
      weight: 40,
      icon: Target,
      colorClass: 'cyan',
      data: breakdown?.skillMatch,
      formula: 'Overlap between your profile skills and mandatory role competencies.',
    },
    {
      title: '2. Academic Qualification',
      weight: 20,
      icon: GraduationCap,
      colorClass: 'emerald',
      data: breakdown?.qualification,
      formula: 'Degree level and field of study alignment against opportunity criteria.',
    },
    {
      title: '3. Location & Work Mode',
      weight: 20,
      icon: MapPin,
      colorClass: 'purple',
      data: breakdown?.location,
      formula: 'Remote availability or regional city proximity and preferences.',
    },
    {
      title: '4. Industry Interest',
      weight: 10,
      icon: Heart,
      colorClass: 'pink',
      data: breakdown?.interest,
      formula: 'Shared domain tags, industry verticals, and career aspirations.',
    },
    {
      title: '5. Experience Level',
      weight: 10,
      icon: Briefcase,
      colorClass: 'amber',
      data: breakdown?.experience,
      formula: 'Suitability for students, freshers, or project background.',
    },
  ];

  return (
    <div className="dashboard-container">
      <BackButton
        label={isAdmin ? "Back to Admin Command Center" : "Back to Opportunity Details"}
        fallbackPage={isAdmin ? "admin" : "details"}
        fallbackParams={isAdmin ? {} : { id: targetId }}
      />

      {/* Main Score Header */}
      <div className="card card-featured dashboard-header-banner">
        <div>
          <span className="header-category-pill">
            EXPLAINABLE AI TRANSPARENCY
          </span>
          <h1 className="header-title-main">
            Why This Role Matches You
          </h1>
          <p className="header-sub-text">
            Match calculation for <strong>{opp?.title}</strong> at {opp?.organization}
          </p>
          <div className="match-summary-callout">
            <Sparkles size={16} color="#C084FC" className="sparkle-inline-icon" />
            {summary}
          </div>
        </div>

        <div className="text-center">
          <MatchScoreBadge score={overallScore} size={84} strokeWidth={6} showLabel={true} />
          <span className="candidate-bg-desc">
            Overall Fit Index
          </span>
        </div>
      </div>

      {/* 3D Holographic Factor Topology Radar */}
      <div className="dashboard-section-wrap">
        <HoloRadar3D breakdown={breakdown} overallScore={overallScore} />
      </div>

      {/* 5-Factor Detail Cards with 3D Tilt */}
      <div className="match-factors-list-wrap">
        <h3 className="dashboard-section-title">
          5 Weighted Decision Factors
        </h3>

        {factors.map((f, idx) => {
          const score = f.data?.score || 0;
          const contrib = f.data?.contribution || 0;
          const details = f.data?.details || '';
          const Icon = f.icon;

          return (
            <Tilt3DCard key={idx} className="card factor-card-item" maxTilt={5}>
              <div className="factor-card-header">
                <div className="candidate-card-title-row">
                  <div className={`factor-icon-box ${f.colorClass}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="candidate-card-title">{f.title}</h4>
                    <span className="candidate-bg-desc">{f.formula}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`factor-score-value ${f.colorClass}`}>
                    +{contrib}%
                  </span>
                  <span className="candidate-bg-desc">
                    out of {f.weight}% max
                  </span>
                </div>
              </div>

              {/* Progress Bar (Dynamic math width kept) */}
              <div className="factor-progress-bg">
                <div
                  className="factor-progress-bar"
                  data-score={score >= 80 ? 'high' : score >= 50 ? 'med' : 'low'}
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="factor-assessment-box">
                <strong className="candidate-bg-title">Assessment: </strong> {details}
              </div>
            </Tilt3DCard>
          );
        })}
      </div>

      {/* Skills Comparison & Bridge CTA / Admin Moderation CTA */}
      <div className={`card improvement-cta-card ${isAdmin ? 'admin-notice' : ''}`}>
        <div>
          <h4 className={`improvement-title ${isAdmin ? 'admin' : ''}`}>
            {isAdmin ? 'Listing Governance & Candidate Tracking' : 'Want to improve your match score?'}
          </h4>
          <p className="candidate-bg-desc">
            {isAdmin
              ? 'Access candidate submissions, audit matching criteria, and adjust visibility status in Admin Command.'
              : 'Visit the Skill Gap roadmap to find targeted tutorials for your missing competencies.'}
          </p>
        </div>
        <div className="dashboard-header-actions">
          {isAdmin ? (
            <button onClick={() => navigate('admin')} className="btn-primary btn-admin-danger">
              Open Admin Command Center <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={() => navigate('skill-gap', { id: targetId })} className="btn-primary">
              Analyze Skill Gap <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
