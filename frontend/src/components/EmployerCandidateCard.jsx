import React, { useState } from 'react';
import { Mail, GraduationCap, Briefcase, MapPin, FileText, X, Download } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { generatePdfResume } from '../utils/pdfResumeGenerator';

export default function EmployerCandidateCard({ candidate, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(candidate.status);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const statuses = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  const handleUpdate = async (newStatus) => {
    setIsUpdating(true);
    setSelectedStatus(newStatus);
    await onStatusChange(candidate.applicationId, newStatus);
    setIsUpdating(false);
  };

  const user = candidate.user || {};

  return (
    <div className="card candidate-card-container">
      {/* Top row: Avatar, Info, Match Score & Current Status */}
      <div className="candidate-top-row">
        <div className="candidate-info-group">
          <img
            src={
              user.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
            }
            alt={user.name}
            className="candidate-avatar"
          />
          <div>
            <div className="candidate-card-title-row">
              <h3 className="candidate-card-title">
                {user.name || 'Candidate'}
              </h3>
              <ApplicationStatusBadge status={selectedStatus} />
            </div>
            <p className="candidate-card-sub">
              <Mail size={14} /> {user.email || 'No email provided'}
              {user.location?.city && (
                <>
                  <span>•</span>
                  <MapPin size={14} /> {user.location.city}{user.location.state ? `, ${user.location.state}` : ''}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className="candidate-score-wrap">
          <div className="candidate-score-label">
            <span>COMPUTED MATCH</span>
          </div>
          <MatchScoreBadge score={candidate.matchScore ?? 0} size={50} showLabel={false} />
        </div>
      </div>

      {/* Candidate Background: Education & Experience */}
      <div className="candidate-bg-box">
        <div className="candidate-bg-item">
          <GraduationCap size={16} color="#7C3AED" className="candidate-bg-icon" />
          <div>
            <strong className="candidate-bg-title">
              {user.education?.degree || 'Education not specified'}
            </strong>
            <p className="candidate-bg-desc">
              {user.education?.institution || 'Self-directed learning'}{user.education?.endYear ? ` • Class of ${user.education.endYear}` : ''}
            </p>
          </div>
        </div>

        <div className="candidate-bg-item">
          <Briefcase size={16} color="#EC4899" className="candidate-bg-icon" />
          <div>
            <strong className="candidate-bg-title">
              {user.experience?.role || 'Projects / Fresher'}
            </strong>
            <p className="candidate-bg-desc">
              {user.experience?.organization || 'Portfolio & Coursework'}
            </p>
          </div>
        </div>
      </div>

      {/* Matched vs Missing Skills */}
      <div className="candidate-skills-wrap">
        <div className="candidate-skills-row">
          <span className="candidate-skills-label-matched">
            Matched:
          </span>
          {(candidate.matchedSkills || []).map((s, idx) => (
            <span key={idx} className="skill-chip skill-chip-matched">
              {s.name || s}
            </span>
          ))}
          {(candidate.matchedSkills || []).length === 0 && (
            <span className="candidate-bg-desc">None</span>
          )}
        </div>

        {(candidate.missingSkills || []).length > 0 && (
          <div className="candidate-skills-row">
            <span className="candidate-skills-label-missing">
              Missing:
            </span>
            {candidate.missingSkills.map((s, idx) => (
              <span key={idx} className="skill-chip skill-chip-missing">
                {s.name || s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar: Resume + Status Change Pipeline */}
      <div className="candidate-bottom-bar">
        <button
          onClick={() => setShowResumeModal(true)}
          className="btn-secondary candidate-btn-resume"
        >
          <FileText size={14} /> View Digital Resume
        </button>

        {/* Status Pipeline Buttons */}
        <div className="candidate-pipeline-buttons">
          <span className="candidate-stage-label">
            Move Stage:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              disabled={isUpdating || selectedStatus === st}
              onClick={() => handleUpdate(st)}
              className={`candidate-stage-btn ${selectedStatus === st ? 'active' : ''}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Candidate Digital Resume Modal */}
      {showResumeModal && (
        <div className="candidate-modal-overlay">
          <div className="card card-featured animate-fade-in candidate-modal-card">
            <div className="candidate-modal-header">
              <h3 className="candidate-modal-title">
                <FileText size={20} color="#C084FC" /> Digital Resume Profile
              </h3>
              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="btn-ghost"
              >
                <X size={18} />
              </button>
            </div>

            <div className="candidate-modal-user-row">
              <img
                src={
                  user.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
                }
                alt={user.name}
                className="candidate-modal-avatar"
              />
              <div>
                <h4 className="candidate-modal-username">{user.name || 'Candidate'}</h4>
                <p className="candidate-card-sub">{user.email || 'N/A'}</p>
                <p className="candidate-bg-desc">
                  {user.location?.city ? `${user.location.city}${user.location.country ? `, ${user.location.country}` : ''}` : 'Location not specified'} • {user.location?.remotePreference || 'Remote'}
                </p>
              </div>
            </div>

            {user.bio && (
              <div className="candidate-modal-section">
                <span className="candidate-modal-section-title">Professional Bio</span>
                <p className="candidate-modal-bio">{user.bio}</p>
              </div>
            )}

            <div className="candidate-modal-section">
              <span className="candidate-modal-section-title">Academic Education</span>
              <div className="candidate-modal-box">
                <strong className="candidate-bg-title">
                  {user.education?.degree || 'Degree not specified'}
                </strong>
                <p className="candidate-bg-desc">
                  {user.education?.institution || 'Institution not specified'} {user.education?.fieldOfStudy ? `• ${user.education.fieldOfStudy}` : ''}
                </p>
                {user.education?.endYear && (
                  <p className="candidate-bg-desc">
                    Graduation Year: {user.education.endYear}
                  </p>
                )}
              </div>
            </div>

            <div className="candidate-modal-section">
              <span className="candidate-modal-section-title">Experience & Projects</span>
              <div className="candidate-modal-box">
                <strong className="candidate-bg-title">
                  {user.experience?.role || 'No specific role listed'}
                </strong>
                <p className="candidate-bg-desc">
                  {user.experience?.organization || 'Independent Projects'} {user.experience?.duration ? `(${user.experience.duration})` : ''}
                </p>
                {user.experience?.description && (
                  <p className="candidate-modal-exp-desc">
                    {user.experience.description}
                  </p>
                )}
              </div>
            </div>

            {candidate.notes && (
              <div className="candidate-modal-section">
                <span className="candidate-modal-section-title">Cover Note From Applicant</span>
                <p className="candidate-modal-cover-note">
                  &ldquo;{candidate.notes}&rdquo;
                </p>
              </div>
            )}

            <div className="candidate-modal-section">
              <span className="candidate-modal-section-title">Candidate Skills</span>
              <div className="candidate-modal-skills-list">
                {(user.skills || []).map((s, idx) => (
                  <span key={idx} className="skill-chip skill-chip-matched">
                    {s.name || s}
                  </span>
                ))}
                {(!user.skills || user.skills.length === 0) && (
                  <span className="candidate-bg-desc">No skills listed</span>
                )}
              </div>
            </div>

            <div className="candidate-modal-actions">
              <button
                type="button"
                onClick={() => generatePdfResume(user, { percentage: candidate.matchScore })}
                className="btn-secondary"
              >
                <Download size={14} /> Download Candidate PDF
              </button>
              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="btn-primary"
              >
                Close Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
