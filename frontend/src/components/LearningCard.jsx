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
        return <Video size={16} color="#8B5CF6" />;
      case 'Article':
      case 'Documentation':
        return <FileText size={16} color="#0891B2" />;
      default:
        return <BookOpen size={16} color="#2563EB" />;
    }
  };

  const difficultyColor =
    resource.difficulty === 'Beginner'
      ? { text: '#047857', bg: '#ECFDF5', border: '#A7F3D0' }
      : resource.difficulty === 'Intermediate'
      ? { text: '#B45309', bg: '#FFFBEB', border: '#FDE68A' }
      : { text: '#6D28D9', bg: '#F5F3FF', border: '#DDD6FE' };

  return (
    <div
      className="card"
      style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-md)',
        border: completed ? '1.5px solid #10B981' : '1px solid var(--border-color)',
        backgroundColor: completed ? '#F0FDF4' : '#FFFFFF',
        transition: 'var(--transition-normal)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#F1F5F9',
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
              fontWeight: 600,
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

        <h4 style={{ fontSize: '0.975rem', fontWeight: 600, color: 'var(--primary-text)', marginBottom: '6px' }}>
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
          <span className="skill-chip" style={{ fontSize: '0.75rem', padding: '2px 8px', marginBottom: '12px' }}>
            Target Skill: {resource.skill.name || resource.skill}
          </span>
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid #F1F5F9',
          paddingTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} /> {resource.estimatedDuration || '2 hours'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleToggle}
            style={{
              fontSize: '0.775rem',
              fontWeight: 500,
              color: completed ? '#047857' : 'var(--secondary-text)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle2 size={16} color={completed ? '#10B981' : '#94A3B8'} />
            {completed ? 'Completed' : 'Mark Done'}
          </button>

          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
            style={{ padding: '4px 10px', fontSize: '0.775rem' }}
          >
            Start Learning <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
