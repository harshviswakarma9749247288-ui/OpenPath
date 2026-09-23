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

  const percentage = profileCompletion?.percentage || 80;

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
      location: {
        city,
        state: 'Karnataka',
        country: 'India',
        remotePreference: remotePref,
      },
    });

    if (res.success) {
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    }
  };

  const handleDownloadDigitalResume = () => {
    // Generate clean text-based / printable resume summary
    const resumeText = `=====================================================
OPENPATH VERIFIED DIGITAL RESUME
=====================================================
Name: ${user?.name}
Email: ${user?.email}
Location: ${user?.location?.city || 'Bengaluru'}, ${user?.location?.country || 'India'}
Preferred Mode: ${user?.location?.remotePreference || 'Remote'}

EDUCATION:
Degree: ${user?.education?.degree || 'Bachelor of Technology'}
Institution: ${user?.education?.institution || 'IIIT'} (${user?.education?.fieldOfStudy})
Graduation Year: ${user?.education?.endYear || '2026'} | Grade: ${user?.education?.grade || '8.8 CGPA'}

TECHNICAL SKILLS:
${(user?.skills || []).map((s) => s.name || s).join(', ')}

EXPERIENCE & PROJECTS:
Role: ${user?.experience?.role || 'Frontend Contributor'}
Org: ${user?.experience?.organization || 'Campus Open Source Guild'}
Details: ${user?.experience?.description || 'Built interactive web applications'}

BIO SUMMARY:
${user?.bio || 'Passionate software developer.'}
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
              border: '3px solid #FFFFFF',
              boxShadow: 'var(--shadow-md)',
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
              {user?.email} • {user?.location?.city || 'Bengaluru'} ({user?.location?.remotePreference || 'Remote'})
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-text)', marginTop: '8px', maxWidth: '540px' }}>
              {user?.bio || 'Final-year Computer Science student passionate about building accessible web apps.'}
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
        <form onSubmit={handleSaveProfile} className="card" style={{ padding: '32px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Edit Profile Information</h3>

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
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bio Summary</label>
            <textarea
              rows={2}
              className="form-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input
                type="text"
                className="form-input"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Institution</label>
              <input
                type="text"
                className="form-input"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
            <GraduationCap size={20} color="var(--primary-blue)" />
            <h3 style={{ fontSize: '1.15rem' }}>Education</h3>
          </div>

          <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ fontSize: '1rem', color: 'var(--primary-text)' }}>
              {user?.education?.degree || 'Bachelor of Technology'}
            </strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
              {user?.education?.institution || 'Indian Institute of Information Technology'}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '0.8rem', color: '#64748B' }}>
              <span>Major: {user?.education?.fieldOfStudy || 'Computer Science'}</span>
              <span>•</span>
              <span>Class of {user?.education?.endYear || '2026'}</span>
            </div>
          </div>
        </div>

        {/* Experience & Projects */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Briefcase size={20} color="var(--primary-blue)" />
            <h3 style={{ fontSize: '1.15rem' }}>Experience & Projects</h3>
          </div>

          <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ fontSize: '1rem', color: 'var(--primary-text)' }}>
              {user?.experience?.role || 'Frontend Contributor'}
            </strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
              {user?.experience?.organization || 'Campus Open Source Guild'} ({user?.experience?.duration || '6 Months'})
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--primary-text)', marginTop: '8px' }}>
              {user?.experience?.description || 'Built interactive component modules and consumed REST endpoints.'}
            </p>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="card" style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '1.15rem' }}>Verified Candidate Skills</h3>
            </div>
            <button onClick={() => navigate('profile-setup')} className="btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              Manage Skills
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(user?.skills || []).map((skill, idx) => (
              <span key={idx} className="skill-chip skill-chip-matched">
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
