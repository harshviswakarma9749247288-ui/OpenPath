import React from 'react';
import { Clock, Eye, CheckCircle2, Calendar, Award, XCircle } from 'lucide-react';

export default function ApplicationStatusBadge({ status }) {
  const configs = {
    Applied: {
      color: '#60A5FA',
      bg: 'rgba(59, 130, 246, 0.15)',
      border: 'rgba(59, 130, 246, 0.35)',
      icon: Clock,
      label: 'Applied',
    },
    Reviewing: {
      color: '#FBBF24',
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.35)',
      icon: Eye,
      label: 'Under Review',
    },
    Shortlisted: {
      color: '#C084FC',
      bg: 'rgba(168, 85, 247, 0.15)',
      border: 'rgba(168, 85, 247, 0.35)',
      icon: Award,
      label: 'Shortlisted',
    },
    Interview: {
      color: '#38BDF8',
      bg: 'rgba(14, 165, 233, 0.15)',
      border: 'rgba(14, 165, 233, 0.35)',
      icon: Calendar,
      label: 'Interview Scheduled',
    },
    Selected: {
      color: '#34D399',
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.35)',
      icon: CheckCircle2,
      label: 'Selected / Offer',
    },
    Rejected: {
      color: '#F87171',
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.35)',
      icon: XCircle,
      label: 'Not Selected',
    },
  };

  const item = configs[status] || configs.Applied;
  const Icon = item.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        backgroundColor: item.bg,
        color: item.color,
        border: `1px solid ${item.border}`,
      }}
    >
      <Icon size={14} />
      {item.label}
    </span>
  );
}
