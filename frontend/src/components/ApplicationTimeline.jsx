import React from 'react';
import { Calendar, Video } from 'lucide-react';

export default function ApplicationTimeline({ timeline = [], interviewDetails = null }) {
  return (
    <div style={{ padding: '16px 0' }}>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-text)', marginBottom: '16px' }}>
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
            background: 'linear-gradient(180deg, #A855F7 0%, var(--border-color) 100%)',
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
                  top: '4px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isLatest ? '#EC4899' : '#94A3B8',
                  border: '2px solid var(--background)',
                  boxShadow: isLatest ? '0 0 12px #EC4899' : 'none',
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isLatest ? 'var(--primary-text)' : 'var(--secondary-text)' }}>
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
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7C3AED', marginBottom: '10px' }}>
            <Calendar size={18} />
            <strong style={{ fontSize: '0.9rem' }}>Interview Schedule Confirmed</strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--secondary-text)' }}>Date & Time: </span>
              <strong style={{ color: 'var(--primary-text)' }}>
                {new Date(interviewDetails.date).toLocaleDateString()} at {interviewDetails.time || '11:00 AM'}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--secondary-text)' }}>Format: </span>
              <strong style={{ color: 'var(--primary-text)' }}>{interviewDetails.type || 'Virtual Video Call'}</strong>
            </div>
            {interviewDetails.link && (
              <div style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                <a
                  href={interviewDetails.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', padding: '7px 16px', fontSize: '0.8rem' }}
                >
                  <Video size={14} /> Launch Meeting Room
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
