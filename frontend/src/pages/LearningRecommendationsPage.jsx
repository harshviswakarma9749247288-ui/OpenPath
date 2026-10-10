import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Layers,
  Sparkles,
  ExternalLink,
  Clock,
  Compass,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import LearningCard from '../components/LearningCard';
import CyberLoader from '../components/CyberLoader';
import Tilt3DCard from '../components/Tilt3DCard';
import BackButton from '../components/BackButton';

export default function LearningRecommendationsPage({ skillId, skillName }) {
  const { navigate } = useUIStore();
  const { user, isAuthenticated, toggleCompletedLearning } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [resources, setResources] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [completedIds, setCompletedIds] = useState(() => {
    if (Array.isArray(user?.completedLearningResources) && user.completedLearningResources.length > 0) {
      return user.completedLearningResources.map((item) =>
        typeof item === 'object' && item?._id ? item._id.toString() : String(item)
      );
    }
    return JSON.parse(localStorage.getItem('openpath_completed_learning') || '[]');
  });
  const [activeStage, setActiveStage] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Sync completedIds whenever user profile updates from database
  useEffect(() => {
    if (Array.isArray(user?.completedLearningResources)) {
      const dbIds = user.completedLearningResources.map((item) =>
        typeof item === 'object' && item?._id ? item._id.toString() : String(item)
      );
      setCompletedIds(dbIds);
    }
  }, [user?.completedLearningResources]);

  useEffect(() => {
    setIsLoading(true);
    const query = skillName
      ? `?skillName=${encodeURIComponent(skillName)}`
      : (skillId ? `?skillId=${skillId}` : '');
    api
      .get(`/learning/recommendations${query}`)
      .then((res) => {
        setResources(res.data.resources || []);
        setRoadmap(res.data.roadmap || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [skillId, skillName]);

  const handleToggleComplete = async (id, isDone) => {
    let updated;
    if (isDone) {
      updated = [...new Set([...completedIds, id])];
    } else {
      updated = completedIds.filter((item) => item !== id);
    }
    setCompletedIds(updated);
    localStorage.setItem('openpath_completed_learning', JSON.stringify(updated));

    if (isAuthenticated && toggleCompletedLearning) {
      const synced = await toggleCompletedLearning(id);
      if (Array.isArray(synced)) {
        setCompletedIds(synced);
      }
    }
  };

  const totalCount = resources.length;
  const completedCount = resources.filter((r) => completedIds.includes(r._id)).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredResources =
    activeStage === 'all'
      ? resources
      : resources.filter(
          (r) =>
            r.roadmapStage?.toLowerCase() === activeStage.toLowerCase() ||
            r.difficulty?.toLowerCase() === activeStage.toLowerCase()
        );

  const stages = [
    { id: 'all', title: 'Full Roadmap', desc: 'All curated learning modules' },
    { id: 'beginner', title: '1. Beginner Foundations', desc: 'Core syntax and concepts' },
    { id: 'practice', title: '2. Practice & Exercises', desc: 'Hands-on coding challenges' },
    { id: 'project', title: '3. Real-world Projects', desc: 'Portfolio implementations' },
    { id: 'ready', title: '4. Job Ready', desc: 'Interview prep & production patterns' },
  ];

  if (isLoading) {
    return <CyberLoader message="Compiling Curated 5-Stage Learning Roadmap..." />;
  }

  return (
    <div className="dashboard-container">
      <BackButton label={isAdmin ? "Back to Command Center" : "Back to Dashboard"} fallbackPage={isAdmin ? "admin" : "dashboard"} />

      {/* Header Banner */}
      <div className="card card-featured dashboard-header-banner">
        <div>
          <span className="header-category-pill">
            {isAdmin ? 'ADMIN CURRICULUM INSPECTION' : 'ACTIONABLE CAREER PATHWAY'}
          </span>
          <h1 className="header-title-main">
            {skillName ? `Curated Roadmap for ${skillName}` : 'Personalized Learning Roadmap'}
          </h1>
          <p className="header-sub-text">
            {isAdmin
              ? 'Administrator governance mode: Review curated learning roadmaps and canonical skill competency modules.'
              : 'Follow the 5-stage progression (Skill Gap → Beginner → Practice → Project → Ready) to convert missing competencies into hiring strengths.'}
          </p>
        </div>

        {/* Learning Progress Meter with 3D Tilt */}
        <Tilt3DCard className="readiness-meter-card">
          {isAdmin ? (
            <>
              <span className="kpi-label">
                CURRICULUM NODES
              </span>
              <h2 className="readiness-percentage-value">
                {totalCount}
              </h2>
              <span className="kpi-badge-cyan">
                Admin Inspection View
              </span>
            </>
          ) : (
            <>
              <span className="kpi-label">
                CURRICULUM PROGRESS
              </span>
              <h2 className="readiness-percentage-value">
                {progressPct}%
              </h2>
              <span className="readiness-matched-label">
                {completedCount} of {totalCount} Completed
              </span>
            </>
          )}
        </Tilt3DCard>
      </div>

      {/* 5-Step Visual Roadmap Tabs (Desktop Horizontal, Mobile Responsive) */}
      <div className="roadmap-tabs-grid">
        {stages.map((stage) => {
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`roadmap-stage-btn ${isActive ? 'active' : 'inactive'}`}
            >
              <strong className="roadmap-tab-title">{stage.title}</strong>
              <span className={`roadmap-tab-desc ${isActive ? 'active' : 'inactive'}`}>
                {stage.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Resource Cards Grid */}
      <div className="learning-resources-grid">
        {filteredResources.map((res) => (
          <LearningCard
            key={res._id}
            resource={res}
            isCompleted={completedIds.includes(res._id)}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>

      {filteredResources.length === 0 && !isLoading && (
        <div className="card dashboard-empty-state">
          <p>No resources found for this roadmap stage.</p>
        </div>
      )}
    </div>
  );
}
