import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, Briefcase, Target, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

/**
 * Helper to render markdown bold (**text**) and bullet lists nicely in the chat bubble.
 */
function FormattedMessageContent({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="ai-message-content">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="ai-message-spacer" />;
        }

        // Parse bold **text** segments
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const parsedLine = parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        // Bullet point styling
        if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={lineIdx} className="ai-message-bullet-line">
              <span className="ai-bullet-dot">•</span>
              <span className="ai-bullet-text">{parsedLine}</span>
            </div>
          );
        }

        return (
          <div key={lineIdx} className="ai-message-text-line">
            {parsedLine}
          </div>
        );
      })}
    </div>
  );
}

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

  const initialGreeting = `👋 Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! I am your OpenPath AI Career Mentor. I'm calibrated to your profile and current skills. Ask me about skill gaps, project roadmaps, or interview prep!`;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: initialGreeting,
    },
  ]);

  const messagesEndRef = useRef(null);
  const lastAnalyzedOppIdRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isAiDrawerOpen]);

  // Reset / Clear Conversation
  const handleResetChat = () => {
    lastAnalyzedOppIdRef.current = null;
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: initialGreeting,
      },
    ]);
  };

  // Core Send message function with real-time SSE streaming
  const handleSend = useCallback(async (textToSend) => {
    const message = textToSend || inputMessage;
    if (!message || !message.trim() || loading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: message };
    const aiMessageId = Date.now() + 1;

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: aiMessageId, sender: 'ai', text: '' },
    ]);
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

      // Prepare conversation history (last 5 messages)
      const conversationHistory = messages.slice(-5).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('openpath_token');

      const response = await fetch(`${API_BASE}/ai/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          prompt: message,
          messages: conversationHistory,
          context: {
            student: studentContext,
            opportunity: opportunityContext,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;
          if (trimmed === 'data: [DONE]') break;

          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.token) {
                streamedText += data.token;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMessageId ? { ...m, text: streamedText } : m
                  )
                );
              }
            } catch {}
          }
        }
      }

      // If nothing streamed, provide safe fallback
      if (!streamedText.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? { ...m, text: "I'm ready to help with your career! You can ask me to analyze skill gaps, project roadmaps, or interview prep." }
              : m
          )
        );
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMessageId
            ? {
                ...m,
                text: '⚠️ Unable to connect to OpenPath Career AI. Please ensure your backend is active.',
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }, [inputMessage, loading, user, activeMentorOpportunity, messages]);

  // Automated trigger when an opportunity is clicked (triggers only once per opportunity)
  useEffect(() => {
    if (activeMentorOpportunity && isAiDrawerOpen) {
      const oppId = activeMentorOpportunity._id || activeMentorOpportunity.id || activeMentorOpportunity.title;
      if (lastAnalyzedOppIdRef.current !== oppId) {
        lastAnalyzedOppIdRef.current = oppId;
        const promptText = `Analyze my fit for "${activeMentorOpportunity.title}". What are my top matched skills, priority missing skills, and recommended 3-step action plan?`;
        handleSend(promptText);
      }
    }
  }, [activeMentorOpportunity, isAiDrawerOpen, handleSend]);

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
      {/* Animated Floating Trigger Button (Bottom-Right) */}
      {!isAiDrawerOpen && (
        <button
          onClick={() => {
            setIsHovered(false);
            setAiDrawerOpen(true);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="AI Career Mentor"
          className={`ai-floating-trigger ${isHovered ? 'hovered' : ''}`}
        >
          <Bot size={22} className={`ai-trigger-icon ${isHovered ? 'hovered' : ''}`} />
          <span className={`ai-trigger-label ${isHovered ? 'hovered' : ''}`}>
            <span>AI Career Mentor</span>
            <span className="ai-trigger-dot" />
          </span>
        </button>
      )}

      {/* Slide-out Drawer Panel */}
      {isAiDrawerOpen && (
        <div className="ai-drawer-overlay" onClick={handleClose}>
          <div onClick={(e) => e.stopPropagation()} className="ai-drawer-pane">
            {/* Header */}
            <div className="ai-drawer-header">
              <div className="candidate-card-title-row">
                <div className="ai-header-icon-box">
                  <Bot size={20} color="#fff" />
                </div>
                <div>
                  <h3 className="ai-header-title">AI Career Mentor</h3>
                  <span className="ai-header-sub">
                    {user?.name ? `${user.name} • ` : ''}Context Aware
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetChat}
                  className="ai-action-btn"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={handleClose}
                  className="ai-close-btn"
                  title="Close mentor drawer"
                  aria-label="Close mentor drawer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Target Opportunity Alert Bar */}
            {activeMentorOpportunity && (
              <div className="ai-opportunity-banner">
                <Target size={16} />
                <span>
                  Analyzing: <strong>{activeMentorOpportunity.title}</strong>
                  {activeMentorOpportunity.matchScore ? ` (${activeMentorOpportunity.matchScore}% Match)` : ''}
                </span>
              </div>
            )}

            {/* User Profile Context Badge */}
            <div className="ai-context-banner">
              <Briefcase size={14} />
              <span>
                Target: <strong>{user?.targetRole || 'Full-Stack Dev'}</strong> | Skills: <strong>{user?.skills?.length || 4} tracked</strong>
              </span>
            </div>

            {/* Quick Prompts */}
            <div className="ai-quick-prompts-row">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="ai-quick-prompt-btn"
                >
                  <Sparkles size={12} className="sparkle-inline-icon" />
                  {prompt}
                </button>
              ))}
            </div>

            {/* Conversation Stream */}
            <div className="ai-chat-stream">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ai-message-row ${msg.sender === 'user' ? 'user' : 'ai'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="ai-avatar-circle ai">
                      <Bot size={16} color="#fff" />
                    </div>
                  )}
                  <div className={`ai-message-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                    {msg.text ? (
                      <FormattedMessageContent text={msg.text} />
                    ) : (
                      <span className="ai-loading-text flex items-center gap-1">
                        <RefreshCw size={14} className="animate-spin inline" /> Thinking...
                      </span>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="ai-avatar-circle user">
                      <User size={16} color="#fff" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="ai-input-form"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about this role, skill gaps, or interview prep..."
                disabled={loading}
                className="ai-input-field"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="ai-send-btn"
                aria-label="Send message"
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