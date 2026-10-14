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
import Tilt3DCard from '../components/Tilt3DCard';
import CyberLoader from '../components/CyberLoader';
import BackButton from '../components/BackButton';

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

  const percentage = profileCompletion?.percentage ?? (user?.skills?.length ? 80 : 40);
  const missing = profileCompletion?.missingFields || [];

  if (isLoading && (!recommendations?.bestMatches || recommendations.bestMatches.length === 0)) {
    return <CyberLoader message="Evaluating Algorithmic Student Recommendations..." />;
  }

  return (
    <div className="dashboard-container">
      <BackButton label="Back to Home" fallbackPage="landing" />

      {/* 1. Profile Completeness Banner */}
      <div className="card card-featured completeness-banner">
        <div className="completeness-left">
          {/* Circular Percentage */}
          <MatchScoreBadge score={percentage} size={64} strokeWidth={5} showLabel={false} />
          <div>
            <div className="candidate-card-title-row">
              <h3 className="candidate-card-title">Profile Completeness</h3>
              <span
                className={`completeness-status-pill ${percentage >= 80 ? 'optimized' : 'incomplete'}`}
              >
                {percentage >= 80 ? 'Optimized for Matching' : 'Missing Key Fields'}
              </span>
            </div>
            <p className="candidate-bg-desc">
              {missing.length > 0
                ? `Add ${missing.join(', ')} to boost your 5-factor accuracy.`
                : 'Your profile is 100% complete and fully optimized for top recruiter discovery.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('profile')}
          className="btn-primary"
        >
          {percentage >= 80 ? 'View Digital Resume' : 'Complete Profile'} <ArrowRight size={16} />
        </button>
      </div>

      {/* 2. Contextual Quick Actions */}
      <div className="quick-actions-grid">
        <Tilt3DCard
          onClick={() => navigate('opportunities')}
          className="card quick-action-card cyan"
          maxTilt={8}
        >
          <div className="quick-action-icon-box cyan">
            <Compass size={22} />
          </div>
          <div>
            <strong className="quick-action-title">
              Explore Roles
            </strong>
            <span className="quick-action-sub">
              Browse algorithmic matches
            </span>
          </div>
        </Tilt3DCard>

        <Tilt3DCard
          onClick={() => navigate('applications')}
          className="card quick-action-card emerald"
          maxTilt={8}
        >
          <div className="quick-action-icon-box emerald">
            <FileText size={22} />
          </div>
          <div>
            <strong className="quick-action-title">
              My Applications
            </strong>
            <span className="quick-action-sub">Track interview stages</span>
          </div>
        </Tilt3DCard>

        <Tilt3DCard
          onClick={() => navigate('learning')}
          className="card quick-action-card purple"
          maxTilt={8}
        >
          <div className="quick-action-icon-box purple">
            <BookOpen size={22} />
          </div>
          <div>
            <strong className="quick-action-title">
              Skills & Learning
            </strong>
            <span className="quick-action-sub">Bridge missing gaps</span>
          </div>
        </Tilt3DCard>
      </div>

      {/* 3. Section: Best Matches (4 cards + View All) */}
      <div className="dashboard-section-wrap">
        <div className="dashboard-section-header">
          <div>
            <div className="candidate-card-title-row">
              <Sparkles size={20} color="#7C3AED" />
              <h2 className="dashboard-section-title">Best Matches for You</h2>
            </div>
            <p className="dashboard-section-subtitle">
              Top weighted compatibility across skills, education, and location.
            </p>
          </div>
          <button
            onClick={() => navigate('opportunities')}
            className="btn-ghost dashboard-section-link purple"
          >
            View All Best Matches →
          </button>
        </div>

        <div className="dashboard-cards-grid">
          {recommendations.bestMatches.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
          {recommendations.bestMatches.length === 0 && !isLoading && (
            <p className="candidate-bg-desc">No opportunities found.</p>
          )}
        </div>
      </div>

      {/* 4. Section: Based on Your Skills */}
      <div className="dashboard-section-wrap">
        <div className="dashboard-section-header">
          <div>
            <div className="candidate-card-title-row">
              <TrendingUp size={20} color="#059669" />
              <h2 className="dashboard-section-title">Based on Your Verified Skills</h2>
            </div>
            <p className="dashboard-section-subtitle">
              {user?.skills?.length
                ? `Roles matching your technical competencies: ${user.skills.map((s) => s.name || s).slice(0, 4).join(', ')}.`
                : 'Roles matching verified competencies. Add more skills to profile to expand recommendations.'}
            </p>
          </div>
          <button
            onClick={() => navigate('opportunities')}
            className="btn-ghost dashboard-section-link emerald"
          >
            Explore Skills Catalog →
          </button>
        </div>

        <div className="dashboard-cards-grid">
          {recommendations.basedOnSkills.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
          {recommendations.basedOnSkills.length === 0 && (
            <div className="card dashboard-empty-state">
              <p>Add technical skills in your Profile to unlock skill-based recommendations.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Section: Based on Your Interests */}
      <div>
        <div className="dashboard-section-header">
          <div>
            <div className="candidate-card-title-row">
              <Briefcase size={20} color="#DB2777" />
              <h2 className="dashboard-section-title">Based on Your Career Interests</h2>
            </div>
            <p className="dashboard-section-subtitle">
              {user?.interests?.length
                ? `Selected for your interest domains: ${user.interests.slice(0, 3).join(', ')}.`
                : 'Selected based on your chosen career domains and industry tags.'}
            </p>
          </div>
          <button
            onClick={() => navigate('opportunities')}
            className="btn-ghost dashboard-section-link pink"
          >
            See All Opportunities →
          </button>
        </div>

        <div className="dashboard-cards-grid">
          {recommendations.basedOnInterests.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
          {recommendations.basedOnInterests.length === 0 && (
            <div className="card dashboard-empty-state">
              <p>Explore opportunities matching diverse career interests and industry pathways.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
