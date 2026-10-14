import React from 'react';
import { Clock, Eye, CheckCircle2, Calendar, Award, XCircle } from 'lucide-react';

export default function ApplicationStatusBadge({ status }) {
  const configs = {
    Applied: {
      icon: Clock,
      label: 'Applied',
    },
    Reviewing: {
      icon: Eye,
      label: 'Under Review',
    },
    Shortlisted: {
      icon: Award,
      label: 'Shortlisted',
    },
    Interview: {
      icon: Calendar,
      label: 'Interview Scheduled',
    },
    Selected: {
      icon: CheckCircle2,
      label: 'Selected / Offer',
    },
    Rejected: {
      icon: XCircle,
      label: 'Not Selected',
    },
  };

  const item = configs[status] || configs.Applied;
  const Icon = item.icon;
  const statusClass = (status || 'applied').toLowerCase();

  return (
    <span className={`app-status-badge status-${statusClass}`}>
      <Icon size={14} />
      {item.label}
    </span>
  );
}
