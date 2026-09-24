import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  MapPin,
  Briefcase,
  Plus,
  X,
  ArrowRight,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/api';

export default function ProfileSetupPage() {
  const { user, updateProfile } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const [availableSkills, setAvailableSkills] = useState([]);
  const [degree, setDegree] = useState(user?.education?.degree || 'Bachelor of Technology (B.Tech)');
  const [institution, setInstitution] = useState(user?.education?.institution || 'Indian Institute of Technology');
  const [fieldOfStudy, setFieldOfStudy] = useState(user?.education?.fieldOfStudy || 'Computer Science & Engineering');
  const [endYear, setEndYear] = useState(user?.education?.endYear || '2026');

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const [interests, setInterests] = useState(user?.interests || ['Web Development', 'Frontend', 'UI/UX Design']);
  const [interestInput, setInterestInput] = useState('');

  const [city, setCity] = useState(user?.location?.city || 'Bengaluru');
  const [remotePref, setRemotePref] = useState(user?.location?.remotePreference || 'Remote');
  const [bio, setBio] = useState(user?.bio || 'Aspiring software engineer eager to build accessible web apps.');

  useEffect(() => {
    api
      .get('/skills')
      .then((res) => {
        setAvailableSkills(res.data.skills || []);
        // Default preselect 3-4 skills if none
        if (res.data.skills?.length > 0 && selectedSkills.length === 0) {
          const preselected = res.data.skills.slice(0, 4);
          setSelectedSkills(preselected);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddSkill = (skillObj) => {
    if (!selectedSkills.some((s) => (s._id || s) === (skillObj._id || skillObj))) {
      setSelectedSkills([...selectedSkills, skillObj]);
    }
  };

  const handleRemoveSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter((s) => (s._id || s) !== skillId));
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim()) {
      setSelectedSkills([...selectedSkills, { name: skillInput.trim(), _id: `temp_${Date.now()}` }]);
      setSkillInput('');
    }
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (item) => {
    setInterests(interests.filter((i) => i !== item));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const skillIds = selectedSkills.map((s) => s._id).filter((id) => !id.startsWith('temp_'));

    const payload = {
      bio,
      education: {
        degree,
        institution,
        fieldOfStudy,
        endYear,
      },
      skills: skillIds,
      interests,
      location: {
        city,
        state: 'Karnataka',
        country: 'India',
        remotePreference: remotePref,
      },
    };

    const res = await updateProfile(payload);
    if (res.success) {
      showToast('Profile completed successfully! Welcome to your dashboard.', 'success');
      navigate('dashboard');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px 80px 20px' }}>
      {/* Onboarding Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#C084FC',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            padding: '4px 14px',
            borderRadius: '9999px',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            letterSpacing: '0.05em',
          }}
        >
          STEP 2 OF 2: PROFILE SETUP
        </span>
        <h1 style={{ fontSize: '2.2rem', marginTop: '12px', color: '#FFFFFF' }}>
          Build Your Candidate Profile
        </h1>
        <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', marginTop: '6px' }}>
          OpenPath calculates your 5-factor match score based on your skills, education, and preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="card card-featured" style={{ padding: '32px' }}>
        {/* Education Section */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <GraduationCap size={20} color="#38BDF8" />
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>1. Academic Background</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. B.Tech / BCA / B.Sc"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Institution / College</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="University or College Name"
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
                required
                className="form-input"
                placeholder="e.g. Computer Science, Information Technology"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. 2026"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
              />
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />

        {/* Skills Section (40% Match Weight) */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#C084FC" />
              <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>2. Technical Skills</h3>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C084FC', backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '3px 10px', borderRadius: '4px' }}>
              Carries 40% Weight in Matching
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '14px' }}>
            Add at least 3 skills to unlock high compatibility recommendations.
          </p>

          {/* Current selected chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px', minHeight: '40px', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
            {selectedSkills.map((s) => (
              <span key={s._id || s.name} className="skill-chip skill-chip-matched">
                {s.name}
                <button type="button" onClick={() => handleRemoveSkill(s._id)} style={{ color: '#6EE7B7' }}>
                  <X size={14} />
                </button>
              </span>
            ))}
            {selectedSkills.length === 0 && (
              <span style={{ fontSize: '0.825rem', color: '#94A3B8' }}>Select skills from suggestions below or type a custom skill</span>
            )}
          </div>

          {/* Suggestion tags */}
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary-text)', display: 'block', marginBottom: '6px' }}>
              SUGGESTED FOR SOFTWARE & TECH:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {availableSkills.slice(0, 10).map((skill) => {
                const isSelected = selectedSkills.some((s) => (s._id || s) === skill._id);
                return (
                  <button
                    key={skill._id}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    disabled={isSelected}
                    style={{
                      fontSize: '0.775rem',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#34D399' : '#E2E8F0',
                      cursor: isSelected ? 'default' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isSelected ? <CheckCircle2 size={12} /> : <Plus size={12} />} {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />

        {/* Career Interests & Location */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MapPin size={20} color="#F472B6" />
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>3. Location & Preferences</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Current City</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Bengaluru, Mumbai, Pune"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Work Mode Preference</label>
              <select
                className="form-select"
                value={remotePref}
                onChange={(e) => setRemotePref(e.target.value)}
              >
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid (Remote + Office)</option>
                <option value="On-site">On-site / Office</option>
                <option value="Any">Flexible (Any)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Professional Summary</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Tell employers about your passion and project focus..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="btn-ghost"
            style={{ fontSize: '0.875rem' }}
          >
            Skip for now →
          </button>
          <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
            Save & Explore Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
