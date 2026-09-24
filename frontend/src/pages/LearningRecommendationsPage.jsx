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
import api from '../utils/api';
import LearningCard from '../components/LearningCard';

export default function LearningRecommendationsPage({ skillId, skillName }) {
  const { navigate } = useUIStore();

  const [resources, setResources] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [completedIds, setCompletedIds] = useState(
    JSON.parse(localStorage.getItem('openpath_completed_learning') || '[]')
  );
  const [activeStage, setActiveStage] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const query = skillId ? `?skillId=${skillId}` : '';
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
  }, [skillId]);

  const handleToggleComplete = (id, isDone) => {
    let updated;
    if (isDone) {
      updated = [...completedIds, id];
    } else {
      updated = completedIds.filter((item) => item !== id);
    }
    setCompletedIds(updated);
    localStorage.setItem('openpath_completed_learning', JSON.stringify(updated));
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

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* Header Banner */}
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
              color: '#C084FC',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              padding: '4px 12px',
              borderRadius: '9999px',
              letterSpacing: '0.05em',
            }}
          >
            ACTIONABLE CAREER PATHWAY
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '12px', color: '#FFFFFF' }}>
            {skillName ? `Curated Roadmap for ${skillName}` : 'Personalized Learning Roadmap'}
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--secondary-text)', marginTop: '4px', maxWidth: '560px' }}>
            Follow the 5-stage progression (Skill Gap → Beginner → Practice → Project → Ready) to convert
            missing competencies into hiring strengths.
          </p>
        </div>

        {/* Learning Progress Meter */}
        <div
          style={{
            padding: '24px 28px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)',
            textAlign: 'center',
            minWidth: '180px',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
            CURRICULUM PROGRESS
          </span>
          <h2 style={{ fontSize: '2.4rem', color: '#C084FC', fontWeight: 800, textShadow: '0 0 20px rgba(192, 132, 252, 0.4)' }}>
            {progressPct}%
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 600 }}>
            {completedCount} of {totalCount} Completed
          </span>
        </div>
      </div>

      {/* 5-Step Visual Roadmap Tabs (Desktop Horizontal, Mobile Responsive) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          marginBottom: '28px',
        }}
      >
        {stages.map((stage) => {
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--primary-gradient)' : 'rgba(15, 23, 42, 0.65)',
                color: isActive ? '#FFFFFF' : 'var(--primary-text)',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid var(--border-color)',
                textAlign: 'left',
                boxShadow: isActive ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'var(--shadow-subtle)',
                backdropFilter: 'blur(12px)',
                transition: 'var(--transition-normal)',
              }}
            >
              <strong style={{ fontSize: '0.85rem', display: 'block' }}>{stage.title}</strong>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: isActive ? 'rgba(255, 255, 255, 0.85)' : 'var(--secondary-text)',
                  display: 'block',
                  marginTop: '2px',
                }}
              >
                {stage.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Resource Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
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
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary-text)' }}>
          <p>No resources found for this roadmap stage.</p>
        </div>
      )}
    </div>
  );
}
