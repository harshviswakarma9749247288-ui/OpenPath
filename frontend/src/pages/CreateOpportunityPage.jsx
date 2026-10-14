import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle2,
  MapPin,
  Calendar,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  FileCheck,
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import BackButton from '../components/BackButton';

export default function CreateOpportunityPage() {
  const { navigate, showToast } = useUIStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const defaultDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState(user?.companyDetails?.companyName || user?.name || '');
  const [type, setType] = useState('Internship');
  const [locationType, setLocationType] = useState('Remote');
  const [city, setCity] = useState(user?.location?.city || '');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [salaryPeriod, setSalaryPeriod] = useState('month');
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    if (user) {
      if (!organization && (user.companyDetails?.companyName || user.name)) {
        setOrganization(user.companyDetails?.companyName || user.name);
      }
      if (!city && user.location?.city) {
        setCity(user.location.city);
      }
    }
  }, [user]);

  useEffect(() => {
    api
      .get('/skills')
      .then((res) => {
        setAvailableSkills(res.data.skills || []);
      })
      .catch(() => {});
  }, []);

  const handleToggleSkill = (skill) => {
    if (selectedSkills.some((s) => (s._id || s) === skill._id)) {
      setSelectedSkills(selectedSkills.filter((s) => (s._id || s) !== skill._id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        organization,
        type,
        location: {
          type: locationType,
          city: city || (locationType === 'Remote' ? 'Remote' : 'Not specified'),
          state: user?.location?.state || '',
          country: user?.location?.country || 'India',
        },
        salary: {
          amount: salaryAmount || 'Competitive / Unpaid',
          period: salaryPeriod,
          currency: '₹',
          isUnpaid: !salaryAmount,
        },
        deadline: new Date(deadline),
        description,
        responsibilities: responsibilities
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
        requirements: requirements
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
        requiredSkills: selectedSkills.map((s) => s._id),
      };

      const res = await api.post('/opportunities', payload);
      showToast('Opportunity published successfully!', 'success');
      navigate('manage-opportunities');
    } catch (err) {
      showToast(err.message || 'Failed to publish opportunity', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container wizard-container">
      <BackButton
        label={step > 1 ? `Back to Step ${step - 1}` : 'Back to Dashboard'}
        onClick={step > 1 ? () => setStep(step - 1) : undefined}
        fallbackPage="employer-dashboard"
      />

      {/* Progress Steps Header */}
      <div className="dashboard-section-wrap">
        <h1 className="header-title-main">
          Post a New Opportunity
        </h1>
        <p className="header-sub-text">
          5-Step Structured Opportunity Wizard
        </p>

        {/* Step indicator pills */}
        <div className="wizard-steps-header">
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Location & Salary' },
            { num: 3, label: 'Responsibilities' },
            { num: 4, label: 'Skills' },
            { num: 5, label: 'Review & Publish' },
          ].map((s) => (
            <div
              key={s.num}
              className={`wizard-step-pill ${
                step === s.num
                  ? 'current'
                  : step > s.num
                  ? 'completed'
                  : 'upcoming'
              }`}
            >
              {step > s.num ? <CheckCircle2 size={14} /> : <span>{s.num}.</span>} {s.label}
            </div>
          ))}
        </div>
      </div>

      <div className="card card-featured wizard-card-body">
        {/* STEP 1: BASIC INFORMATION */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="wizard-step-title">Step 1: Role Overview</h3>

            <div className="form-group">
              <label className="form-label">Opportunity Title *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Frontend Engineering Intern or Junior Cloud Analyst"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Hiring Organization / Company *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Opportunity Type *</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Internship">Internship</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                  <option value="Entry-level Job">Entry-level Job</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Opportunity Summary *</label>
              <textarea
                rows={4}
                required
                className="form-textarea"
                placeholder="Provide a welcoming overview of what the candidate will learn and contribute..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & SALARY */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="wizard-step-title">Step 2: Location & Compensation</h3>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Work Model *</label>
                <select className="form-select" value={locationType} onChange={(e) => setLocationType(e.target.value)}>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City / Region</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Bengaluru, Remote, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label className="form-label">Stipend / Salary Amount</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ₹35,000 or ₹6,50,000"
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Period</label>
                <select className="form-select" value={salaryPeriod} onChange={(e) => setSalaryPeriod(e.target.value)}>
                  <option value="month">Per Month</option>
                  <option value="year">Per Annum (Yearly)</option>
                  <option value="stipend">Lump-sum Stipend</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Application Deadline *</label>
              <input
                type="date"
                required
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 3: RESPONSIBILITIES & REQUIREMENTS */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="wizard-step-title">Step 3: Responsibilities & Requirements</h3>

            <div className="form-group">
              <label className="form-label">Key Responsibilities (one per line)</label>
              <textarea
                rows={4}
                className="form-textarea"
                placeholder="Build responsive React components&#10;Collaborate with product designers&#10;Write unit tests"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Candidate Requirements & Eligibility (one per line)</label>
              <textarea
                rows={4}
                className="form-textarea"
                placeholder="Pursuing or graduated with Degree in CS/IT or self-taught&#10;Hands-on familiarity with Git and modern JavaScript&#10;Curiosity to learn in a high-growth environment"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 4: SKILLS & ELIGIBILITY */}
        {step === 4 && (
          <div className="animate-fade-in">
            <div className="dashboard-section-header">
              <h3 className="wizard-step-title">Step 4: Mandatory & Preferred Skills</h3>
              <span className="wizard-step-tag">
                Directly feeds the 40% Skill Match algorithm
              </span>
            </div>
            <p className="candidate-bg-desc">
              Click to tag skills candidates must possess or will develop during this opportunity.
            </p>

            <div className="wizard-skills-cloud">
              {availableSkills.map((s) => {
                const isSelected = selectedSkills.some((sel) => sel._id === s._id);
                return (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => handleToggleSkill(s)}
                    className={`wizard-skill-btn ${isSelected ? 'selected' : ''}`}
                  >
                    {isSelected && <CheckCircle2 size={14} />} {s.name}
                  </button>
                );
              })}
            </div>

            <div className="wizard-selected-skills-box">
              <strong className="candidate-bg-title">Selected Skills ({selectedSkills.length}): </strong>
              <span className="candidate-bg-desc">
                {selectedSkills.map((s) => s.name).join(', ') || 'None selected yet'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & PUBLISH */}
        {step === 5 && (
          <div className="animate-fade-in">
            <h3 className="wizard-step-title">Step 5: Review & Publish</h3>

            <div className="wizard-preview-card">
              <h4 className="wizard-preview-title">
                {title || 'Untitled Opportunity'}
              </h4>
              <p className="wizard-preview-meta">
                {organization} • {type} • {locationType} ({city}) • {salaryAmount} / {salaryPeriod}
              </p>

              <div className="candidate-modal-section">
                <strong className="candidate-modal-section-title">Required Skills:</strong>
                <div className="candidate-skills-row">
                  {selectedSkills.map((s, idx) => (
                    <span key={idx} className="skill-chip skill-chip-matched">
                      {s.name}
                    </span>
                  ))}
                  {selectedSkills.length === 0 && <span className="candidate-bg-desc">None</span>}
                </div>
              </div>

              <div>
                <strong className="candidate-modal-section-title">Deadline:</strong>
                <span className="candidate-modal-exp-desc">
                  {new Date(deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="wizard-ready-notice">
              ✨ <strong>Ready for instant candidate matching:</strong> As soon as this role is published,
              OpenPath will match it against student profiles and compute compatibility scores in real time.
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="wizard-controls-footer">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary">
              <ArrowLeft size={16} /> Previous Step
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !title) {
                  alert('Please enter a title');
                  return;
                }
                setStep(step + 1);
              }}
              className="btn-primary"
            >
              Continue to Step {step + 1} <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="btn-primary wizard-submit-btn"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Opportunity'} <Sparkles size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
