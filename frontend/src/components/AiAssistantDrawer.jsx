import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, Briefcase, Target } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

export default function AiAssistantDrawer() {
  const { user } = useAuthStore();
  const { 
    isAiDrawerOpen, 
    setAiDrawerOpen, 
    activeMentorOpportunity, 
    clearMentorOpportunity 
  } = useUIStore();

  const [isHovered, setIsHovered] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `👋 Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! I am your OpenPath AI Career Mentor. I'm calibrated to your profile and current skills. Ask me about skill gaps, project roadmaps, or interview prep!`,
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isAiDrawerOpen]);

  // Core Send message function
  const handleSend = useCallback(async (textToSend) => {
    const message = textToSend || inputMessage;
    if (!message || !message.trim() || loading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const studentContext = {
        name: user?.name || 'Candidate',
        targetRole: user?.targetRole || 'Full-Stack Developer',
        skills: user?.skills || ['React', 'JavaScript', 'HTML/CSS', 'Node.js'],
        experienceLevel: user?.experienceLevel || 'Entry-Level',
      };

      const opportunityContext = activeMentorOpportunity
        ? {
            title: activeMentorOpportunity.title,
            requiredSkills: activeMentorOpportunity.requiredSkills || [],
            matchScore: activeMentorOpportunity.matchScore || null,
          }
        : null;

      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: message,
          context: {
            student: studentContext,
            opportunity: opportunityContext,
          },
        }),
      });

      const data = await response.json();

      if (data && (data.reply || data.response)) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: data.reply || data.response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: "I couldn't process that response. Please check your Ollama backend." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: '⚠️ Unable to connect to the backend AI agent at http://localhost:5000/api/ai/chat. Ensure your backend server is running.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [inputMessage, loading, user, activeMentorOpportunity]);

  // Automated trigger when an opportunity is clicked
  useEffect(() => {
    if (activeMentorOpportunity && isAiDrawerOpen) {
      const promptText = `Analyze my skill gap for "${activeMentorOpportunity.title}". Compare my current background against the role requirements. Acknowledge my existing tech strengths, pinpoint specific missing design tools/methods, and outline a full, day-by-day 14-day study and portfolio roadmap.`;
      handleSend(promptText);
    }
  }, [activeMentorOpportunity, isAiDrawerOpen]);

  const quickPrompts = activeMentorOpportunity
    ? [
        `What projects will qualify me for ${activeMentorOpportunity.title}?`,
        `Mock technical interview for this role`,
        `Prioritize my top missing skills`,
      ]
    : [
        'How can I improve my skill match score?',
        'What projects should I build for React?',
        'How do I prepare for a Full-Stack interview?',
      ];

  const handleClose = () => {
    setAiDrawerOpen(false);
    if (clearMentorOpportunity) {
      clearMentorOpportunity();
    }
  };

  return (
    <>
      {/* Animated Floating Trigger Button (Bottom-Right): Circle by default, expands on hover */}
      {!isAiDrawerOpen && (
        <button
          onClick={() => {
            setIsHovered(false);
            setAiDrawerOpen(true);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="AI Career Mentor"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9990,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isHovered ? '10px' : '0px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            height: '52px',
            minWidth: '52px',
            maxWidth: isHovered ? '240px' : '52px',
            padding: isHovered ? '0 20px' : '0',
            borderRadius: '9999px',
            boxShadow: isHovered
              ? '0 14px 28px -5px rgba(37, 99, 235, 0.5), 0 8px 12px -6px rgba(37, 99, 235, 0.3)'
              : '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transform: isHovered ? 'translateY(-2px) scale(1.03)' : 'translateY(0) scale(1)',
            transition:
              'max-width 0.35s cubic-bezier(0.22, 1, 0.36, 1), padding 0.35s cubic-bezier(0.22, 1, 0.36, 1), gap 0.3s ease, transform 0.25s ease, box-shadow 0.25s ease',
          }}
        >
          <Bot
            size={22}
            style={{
              flexShrink: 0,
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'rotate(-6deg) scale(1.05)' : 'rotate(0deg) scale(1)',
            }}
          />
          <span
            style={{
              maxWidth: isHovered ? '160px' : '0px',
              opacity: isHovered ? 1 : 0,
              overflow: 'hidden',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition:
                'max-width 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease',
            }}
          >
            <span>AI Career Mentor</span>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#4ade80',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
          </span>
        </button>
      )}

      {/* Slide-out Drawer Panel */}
      {isAiDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '430px',
              height: '100%',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 25px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              zIndex: 100000,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: '#2563eb', padding: '8px', borderRadius: '8px', display: 'flex' }}>
                  <Bot size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>AI Career Mentor</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {user?.name ? `${user.name} • ` : ''}Context Aware
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Target Opportunity Alert Bar */}
            {activeMentorOpportunity && (
              <div
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.78rem',
                  color: '#6ee7b7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Target size={16} />
                <span>
                  Analyzing: <strong>{activeMentorOpportunity.title}</strong>
                  {activeMentorOpportunity.matchScore ? ` (${activeMentorOpportunity.matchScore}% Match)` : ''}
                </span>
              </div>
            )}

            {/* User Profile Context Badge */}
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.75rem',
                color: '#93c5fd',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Briefcase size={14} />
              <span>
                Target: <strong>{user?.targetRole || 'Full-Stack Dev'}</strong> | Skills: <strong>{user?.skills?.length || 4} tracked</strong>
              </span>
            </div>

            {/* Quick Prompts */}
            <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '0.75rem',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#cbd5e1',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {prompt}
                </button>
              ))}
            </div>

            {/* Conversation Stream */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  {msg.sender === 'ai' && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bot size={16} color="#fff" />
                    </div>
                  )}
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      lineHeight: '1.45',
                      backgroundColor: msg.sender === 'user' ? '#2563eb' : 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={16} color="#fff" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={16} color="#fff" className="animate-spin" />
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '0.875rem', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                    Analyzing role with local Llama...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                padding: '14px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                gap: '8px',
              }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about this role or preparation..."
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                style={{
                  backgroundColor: '#2563eb',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0 16px',
                  color: '#fff',
                  cursor: loading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !inputMessage.trim() ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}