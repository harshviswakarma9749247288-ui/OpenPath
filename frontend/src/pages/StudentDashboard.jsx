import React, { useEffect, useState } from 'react';
import {
  Compass,
  FileText,
  BookOpen,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/api';
import OpportunityCard from '../components/OpportunityCard';
import MatchScoreBadge from '../components/MatchScoreBadge';

export default function StudentDashboard() {
  const { user, profileCompletion } = useAuthStore();
  const { navigate } = useUIStore();

  const [recommendations, setRecommendations] = useState({
    bestMatches: [],
    basedOnSkills: [],
    basedOnInterests: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get('/matches/recommended')
      .then((res) => {
        setRecommendations(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const percentage = profileCompletion?.percentage || 70;
  const missing = profileCompletion?.missingFields || [];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* 1. Profile Completion Banner */}
      <div
        className="card card-featured"
        style={{
          padding: '24px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Circular Percentage */}
          <MatchScoreBadge score={percentage} size={64} strokeWidth={5} showLabel={false} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-text)' }}>Profile Completeness</h3>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: percentage >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: percentage >= 80 ? '#34D399' : '#FBBF24',
                  border: `1px solid ${percentage >= 80 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                }}
              >
                {percentage >= 80 ? 'Optimized for Matching' : 'Missing Key Fields'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
              {missing.length > 0
                ? `Add ${missing.join(', ')} to boost your 5-factor accuracy.`
                : 'Your profile is 100% complete and fully optimized for top recruiter discovery.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('profile')}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.875rem' }}
        >
          {percentage >= 80 ? 'View Digital Resume' : 'Complete Profile'} <ArrowRight size={16} />
        </button>
      </div>

      {/* 2. Contextual Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        <div
          onClick={() => navigate('opportunities')}
          className="card"
          style={{
            padding: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderLeft: '4px solid #38BDF8',
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
            <Compass size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '0.95rem', color: 'var(--primary-text)', display: 'block' }}>
              Explore Roles
            </strong>
            <span style={{ fontSize: '0.775rem', color: 'var(--secondary-text)' }}>Browse 1,000+ listings</span>
          </div>
        </div>

        <div
          onClick={() => navigate('applications')}
          className="card"
          style={{
            padding: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderLeft: '4px solid #34D399',
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
            <FileText size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '0.95rem', color: 'var(--primary-text)', display: 'block' }}>
              My Applications
            </strong>
            <span style={{ fontSize: '0.775rem', color: 'var(--secondary-text)' }}>Track interview stages</span>
          </div>
        </div>

        <div
          onClick={() => navigate('learning')}
          className="card"
          style={{
            padding: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderLeft: '4px solid #C084FC',
          }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C084FC' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <strong style={{ fontSize: '0.95rem', color: 'var(--primary-text)', display: 'block' }}>
              Skills & Learning
            </strong>
            <span style={{ fontSize: '0.775rem', color: 'var(--secondary-text)' }}>Bridge missing gaps</span>
          </div>
        </div>
      </div>

      {/* 3. Section: Best Matches (4 cards + View All) */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#C084FC" />
              <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>Best Matches for You</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
              Top weighted compatibility across skills, education, and location.
            </p>
          </div>
          <button
            onClick={() => navigate('opportunities')}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', color: '#C084FC', fontWeight: 600 }}
          >
            View All Best Matches →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '18px' }}>
          {recommendations.bestMatches.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
          {recommendations.bestMatches.length === 0 && !isLoading && (
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>No opportunities found.</p>
          )}
        </div>
      </div>

      {/* 4. Section: Based on Your Skills */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#34D399" />
              <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>Based on Your Verified Skills</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
              Roles matching your specific technical stack (React, Node.js, REST APIs).
            </p>
          </div>
          <button
            onClick={() => navigate('opportunities')}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 600 }}
          >
            Explore Skills Catalog →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '18px' }}>
          {recommendations.basedOnSkills.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
        </div>
      </div>

      {/* 5. Section: Based on Your Interests */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={20} color="#F472B6" />
              <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF' }}>Based on Your Career Interests</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
              Selected based on your chosen topics and industry domains.
            </p>
          </div>
          <button
            onClick={() => navigate('opportunities')}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', color: '#F472B6', fontWeight: 600 }}
          >
            See All Opportunities →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '18px' }}>
          {recommendations.basedOnInterests.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
        </div>
      </div>
    </div>
  );
}
