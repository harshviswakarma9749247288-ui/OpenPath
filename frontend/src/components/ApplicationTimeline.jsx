import React from 'react';
import { Calendar, Video } from 'lucide-react';

export default function ApplicationTimeline({ timeline = [], interviewDetails = null }) {
  return (
    <div className="app-timeline-container">
      <h4 className="app-timeline-title">
        Application Progression Timeline
      </h4>

      <div className="app-timeline-line-wrap">
        {/* Vertical line connecting events */}
        <div className="app-timeline-vertical-line" />

        {timeline.map((item, index) => {
          const isLatest = index === timeline.length - 1;
          const formattedDate = new Date(item.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div key={index} className="app-timeline-event-item">
              {/* Dot */}
              <div className={`app-timeline-dot ${isLatest ? 'latest' : 'past'}`} />

              <div>
                <div className="app-timeline-event-header">
                  <span className={`app-timeline-event-stage ${isLatest ? 'latest' : 'past'}`}>
                    {item.stage}
                  </span>
                  <span className="app-timeline-event-date">
                    {formattedDate}
                  </span>
                </div>
                {item.note && (
                  <p className="app-timeline-event-note">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {interviewDetails && interviewDetails.date && (
        <div className="interview-confirmed-box">
          <div className="interview-confirmed-header">
            <Calendar size={18} />
            <strong>Interview Schedule Confirmed</strong>
          </div>
          <div className="interview-details-grid">
            <div>
              <span>Date & Time: </span>
              <strong>
                {new Date(interviewDetails.date).toLocaleDateString()} at {interviewDetails.time || '11:00 AM'}
              </strong>
            </div>
            <div>
              <span>Format: </span>
              <strong>{interviewDetails.type || 'Virtual Video Call'}</strong>
            </div>
            {interviewDetails.link && (
              <div className="grid-col-all">
                <a
                  href={interviewDetails.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary interview-meeting-btn"
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
