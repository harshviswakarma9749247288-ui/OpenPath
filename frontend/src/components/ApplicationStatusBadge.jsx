import React from 'react';
import { Clock, Eye, CheckCircle2, Calendar, Award, XCircle } from 'lucide-react';

export default function ApplicationStatusBadge({ status }) {
  const configs = {
    Applied: {
      color: 'var(--status-blue-text)',
      bg: 'var(--status-blue-bg)',
      border: 'var(--status-blue-border)',
      icon: Clock,
      label: 'Applied',
    },
    Reviewing: {
      color: 'var(--status-yellow-text)',
      bg: 'var(--status-yellow-bg)',
      border: 'var(--status-yellow-border)',
      icon: Eye,
      label: 'Under Review',
    },
    Shortlisted: {
      color: 'var(--status-purple-text)',
      bg: 'var(--status-purple-bg)',
      border: 'var(--status-purple-border)',
      icon: Award,
      label: 'Shortlisted',
    },
    Interview: {
      color: 'var(--status-blue-text)',
      bg: 'var(--status-blue-bg)',
      border: 'var(--status-blue-border)',
      icon: Calendar,
      label: 'Interview Scheduled',
    },
    Selected: {
      color: 'var(--status-green-text)',
      bg: 'var(--status-green-bg)',
      border: 'var(--status-green-border)',
      icon: CheckCircle2,
      label: 'Selected / Offer',
    },
    Rejected: {
      color: 'var(--status-red-text)',
      bg: 'var(--status-red-bg)',
      border: 'var(--status-red-border)',
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
