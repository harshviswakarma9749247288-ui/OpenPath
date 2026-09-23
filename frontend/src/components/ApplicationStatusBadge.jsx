import React from 'react';
import { Clock, Eye, CheckCircle2, Calendar, Award, XCircle } from 'lucide-react';

export default function ApplicationStatusBadge({ status }) {
  const configs = {
    Applied: {
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      icon: Clock,
      label: 'Applied',
    },
    Reviewing: {
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
      icon: Eye,
      label: 'Under Review',
    },
    Shortlisted: {
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      icon: Award,
      label: 'Shortlisted',
    },
    Interview: {
      color: '#0891B2',
      bg: '#ECFEFF',
      border: '#A5F3FC',
      icon: Calendar,
      label: 'Interview Scheduled',
    },
    Selected: {
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      icon: CheckCircle2,
      label: 'Selected / Offer',
    },
    Rejected: {
      color: '#DC2626',
      bg: '#FEF2F2',
      border: '#FECACA',
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
