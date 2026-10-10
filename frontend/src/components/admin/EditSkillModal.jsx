import React, { useEffect, useState } from 'react';
import { Layers, PlusCircle, Edit3, X, Check } from 'lucide-react';

export default function EditSkillModal({ isOpen, onClose, skill, onSave, isLoading }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [description, setDescription] = useState('');

  const isEditing = !!skill?._id;

  useEffect(() => {
    if (skill) {
      setName(skill.name || '');
      setCategory(skill.category || 'Frontend');
      setDescription(skill.description || '');
    } else {
      setName('');
      setCategory('Frontend');
      setDescription('');
    }
  }, [skill]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    'Frontend',
    'Backend',
    'Programming',
    'Database',
    'DevOps & Tools',
    'Design',
    'Data & AI',
    'Cloud',
    'Computer Science',
    'General',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;
    onSave({
      _id: skill?._id,
      name: name.trim(),
      category,
      description: description.trim(),
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(3, 7, 18, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card anim-float-subtle admin-action-center-modal"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '28px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '22px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 30px rgba(16, 185, 129, 0.18)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            color: 'var(--secondary-text)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          title="Cancel"
        >
          <X size={18} />
        </button>

        {/* Glowing Badge Icon */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.08) 70%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 0 24px rgba(16, 185, 129, 0.3)',
            color: '#34D399',
          }}
        >
          {isEditing ? <Edit3 size={28} /> : <PlusCircle size={28} />}
        </div>

        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--primary-text)',
            textAlign: 'center',
            marginBottom: '6px',
            letterSpacing: '-0.3px',
          }}
        >
          {isEditing ? 'Edit Canonical Skill' : 'Add Canonical Skill'}
        </h3>

        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--secondary-text)',
            textAlign: 'center',
            lineHeight: '1.5',
            marginBottom: '20px',
          }}
        >
          {isEditing
            ? 'Update skill properties in the platform competency graph.'
            : 'Register a recognized technical competency into the matching ontology.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              Skill Name *
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Next.js, Kubernetes, Tailwind CSS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ fontSize: '0.88rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              Category *
            </label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ fontSize: '0.88rem' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              Competency Summary / Description
            </label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Brief definition or industry usage of this competency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          <div className="modal-action-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary"
              style={{
                padding: '11px 18px',
                fontSize: '0.9rem',
                fontWeight: 600,
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="btn-primary"
              style={{
                padding: '11px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: '12px',
                border: 'none',
                cursor: !name.trim() || isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Check size={16} /> {isEditing ? 'Save Changes' : 'Add to Taxonomy'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
