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
import BackButton from '../components/BackButton';
import api from '../utils/api';

export default function ProfileSetupPage() {
  const { user, updateProfile } = useAuthStore();
  const { navigate, showToast } = useUIStore();

  const [availableSkills, setAvailableSkills] = useState([]);
  const [degree, setDegree] = useState(user?.education?.degree || '');
  const [institution, setInstitution] = useState(user?.education?.institution || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(user?.education?.fieldOfStudy || '');
  const [endYear, setEndYear] = useState(user?.education?.endYear || '');

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const [interests, setInterests] = useState(user?.interests || []);
  const [interestInput, setInterestInput] = useState('');

  const [city, setCity] = useState(user?.location?.city || '');
  const [remotePref, setRemotePref] = useState(user?.location?.remotePreference || 'Hybrid');
  const [bio, setBio] = useState(user?.bio || '');

  useEffect(() => {
    if (user) {
      if (user.education) {
        setDegree(user.education.degree || '');
        setInstitution(user.education.institution || '');
        setFieldOfStudy(user.education.fieldOfStudy || '');
        setEndYear(user.education.endYear || '');
      }
      if (user.interests && user.interests.length > 0) {
        setInterests(user.interests);
      }
      if (user.location) {
        setCity(user.location.city || '');
        setRemotePref(user.location.remotePreference || 'Hybrid');
      }
      if (user.bio) {
        setBio(user.bio);
      }
    }
  }, [user]);

  useEffect(() => {
    api
      .get('/skills')
      .then((res) => {
        const list = res.data.skills || [];
        setAvailableSkills(list);
        if (user?.skills?.length > 0) {
          const userSkillIds = user.skills.map((s) => (typeof s === 'object' ? s._id : s));
          const matched = list.filter((s) => userSkillIds.includes(s._id));
          if (matched.length > 0) {
            setSelectedSkills(matched);
          }
        }
      })
      .catch(() => {});
  }, [user]);

  const handleAddSkill = (skillObj) => {
    if (!selectedSkills.some((s) => (s._id || s) === (skillObj._id || skillObj))) {
      setSelectedSkills([...selectedSkills, skillObj]);
    }
  };

  const handleRemoveSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter((s) => (s._id || s) !== skillId));
  };

  const handleAddCustomSkill = async (e) => {
    e.preventDefault();
    const rawName = skillInput.trim();
    if (!rawName) return;

    try {
      const res = await api.post('/skills', { name: rawName, category: 'General' });
      const dbSkill = res?.data?.skill;
      if (dbSkill) {
        if (!availableSkills.some((s) => s._id === dbSkill._id)) {
          setAvailableSkills((prev) => [...prev, dbSkill]);
        }
        if (!selectedSkills.some((s) => (s._id || s) === dbSkill._id)) {
          setSelectedSkills((prev) => [...prev, dbSkill]);
        }
      }
      setSkillInput('');
    } catch (err) {
      setSelectedSkills((prev) => [...prev, { name: rawName, _id: rawName }]);
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
    const skillRefs = selectedSkills.map((s) =>
      typeof s === 'object' ? (s._id && !String(s._id).startsWith('temp_') ? s._id : s.name) : s
    );

    const payload = {
      bio,
      education: {
        degree,
        institution,
        fieldOfStudy,
        endYear,
      },
      skills: skillRefs,
      interests,
      location: {
        city,
        state: user?.location?.state || '',
        country: user?.location?.country || 'India',
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
    <div className="profile-setup-wrapper">
      <BackButton label="Back to Dashboard" fallbackPage="dashboard" className="profile-setup-back-btn" />

      {/* Onboarding Header */}
      <div className="profile-setup-header">
        <span className="profile-setup-step-badge">
          STEP 2 OF 2: PROFILE SETUP
        </span>
        <h1 className="profile-setup-title">
          Build Your Candidate Profile
        </h1>
        <p className="profile-setup-subtitle">
          OpenPath calculates your 5-factor match score based on your skills, education, and preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="card card-featured profile-setup-form">
        {/* Education Section */}
        <div className="profile-setup-section">
          <div className="profile-setup-section-title-row">
            <GraduationCap size={20} color="#38BDF8" />
            <h3 className="profile-setup-section-title">1. Academic Background</h3>
          </div>

          <div className="form-grid-2col">
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

          <div className="form-grid-2-1">
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

        <hr className="profile-setup-hr" />

        {/* Skills Section (40% Match Weight) */}
        <div className="profile-setup-section">
          <div className="profile-setup-skills-header">
            <div className="profile-setup-section-title-row">
              <Sparkles size={20} color="#C084FC" />
              <h3 className="profile-setup-section-title">2. Technical Skills</h3>
            </div>
            <span className="profile-setup-weight-badge">
              Carries 40% Weight in Matching
            </span>
          </div>
          <p className="profile-setup-skills-hint">
            Add at least 3 skills to unlock high compatibility recommendations.
          </p>

          {/* Current selected chips */}
          <div className="profile-setup-selected-box">
            {selectedSkills.map((s) => (
              <span key={s._id || s.name} className="skill-chip skill-chip-matched">
                {s.name}
                <button type="button" onClick={() => handleRemoveSkill(s._id)} className="profile-setup-remove-btn">
                  <X size={14} />
                </button>
              </span>
            ))}
            {selectedSkills.length === 0 && (
              <span className="profile-setup-empty-hint">Select skills from suggestions below or type a custom skill</span>
            )}
          </div>

          {/* Suggestion tags */}
          <div className="landing-hero-announcement-margin">
            <span className="profile-setup-suggestions-header">
              SUGGESTED FOR SOFTWARE & TECH:
            </span>
            <div className="profile-setup-suggestions-wrap">
              {availableSkills.slice(0, 10).map((skill) => {
                const isSelected = selectedSkills.some((s) => (s._id || s) === skill._id);
                return (
                  <button
                    key={skill._id}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    disabled={isSelected}
                    className={`profile-setup-tag-btn ${isSelected ? 'selected' : ''}`}
                  >
                    {isSelected ? <CheckCircle2 size={12} /> : <Plus size={12} />} {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <hr className="profile-setup-hr" />

        {/* Career Interests & Location */}
        <div className="profile-setup-section">
          <div className="profile-setup-section-title-row">
            <MapPin size={20} color="#F472B6" />
            <h3 className="profile-setup-section-title">3. Location & Preferences</h3>
          </div>

          <div className="form-grid-2col">
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
        <div className="profile-setup-footer">
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="btn-ghost profile-setup-btn-skip"
          >
            Skip for now →
          </button>
          <button type="submit" className="btn-primary profile-setup-btn-save">
            Save & Explore Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
