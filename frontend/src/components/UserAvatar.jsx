import React, { useState } from 'react';

// Generates a deterministic vibrant gradient from a character code
const getAvatarGradient = (char = 'U') => {
  const gradients = [
    'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', // OpenPath Blue
    'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', // Indigo/Purple
    'linear-gradient(135deg, #059669 0%, #047857 100%)', // Emerald
    'linear-gradient(135deg, #D97706 0%, #B45309 100%)', // Amber
    'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)', // Rose
    'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', // Sky
    'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)', // Deep Indigo
    'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)', // Teal
  ];
  const charCode = char.charCodeAt(0) || 0;
  return gradients[charCode % gradients.length];
};

export default function UserAvatar({
  user,
  name: explicitName,
  avatar: explicitAvatar,
  size = 40,
  className = '',
  style = {},
  alt,
}) {
  const [imgError, setImgError] = useState(false);

  const userName = explicitName || user?.name || 'User';
  const avatarUrl = explicitAvatar !== undefined ? explicitAvatar : user?.avatar;

  const firstLetter = (userName && typeof userName === 'string' && userName.trim().length > 0)
    ? userName.trim().charAt(0).toUpperCase()
    : 'U';

  const hasValidPhoto = Boolean(avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim().length > 0 && !imgError);

  if (hasValidPhoto) {
    return (
      <img
        src={avatarUrl}
        alt={alt || userName}
        onError={() => setImgError(true)}
        className={`user-avatar-img ${className}`}
        style={{
          width: size ? `${size}px` : undefined,
          height: size ? `${size}px` : undefined,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  // Render First Letter initials avatar
  const fontSize = Math.max(12, Math.round(size * 0.44));

  return (
    <div
      className={`user-avatar-initials ${className}`}
      title={userName}
      aria-label={userName}
      style={{
        width: size ? `${size}px` : undefined,
        height: size ? `${size}px` : undefined,
        minWidth: size ? `${size}px` : undefined,
        minHeight: size ? `${size}px` : undefined,
        borderRadius: '50%',
        background: getAvatarGradient(firstLetter),
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: `${fontSize}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        textTransform: 'uppercase',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
        ...style,
      }}
    >
      {firstLetter}
    </div>
  );
}
