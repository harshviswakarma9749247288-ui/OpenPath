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
              <button
                onClick={handleClose}
                className="ai-close-btn"
                aria-label="Close mentor drawer"
              >
                <X size={20} />
              </button>
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
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="ai-avatar-circle user">
                      <User size={16} color="#fff" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="ai-message-row ai">
                  <div className="ai-avatar-circle ai">
                    <RefreshCw size={16} color="#fff" className="animate-spin" />
                  </div>
                  <div className="ai-message-bubble ai ai-loading-text">
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
              className="ai-input-form"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about this role or preparation..."
                disabled={loading}
                className="ai-input-field"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="ai-send-btn"
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