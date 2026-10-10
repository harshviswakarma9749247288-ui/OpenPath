import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  MapPin,
  Download,
  FileText,
  Edit3,
  Check,
  Plus,
  Trash2,
  Share2,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import MatchScoreBadge from '../components/MatchScoreBadge';
import BackButton from '../components/BackButton';
import { generatePdfResume } from '../utils/pdfResumeGenerator';

export default function ProfilePage() {
  const { user, profileCompletion, updateProfile } = useAuthStore();
  const { showToast, navigate } = useUIStore();
  const isAdmin = user?.role === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [degree, setDegree] = useState(user?.education?.degree || '');
  const [institution, setInstitution] = useState(user?.education?.institution || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(user?.education?.fieldOfStudy || '');
  const [endYear, setEndYear] = useState(user?.education?.endYear || '');
  const [city, setCity] = useState(user?.location?.city || '');
  const [remotePref, setRemotePref] = useState(user?.location?.remotePreference || 'Remote');
  const [expRole, setExpRole] = useState(user?.experience?.role || '');
  const [expOrg, setExpOrg] = useState(user?.experience?.organization || '');
  const [expDuration, setExpDuration] = useState(user?.experience?.duration || '');
  const [expDesc, setExpDesc] = useState(user?.experience?.description || '');

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setDegree(user.education?.degree || '');
      setInstitution(user.education?.institution || '');
      setFieldOfStudy(user.education?.fieldOfStudy || '');
      setEndYear(user.education?.endYear || '');
      setCity(user.location?.city || '');
      setRemotePref(user.location?.remotePreference || 'Remote');
      setExpRole(user.experience?.role || '');
      setExpOrg(user.experience?.organization || '');
      setExpDuration(user.experience?.duration || '');
      setExpDesc(user.experience?.description || '');
    }
  }, [user]);

  const percentage = profileCompletion?.percentage ?? 0;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile({
      name,
      bio,
      education: {
        degree,
        institution,
        fieldOfStudy,
        endYear,
      },
      experience: {
        role: expRole,
        organization: expOrg,
        duration: expDuration,
        description: expDesc,
      },
      location: {
        city,
        state: user?.location?.state || '',
        country: user?.location?.country || 'India',
        remotePreference: remotePref,
      },
    });

    if (res.success) {
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    }
  };

  const handleDownloadDigitalResume = () => {
    try {
      generatePdfResume(user, profileCompletion);
      showToast('Verified Digital Resume (PDF) downloaded successfully!', 'success');
    } catch (err) {
      console.error('Failed to generate PDF resume:', err);
      showToast('Error generating PDF resume', 'error');
    }
  };

  return (
    <div className="profile-page-wrapper">
      <BackButton
        label={isAdmin ? "Back to Admin Command Center" : "Back to Dashboard"}
        fallbackPage={isAdmin ? "admin" : "dashboard"}
        className="profile-back-btn"
      />

      {/* 1. Profile Top Card */}
      <div className="card card-featured profile-top-card">
        <div className="profile-header-user">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
            }
            alt={user?.name}
            className={`profile-user-avatar ${isAdmin ? 'admin-mode' : ''}`}
          />

          <div>
            <div className="profile-name-row">
              <h1 className="profile-name-text">
                {user?.name}
              </h1>
              <span
                className={`badge badge-internship profile-role-badge ${isAdmin ? 'admin-badge' : ''}`}
              >
                {user?.role} Profile
              </span>
            </div>
            <p className="profile-email-meta">
              {user?.email} • {user?.location?.city || 'Location not specified'} ({user?.location?.remotePreference || 'Remote'})
            </p>
            <p className="profile-bio-text">
              {user?.bio || (isAdmin ? 'Platform Administrator with complete system access.' : 'No bio provided yet. Click "Edit Profile" to introduce yourself.')}
            </p>
          </div>
        </div>

        <div className="profile-header-actions">
          {isAdmin ? (
            <div className="profile-name-row">
              <span className="profile-admin-shield-badge">
                <ShieldCheck size={14} /> PLATFORM ADMINISTRATOR
              </span>
            </div>
          ) : (
            <div className="profile-completion-row">
              <div className="text-right">
                <span className="profile-completion-label">
                  PROFILE COMPLETION
                </span>
              </div>
              <MatchScoreBadge score={percentage} size={50} showLabel={false} />
            </div>
          )}

          <div className="profile-btn-group">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary profile-btn-sm"
            >
              <Edit3 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            {isAdmin ? (
              <button
                onClick={() => navigate('admin')}
                className="btn-primary profile-btn-admin-action"
              >
                <ShieldCheck size={14} /> Admin Command Center
              </button>
            ) : (
              <button
                onClick={handleDownloadDigitalResume}
                className="btn-primary profile-btn-resume-action"
              >
                <Download size={14} /> Download Resume (PDF)
              </button>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        /* Edit Profile Form */
        <form onSubmit={handleSaveProfile} className="card card-featured profile-edit-form">
          <h3 className="profile-edit-title">Edit Profile Information</h3>

          <div className="form-grid-2col">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bengaluru, Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label className="form-label">Work Mode Preference</label>
              <select
                className="form-select"
                value={remotePref}
                onChange={(e) => setRemotePref(e.target.value)}
              >
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Any">Flexible (Any)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Bio Summary</label>
              <input
                type="text"
                className="form-input"
                placeholder="Brief professional headline or bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          {!isAdmin && (
            <>
              <h4 className="profile-section-heading-cyan">Education</h4>
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Degree</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. B.Tech, BCA, B.Sc"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Institution</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="College or University Name"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2-1">
                <div className="form-group">
                  <label className="form-label">Field of Study / Major</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Computer Science"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2026"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                  />
                </div>
              </div>

              <h4 className="profile-section-heading-pink">Experience & Projects</h4>
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">Role / Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Frontend Developer, Intern"
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization / Project</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Open Source Project, Company"
                    value={expOrg}
                    onChange={(e) => setExpOrg(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-1-2">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 6 Months, Jan - Jun 2024"
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description of Contributions</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Key accomplishments or technologies used"
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="profile-form-footer">
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      ) : null}

      {/* 2. Structured Sections (Admin Governance Grid vs Student Education & Skills) */}
      {isAdmin ? (
        <div className="profile-cards-grid">
          {/* Admin Platform Authority */}
          <div className="card profile-card-admin-governance">
            <div className="profile-card-title-row">
              <ShieldCheck size={20} color="#EF4444" />
              <h3 className="profile-card-title-text">Platform Governance Rights</h3>
            </div>
            <div className="profile-rights-list">
              <div className="profile-rights-item">
                <Check size={16} color="#10B981" />
                <span>Manage, inspect, and suspend student and employer accounts</span>
              </div>
              <div className="profile-rights-item">
                <Check size={16} color="#10B981" />
                <span>Moderate, verify, and close internship & job listings</span>
              </div>
              <div className="profile-rights-item">
                <Check size={16} color="#10B981" />
                <span>Govern standardized skill ontology and curriculum roadmaps</span>
              </div>
              <div className="profile-rights-item">
                <Check size={16} color="#10B981" />
                <span>Real-time platform telemetry, database health, and activity logs</span>
              </div>
            </div>
            <button
              onClick={() => navigate('admin')}
              className="btn-primary profile-btn-admin-full"
            >
              Open Admin Command Center
            </button>
          </div>

          {/* Admin Account Security & Controls */}
          <div className="card profile-card-admin-security">
            <div className="profile-card-title-row">
              <Server size={20} color="#38BDF8" />
              <h3 className="profile-card-title-text">Security & Session Controls</h3>
            </div>
            <div className="profile-controls-list">
              <div className="profile-control-row">
                <span>Authentication Modes:</span>
                <strong className="var-primary-text">Password & Email OTP</strong>
              </div>
              <div className="profile-control-row">
                <span>Permission Scope:</span>
                <strong className="profile-control-val-admin">Full Platform Administrator</strong>
              </div>
              <div className="profile-control-row">
                <span>Account Status:</span>
                <strong className="profile-control-val-green">Active & Verified</strong>
              </div>
              <div className="profile-control-row">
                <span>Listing Moderation:</span>
                <strong className="profile-control-val-purple">Enforced & Enabled</strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-cards-grid">
          {/* Academic Education */}
          <div className="card profile-card-standard">
            <div className="profile-card-title-row">
              <GraduationCap size={20} color="#38BDF8" />
              <h3 className="profile-card-title-text">Education</h3>
            </div>

            {user?.education?.degree || user?.education?.institution ? (
              <div className="profile-item-box">
                <strong className="profile-item-title">
                  {user?.education?.degree || 'Degree not specified'}
                </strong>
                {user?.education?.institution && (
                  <p className="profile-item-subtitle">
                    {user.education.institution}
                  </p>
                )}
                <div className="profile-item-meta">
                  {user?.education?.fieldOfStudy && <span>Major: {user.education.fieldOfStudy}</span>}
                  {user?.education?.fieldOfStudy && user?.education?.endYear && <span>•</span>}
                  {user?.education?.endYear && <span>Class of {user.education.endYear}</span>}
                </div>
              </div>
            ) : (
              <div className="profile-item-empty">
                No education details added yet. Click &quot;Edit Profile&quot; to add your academic background.
              </div>
            )}
          </div>

          {/* Experience & Projects */}
          <div className="card profile-card-standard">
            <div className="profile-card-title-row">
              <Briefcase size={20} color="#F472B6" />
              <h3 className="profile-card-title-text">Experience & Projects</h3>
            </div>

            {user?.experience?.role || user?.experience?.organization ? (
              <div className="profile-item-box">
                <strong className="profile-item-title">
                  {user?.experience?.role || 'Role not specified'}
                </strong>
                <p className="profile-item-subtitle">
                  {user?.experience?.organization || 'Project / Org'} {user?.experience?.duration ? `(${user.experience.duration})` : ''}
                </p>
                {user?.experience?.description && (
                  <p className="profile-bio-text">
                    {user.experience.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="profile-item-empty">
                No experience or projects added yet. Click &quot;Edit Profile&quot; to record your contributions.
              </div>
            )}
          </div>

          {/* Verified Skills */}
          <div className="card profile-card-full-span">
            <div className="profile-skills-header-row">
              <div className="profile-card-title-row">
                <Sparkles size={20} color="#C084FC" />
                <h3 className="profile-card-title-text">Verified Candidate Skills</h3>
              </div>
              <button onClick={() => navigate('profile-setup')} className="btn-outline profile-skills-btn">
                Manage Skills
              </button>
            </div>

            <div className="profile-skills-wrap">
              {(user?.skills && user.skills.length > 0) ? (
                user.skills.map((skill, idx) => (
                  <span key={skill._id || idx} className="skill-chip skill-chip-matched">
                    {skill.name || skill}
                  </span>
                ))
              ) : (
                <span className="profile-empty-skills-msg">
                  No verified skills added yet. Click &quot;Manage Skills&quot; to add your technical abilities.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
