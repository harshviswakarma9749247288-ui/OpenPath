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
    <div onClick={onClose} className="admin-modal-overlay">
      <div onClick={(e) => e.stopPropagation()} className="card anim-float-subtle admin-action-center-modal modal-width-480">
        {/* Close Button */}
        <button onClick={onClose} className="admin-modal-close-btn" title="Cancel">
          <X size={18} />
        </button>

        {/* Glowing Badge Icon */}
        <div className="admin-modal-icon-badge badge-green">
          {isEditing ? <Edit3 size={28} /> : <PlusCircle size={28} />}
        </div>

        <h3 className="admin-modal-title">
          {isEditing ? 'Edit Canonical Skill' : 'Add Canonical Skill'}
        </h3>

        <p className="admin-modal-subtitle">
          {isEditing
            ? 'Update skill properties in the platform competency graph.'
            : 'Register a recognized technical competency into the matching ontology.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group auth-mb-14">
            <label className="form-label auth-modal-field-label">
              Skill Name *
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Next.js, Kubernetes, Tailwind CSS"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group auth-mb-14">
            <label className="form-label auth-modal-field-label">
              Category *
            </label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group admin-mb-22">
            <label className="form-label auth-modal-field-label">
              Competency Summary / Description
            </label>
            <textarea
              className="form-input admin-textarea-compact"
              rows={3}
              placeholder="Brief definition or industry usage of this competency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-action-buttons">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary admin-modal-btn-cancel"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="btn-primary admin-modal-btn-confirm confirm-success"
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
