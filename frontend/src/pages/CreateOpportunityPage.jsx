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
import api from '../utils/api';

export default function CreateOpportunityPage() {
  const { navigate, showToast } = useUIStore();

  const [step, setStep] = useState(1);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('TechCorp Labs');
  const [type, setType] = useState('Internship');
  const [locationType, setLocationType] = useState('Remote');
  const [city, setCity] = useState('Bengaluru');
  const [salaryAmount, setSalaryAmount] = useState('₹35,000');
  const [salaryPeriod, setSalaryPeriod] = useState('month');
  const [deadline, setDeadline] = useState('2026-10-31');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

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
          city,
          state: 'Karnataka',
          country: 'India',
        },
        salary: {
          amount: salaryAmount,
          period: salaryPeriod,
          currency: '₹',
          isUnpaid: false,
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
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      <button
        onClick={() => navigate('employer-dashboard')}
        className="btn-ghost"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Progress Steps Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', marginBottom: '8px' }}>
          Post a New Opportunity
        </h1>
        <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>
          5-Step Structured Opportunity Wizard
        </p>

        {/* Step indicator pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Location & Salary' },
            { num: 3, label: 'Responsibilities' },
            { num: 4, label: 'Skills' },
            { num: 5, label: 'Review & Publish' },
          ].map((s) => (
            <div
              key={s.num}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor:
                  step === s.num
                    ? 'rgba(168, 85, 247, 0.2)'
                    : step > s.num
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(255, 255, 255, 0.04)',
                border:
                  step === s.num
                    ? '1.5px solid rgba(168, 85, 247, 0.5)'
                    : step > s.num
                    ? '1px solid rgba(16, 185, 129, 0.35)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: step === s.num ? '0 0 15px rgba(124, 58, 237, 0.3)' : 'none',
                fontSize: '0.8rem',
                color: step === s.num ? '#C084FC' : step > s.num ? '#34D399' : 'var(--secondary-text)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(8px)',
              }}
            >
              {step > s.num ? <CheckCircle2 size={14} /> : <span>{s.num}.</span>} {s.label}
            </div>
          ))}
        </div>
      </div>

      <div className="card card-featured" style={{ padding: '32px' }}>
        {/* STEP 1: BASIC INFORMATION */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '18px', color: '#FFFFFF' }}>Step 1: Role Overview</h3>

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
            <h3 style={{ fontSize: '1.2rem', marginBottom: '18px' }}>Step 2: Location & Compensation</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
            <h3 style={{ fontSize: '1.2rem', marginBottom: '18px' }}>Step 3: Responsibilities & Requirements</h3>

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>Step 4: Mandatory & Preferred Skills</h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C084FC' }}>
                Directly feeds the 40% Skill Match algorithm
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '16px' }}>
              Click to tag skills candidates must possess or will develop during this opportunity.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {availableSkills.map((s) => {
                const isSelected = selectedSkills.some((sel) => sel._id === s._id);
                return (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => handleToggleSkill(s)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: isSelected ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#FFFFFF' : '#E2E8F0',
                      border: isSelected ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: isSelected ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {isSelected && <CheckCircle2 size={14} />} {s.name}
                  </button>
                );
              })}
            </div>

            <div style={{ padding: '14px', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.85rem' }}>
              <strong style={{ color: '#F8FAFC' }}>Selected Skills ({selectedSkills.length}): </strong>
              <span style={{ color: 'var(--secondary-text)' }}>
                {selectedSkills.map((s) => s.name).join(', ') || 'None selected yet'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & PUBLISH */}
        {step === 5 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '18px', color: '#FFFFFF' }}>Step 5: Review & Publish</h3>

            <div style={{ padding: '24px', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '6px' }}>
                {title || 'Untitled Opportunity'}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginBottom: '14px' }}>
                {organization} • {type} • {locationType} ({city}) • {salaryAmount} / {salaryPeriod}
              </p>

              <div style={{ marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px', color: '#F8FAFC' }}>Required Skills:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedSkills.map((s, idx) => (
                    <span key={idx} className="skill-chip skill-chip-matched">
                      {s.name}
                    </span>
                  ))}
                  {selectedSkills.length === 0 && <span style={{ color: '#94A3B8' }}>None</span>}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '4px', color: '#F8FAFC' }}>Deadline:</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary-text)' }}>
                  {new Date(deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', color: '#38BDF8', fontSize: '0.85rem' }}>
              ✨ <strong>Ready for instant candidate matching:</strong> As soon as this role is published,
              OpenPath will match it against student profiles and compute compatibility scores in real time.
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
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
              className="btn-primary"
              style={{ padding: '12px 28px' }}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Opportunity'} <Sparkles size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
