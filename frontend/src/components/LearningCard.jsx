import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, Clock, BookOpen, Video, FileText } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function LearningCard({ resource, onToggleComplete, isCompleted = false }) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
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

  const diffClass = (resource.difficulty || 'beginner').toLowerCase();

  return (
    <div
      className={`card learning-card-container ${completed ? 'completed' : ''}`}
    >
      <div>
        <div className="candidate-top-row mb-8">
          <div className="candidate-card-title-row">
            <div className="learning-icon-box">
              {getIcon()}
            </div>
            <span className="candidate-bg-desc">
              {resource.provider || 'OpenPath Academy'}
            </span>
          </div>

          <span className={`learning-difficulty-pill ${diffClass}`}>
            {resource.difficulty}
          </span>
        </div>

        <h4 className="candidate-card-title mb-4">
          {resource.title}
        </h4>

        <p className="learning-card-desc">
          {resource.description}
        </p>

        {resource.skill && (
          <span className="skill-chip mb-14">
            Target: {resource.skill.name || resource.skill}
          </span>
        )}
      </div>

      <div className="learning-card-footer">
        <span className="learning-duration-label">
          <Clock size={12} /> {resource.estimatedDuration || '2 hours'}
        </span>

        <div className="candidate-card-title-row">
          {!isAdmin && (
            <button
              onClick={handleToggle}
              className={`learning-toggle-btn ${completed ? 'done' : 'undone'}`}
            >
              <CheckCircle2 size={16} color={completed ? '#34D399' : '#64748B'} />
              {completed ? 'Completed' : 'Mark Done'}
            </button>
          )}

          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Start <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
