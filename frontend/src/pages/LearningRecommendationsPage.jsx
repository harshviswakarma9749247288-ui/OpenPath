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
              color: 'var(--primary-blue)',
              textTransform: 'uppercase',
              backgroundColor: '#EFF6FF',
              padding: '3px 10px',
              borderRadius: '9999px',
            }}
          >
            ACTIONABLE CAREER PATHWAY
          </span>
          <h1 style={{ fontSize: '2rem', marginTop: '10px', color: 'var(--secondary-navy)' }}>
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
            padding: '20px 24px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #DBEAFE',
            textAlign: 'center',
            minWidth: '180px',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
            CURRICULUM PROGRESS
          </span>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-blue)', fontWeight: 800 }}>
            {progressPct}%
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
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
                backgroundColor: isActive ? 'var(--primary-blue)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--primary-text)',
                border: isActive ? '1px solid var(--primary-blue)' : '1px solid var(--border-color)',
                textAlign: 'left',
                boxShadow: isActive ? 'var(--shadow-blue)' : 'var(--shadow-subtle)',
                transition: 'var(--transition-normal)',
              }}
            >
              <strong style={{ fontSize: '0.85rem', display: 'block' }}>{stage.title}</strong>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: isActive ? '#DBEAFE' : 'var(--secondary-text)',
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
