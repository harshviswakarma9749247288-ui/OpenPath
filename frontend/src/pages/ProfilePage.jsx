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
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import MatchScoreBadge from '../components/MatchScoreBadge';

export default function ProfilePage() {
  const { user, profileCompletion, updateProfile } = useAuthStore();
  const { showToast, navigate } = useUIStore();

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
    const resumeText = `=====================================================
OPENPATH VERIFIED DIGITAL RESUME
=====================================================
Name: ${user?.name || 'Candidate'}
Email: ${user?.email || 'N/A'}
Location: ${user?.location?.city || 'Not specified'}, ${user?.location?.country || 'India'}
Preferred Mode: ${user?.location?.remotePreference || 'Not specified'}

EDUCATION:
Degree: ${user?.education?.degree || 'Not specified'}
Institution: ${user?.education?.institution || 'Not specified'} ${user?.education?.fieldOfStudy ? `(${user.education.fieldOfStudy})` : ''}
Graduation Year: ${user?.education?.endYear || 'N/A'}

TECHNICAL SKILLS:
${(user?.skills && user.skills.length > 0) ? user.skills.map((s) => s.name || s).join(', ') : 'None listed'}

EXPERIENCE & PROJECTS:
Role: ${user?.experience?.role || 'None listed'}
Org: ${user?.experience?.organization || 'N/A'} ${user?.experience?.duration ? `(${user.experience.duration})` : ''}
Details: ${user?.experience?.description || 'N/A'}

BIO SUMMARY:
${user?.bio || 'No bio provided yet.'}
=====================================================`;

    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(user?.name || 'OpenPath_Candidate').replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    showToast('Digital Resume downloaded!', 'success');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* 1. Profile Top Card */}
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
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
            }
            alt={user?.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(168, 85, 247, 0.5)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                {user?.name}
              </h1>
              <span className="badge badge-internship" style={{ textTransform: 'uppercase' }}>
                {user?.role} Profile
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
              {user?.email} • {user?.location?.city || 'Location not specified'} ({user?.location?.remotePreference || 'Remote'})
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-text)', marginTop: '8px', maxWidth: '540px' }}>
              {user?.bio || 'No bio provided yet. Click "Edit Profile" to introduce yourself.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)' }}>
                PROFILE COMPLETION
              </span>
            </div>
            <MatchScoreBadge score={percentage} size={50} showLabel={false} />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.825rem' }}
            >
              <Edit3 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button
              onClick={handleDownloadDigitalResume}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.825rem' }}
            >
              <Download size={14} /> Download Digital Resume
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        /* Edit Profile Form */
        <form onSubmit={handleSaveProfile} className="card card-featured" style={{ padding: '32px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--primary-text)' }}>Edit Profile Information</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

          <h4 style={{ fontSize: '1rem', color: '#38BDF8', marginTop: '16px', marginBottom: '12px' }}>Education</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
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

          <h4 style={{ fontSize: '1rem', color: '#F472B6', marginTop: '16px', marginBottom: '12px' }}>Experience & Projects</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      ) : null}

      {/* 2. Structured Sections (Education, Skills, Experience) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Academic Education */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <GraduationCap size={20} color="#38BDF8" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-text)' }}>Education</h3>
          </div>

          {user?.education?.degree || user?.education?.institution ? (
            <div style={{ padding: '16px', backgroundColor: 'var(--box-subtle)', borderRadius: '10px', border: '1px solid var(--box-subtle-border)' }}>
              <strong style={{ fontSize: '1rem', color: 'var(--primary-text)' }}>
                {user?.education?.degree || 'Degree not specified'}
              </strong>
              {user?.education?.institution && (
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                  {user.education.institution}
                </p>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                {user?.education?.fieldOfStudy && <span>Major: {user.education.fieldOfStudy}</span>}
                {user?.education?.fieldOfStudy && user?.education?.endYear && <span>•</span>}
                {user?.education?.endYear && <span>Class of {user.education.endYear}</span>}
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: 'var(--box-subtle)', borderRadius: '10px', border: '1px dashed var(--box-subtle-border)', textAlign: 'center', color: 'var(--secondary-text)', fontSize: '0.85rem' }}>
              No education details added yet. Click &quot;Edit Profile&quot; to add your academic background.
            </div>
          )}
        </div>

        {/* Experience & Projects */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Briefcase size={20} color="#F472B6" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-text)' }}>Experience & Projects</h3>
          </div>

          {user?.experience?.role || user?.experience?.organization ? (
            <div style={{ padding: '16px', backgroundColor: 'var(--box-subtle)', borderRadius: '10px', border: '1px solid var(--box-subtle-border)' }}>
              <strong style={{ fontSize: '1rem', color: 'var(--primary-text)' }}>
                {user?.experience?.role || 'Role not specified'}
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                {user?.experience?.organization || 'Project / Org'} {user?.experience?.duration ? `(${user.experience.duration})` : ''}
              </p>
              {user?.experience?.description && (
                <p style={{ fontSize: '0.8rem', color: 'var(--primary-text)', marginTop: '8px' }}>
                  {user.experience.description}
                </p>
              )}
            </div>
          ) : (
            <div style={{ padding: '20px', backgroundColor: 'var(--box-subtle)', borderRadius: '10px', border: '1px dashed var(--box-subtle-border)', textAlign: 'center', color: 'var(--secondary-text)', fontSize: '0.85rem' }}>
              No experience or projects added yet. Click &quot;Edit Profile&quot; to record your contributions.
            </div>
          )}
        </div>

        {/* Verified Skills */}
        <div className="card" style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#C084FC" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-text)' }}>Verified Candidate Skills</h3>
            </div>
            <button onClick={() => navigate('profile-setup')} className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              Manage Skills
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(user?.skills && user.skills.length > 0) ? (
              user.skills.map((skill, idx) => (
                <span key={skill._id || idx} className="skill-chip skill-chip-matched">
                  {skill.name || skill}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
                No verified skills added yet. Click &quot;Manage Skills&quot; to add your technical abilities.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
