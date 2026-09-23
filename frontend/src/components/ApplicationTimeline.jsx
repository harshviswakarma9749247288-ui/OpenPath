import React from 'react';
import { Calendar, Video, Clock, CheckCircle } from 'lucide-react';

export default function ApplicationTimeline({ timeline = [], interviewDetails = null }) {
  return (
    <div style={{ padding: '16px 0' }}>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--secondary-navy)', marginBottom: '16px' }}>
        Application Progression Timeline
      </h4>

      <div style={{ position: 'relative', paddingLeft: '24px' }}>
        {/* Vertical line connecting events */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            bottom: '8px',
            left: '8px',
            width: '2px',
            backgroundColor: '#E2E8F0',
          }}
        />

        {timeline.map((item, index) => {
          const isLatest = index === timeline.length - 1;
          const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div key={index} style={{ position: 'relative', marginBottom: '20px' }}>
              {/* Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '-20px',
                  top: '3px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isLatest ? 'var(--primary-blue)' : '#94A3B8',
                  border: '2px solid #FFFFFF',
                  boxShadow: isLatest ? '0 0 0 3px rgba(37, 99, 235, 0.2)' : 'none',
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary-text)' }}>
                    {item.stage}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>
                    {formattedDate}
                  </span>
                </div>
                {item.note && (
                  <p style={{ fontSize: '0.825rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {interviewDetails && interviewDetails.date && (
        <div
          style={{
            marginTop: '16px',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', marginBottom: '8px' }}>
            <Calendar size={18} />
            <strong style={{ fontSize: '0.9rem' }}>Interview Details</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--secondary-text)' }}>Date & Time: </span>
              <strong>
                {new Date(interviewDetails.date).toLocaleDateString()} at {interviewDetails.time || '11:00 AM'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--secondary-text)' }}>Format: </span>
              <strong>{interviewDetails.type || 'Virtual Video Call'}</strong>
            </div>
            {interviewDetails.link && (
              <div style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
                <a
                  href={interviewDetails.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <Video size={14} /> Join Meeting Link
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
