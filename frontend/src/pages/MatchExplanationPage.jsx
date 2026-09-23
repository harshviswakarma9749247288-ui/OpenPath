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
import { useOpportunityStore } from '../store/useOpportunityStore';
import api from '../utils/api';
import MatchScoreBadge from '../components/MatchScoreBadge';

export default function MatchExplanationPage({ opportunityId }) {
  const { navigate } = useUIStore();
  const { opportunities } = useOpportunityStore();

  const [matchData, setMatchData] = useState(null);
  const [opp, setOpp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // If no specific opportunity was passed, pick the first one
  const targetId = opportunityId || (opportunities[0]?._id);

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

  if (isLoading || !matchData) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p>Loading algorithmic match breakdown...</p>
      </div>
    );
  }

  const { overallScore, breakdown, matchedSkills = [], missingSkills = [], summary } = matchData;

  const factors = [
    {
      title: '1. Skill Match',
      weight: 40,
      icon: Target,
      color: '#2563EB',
      data: breakdown?.skillMatch,
      formula: 'Overlap between your profile skills and mandatory role competencies.',
    },
    {
      title: '2. Academic Qualification',
      weight: 20,
      icon: GraduationCap,
      color: '#059669',
      data: breakdown?.qualification,
      formula: 'Degree level and field of study alignment against opportunity criteria.',
    },
    {
      title: '3. Location & Work Mode',
      weight: 20,
      icon: MapPin,
      color: '#7C3AED',
      data: breakdown?.location,
      formula: 'Remote availability or regional city proximity and preferences.',
    },
    {
      title: '4. Industry Interest',
      weight: 10,
      icon: Heart,
      color: '#DB2777',
      data: breakdown?.interest,
      formula: 'Shared domain tags, industry verticals, and career aspirations.',
    },
    {
      title: '5. Experience Level',
      weight: 10,
      icon: Briefcase,
      color: '#D97706',
      data: breakdown?.experience,
      formula: 'Suitability for students, freshers, or project background.',
    },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      <button
        onClick={() => navigate('details', { id: targetId })}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}
      >
        <ArrowLeft size={16} /> Back to Opportunity Details
      </button>

      {/* Main Score Header */}
      <div
        className="card card-featured"
        style={{
          padding: '32px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--primary-blue)',
              textTransform: 'uppercase',
              backgroundColor: '#EFF6FF',
              padding: '3px 10px',
              borderRadius: '9999px',
            }}
          >
            EXPLAINABLE AI TRANSPARENCY
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '10px', color: 'var(--secondary-navy)' }}>
            Why This Role Matches You
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
            Match calculation for <strong>{opp?.title}</strong> at {opp?.organization}
          </p>
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              maxWidth: '560px',
              fontSize: '0.9rem',
              color: 'var(--primary-text)',
            }}
          >
            <Sparkles size={16} color="var(--primary-blue)" style={{ display: 'inline', marginRight: '6px' }} />
            {summary}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <MatchScoreBadge score={overallScore} size={84} strokeWidth={6} showLabel={true} />
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--secondary-text)', marginTop: '6px' }}>
            Overall Fit Index
          </span>
        </div>
      </div>

      {/* 5-Factor Detail Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-navy)', marginBottom: '8px' }}>
          5 Weighted Decision Factors
        </h3>

        {factors.map((f, idx) => {
          const score = f.data?.score || 0;
          const contrib = f.data?.contribution || 0;
          const details = f.data?.details || '';
          const Icon = f.icon;

          return (
            <div key={idx} className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: f.color,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-text)' }}>{f.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>{f.formula}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                    +{contrib}%
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', display: 'block' }}>
                    out of {f.weight}% max
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${score}%`,
                    backgroundColor: score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444',
                    borderRadius: '4px',
                  }}
                />
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '6px' }}>
                <strong>Assessment: </strong> {details}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skills Comparison & Bridge CTA */}
      <div
        className="card"
        style={{
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Want to improve your match score?</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
            Visit the Skill Gap roadmap to find targeted tutorials for your missing competencies.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('skill-gap', { id: targetId })} className="btn-primary">
            Analyze Skill Gap <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
