import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Clock, BookOpen, Video, FileText } from 'lucide-react';

export default function LearningCard({ resource, onToggleComplete, isCompleted = false }) {
  const [completed, setCompleted] = useState(isCompleted);

  const handleToggle = () => {
    const next = !completed;
    setCompleted(next);
    if (onToggleComplete) onToggleComplete(resource._id, next);
  };

  const getIcon = () => {
    switch (resource.type) {
      case 'Video':
        return <Video size={16} color="#C084FC" />;
      case 'Article':
      case 'Documentation':
        return <FileText size={16} color="#38BDF8" />;
      default:
        return <BookOpen size={16} color="#F472B6" />;
    }
  };

  const difficultyColor =
    resource.difficulty === 'Beginner'
      ? { text: '#34D399', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.35)' }
      : resource.difficulty === 'Intermediate'
      ? { text: '#FBBF24', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)' }
      : { text: '#C084FC', bg: 'rgba(192, 38, 211, 0.15)', border: 'rgba(192, 38, 211, 0.35)' };

  return (
    <div
      className="card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-lg)',
        border: completed ? '1.5px solid #10B981' : '1px solid var(--border-color)',
        backgroundColor: completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.65)',
        boxShadow: completed ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'var(--shadow-subtle)',
        transition: 'var(--transition-normal)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getIcon()}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
              {resource.provider || 'OpenPath Academy'}
            </span>
          </div>

          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '9999px',
              color: difficultyColor.text,
              backgroundColor: difficultyColor.bg,
              border: `1px solid ${difficultyColor.border}`,
            }}
          >
            {resource.difficulty}
          </span>
        </div>

        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
          {resource.title}
        </h4>

        <p
          style={{
            fontSize: '0.825rem',
            color: 'var(--secondary-text)',
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {resource.description}
        </p>

        {resource.skill && (
          <span className="skill-chip" style={{ fontSize: '0.75rem', padding: '2px 10px', marginBottom: '14px' }}>
            Target: {resource.skill.name || resource.skill}
          </span>
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} /> {resource.estimatedDuration || '2 hours'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleToggle}
            style={{
              fontSize: '0.775rem',
              fontWeight: 600,
              color: completed ? '#34D399' : 'var(--secondary-text)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle2 size={16} color={completed ? '#34D399' : '#64748B'} />
            {completed ? 'Completed' : 'Mark Done'}
          </button>

          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
            style={{ padding: '4px 12px', fontSize: '0.775rem' }}
          >
            Start <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
