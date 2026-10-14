import { ENV } from '../config/env.js';

/**
 * Resolves which Ollama model is available locally.
 * Prefers ENV.LOCAL_AI_MODEL, otherwise dynamically falls back
 * to any installed model (e.g. llama3.2:1b, llama3:latest).
 */
let cachedActiveModel = null;

async function getAvailableModel(baseUrl, preferredModel) {
  if (cachedActiveModel) return cachedActiveModel;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return preferredModel;
    const data = await res.json();
    const modelNames = (data.models || []).map((m) => m.name || m.model);

    if (modelNames.length === 0) return preferredModel;
    if (modelNames.includes(preferredModel)) {
      cachedActiveModel = preferredModel;
      return preferredModel;
    }

    // Check if preferred model base name matches (e.g. 'llama3.2' matches 'llama3.2:1b')
    const baseName = preferredModel.split(':')[0].toLowerCase();
    const match = modelNames.find((m) => m.toLowerCase().includes(baseName));
    if (match) {
      cachedActiveModel = match;
      return match;
    }

    cachedActiveModel = modelNames[0];
    return modelNames[0];
  } catch {
    return preferredModel;
  }
}

/**
 * Intelligent Rule-Based Career Guidance Fallback
 * Provides instant, high-quality, domain-specific advice when Ollama is slow,
 * cold-starting, or busy.
 */
function generateCareerAdvisorFallback({ prompt = '', context = {} }) {
  const student = context.student || {};
  const opp = context.opportunity || null;
  const studentName = student.name ? student.name.split(' ')[0] : 'Candidate';
  const targetRole = student.targetRole || 'Software Engineer';
  const studentSkills = Array.isArray(student.skills) ? student.skills : ['React', 'JavaScript', 'HTML/CSS', 'Node.js'];
  
  const oppTitle = opp?.title || targetRole;
  const requiredSkills = Array.isArray(opp?.requiredSkills) && opp.requiredSkills.length > 0 
    ? opp.requiredSkills 
    : ['React', 'TypeScript', 'Node.js', 'REST APIs', 'SQL'];
  const matchScore = opp?.matchScore ? `${opp.matchScore}%` : '72%';

  // Calculate matched vs missing skills
  const studentSkillsLower = studentSkills.map((s) => String(s).toLowerCase().trim());
  const matchedSkills = requiredSkills.filter((req) => 
    studentSkillsLower.some((cand) => cand.includes(req.toLowerCase()) || req.toLowerCase().includes(cand))
  );
  const missingSkills = requiredSkills.filter((req) => !matchedSkills.includes(req));

  const lowerPrompt = prompt.toLowerCase();

  // 1. Skill Gap / Fit Analysis / Opportunity trigger
  if (
    lowerPrompt.includes('skill gap') ||
    lowerPrompt.includes('analyze') ||
    lowerPrompt.includes('fit') ||
    lowerPrompt.includes('missing') ||
    lowerPrompt.includes('qualify') ||
    opp
  ) {
    const matchedDisplay = matchedSkills.length > 0 ? matchedSkills.join(', ') : studentSkills.slice(0, 3).join(', ');
    const missingDisplay = missingSkills.length > 0 ? missingSkills.join(', ') : 'Cloud Deployment, Testing, System Design';

    return `🎯 **Role Fit Analysis for ${oppTitle}** (Current Match: ${matchScore})

**✅ Your Strong Matched Skills:**
• ${matchedDisplay} — These directly contribute to your OpenPath Technical Match score.

**⚠️ Priority Growth Areas (Skill Gaps):**
• ${missingDisplay} — Bridging these will significantly increase your hiring eligibility.

**🚀 3-Step Action Plan:**
1. **Core Practice:** Dedicate 3-5 days to deep-dive into ${missingSkills[0] || 'the key missing technologies'} with hands-on exercises.
2. **Portfolio Feature:** Build a mini feature or micro-project combining ${matchedSkills[0] || 'your core stack'} with ${missingSkills[0] || 'the new skill'}.
3. **OpenPath Profile Update:** Add your verified milestone projects to your profile to boost your 5-factor match score above 80%!`;
  }

  // 2. Match Score Improvement
  if (lowerPrompt.includes('match score') || lowerPrompt.includes('algorithm') || lowerPrompt.includes('score')) {
    return `📈 **How to Boost Your OpenPath Match Score:**

OpenPath uses an explainable **5-Factor Matching Algorithm**:
1. **Technical Skills (40% Weight):** Add verified project proof for missing skills to capture maximum points.
2. **Academic Alignment (20% Weight):** Ensure your degree level, branch, and graduation year are fully documented.
3. **Location Compatibility (20% Weight):** Set your location preferences or enable Remote Opportunities to maximize geographic reach.
4. **Industry Interests (10% Weight):** Select targeted tags matching your desired sectors.
5. **Experience Level (10% Weight):** Highlight internships, open-source PRs, and hackathon projects.

💡 *Pro Tip: Bridging just 1-2 high-priority required skills typically pushes your match score from Good Match (50-79%) to High Match (80%+)!*`;
  }

  // 3. Project & Portfolio Roadmap
  if (lowerPrompt.includes('project') || lowerPrompt.includes('build') || lowerPrompt.includes('portfolio') || lowerPrompt.includes('roadmap')) {
    return `🛠️ **Recommended Portfolio Projects for ${targetRole}:**

To stand out to recruiters, build projects that demonstrate end-to-end engineering:
• **Full-Stack SaaS Dashboard:** Build an interactive portal using ${studentSkills.slice(0, 2).join(' + ')} with real-time analytics and authentication.
• **API Integration Service:** Develop a secure RESTful/GraphQL backend service with database indexing and caching.
• **Production Deployment:** Containerize your application using Docker and deploy with CI/CD automation on Render or Vercel.

📌 *Be sure to link your GitHub repository and live demo in your OpenPath profile!*`;
  }

  // 4. Interview Preparation
  if (lowerPrompt.includes('interview') || lowerPrompt.includes('mock') || lowerPrompt.includes('question')) {
    return `💼 **Technical Interview Prep Strategy for ${targetRole}:**

1. **Core Fundamentals:** Review core data structures, asynchronous programming, component lifecycle, and state management in ${studentSkills[0] || 'your primary stack'}.
2. **System & Architecture:** Be prepared to explain how your portfolio projects handle data persistence, API errors, and edge cases.
3. **Behavioral Questions (STAR Method):** Prepare 2-3 stories detailing how you resolved technical hurdles, collaborated in teams, or learned a new framework under a deadline.

🎯 *Would you like to practice a mock technical question right now?*`;
  }

  // 5. Default Encouraging Response
  return `👋 Hi ${studentName}! I am your OpenPath AI Career Mentor.

I'm calibrated to your profile as a **${targetRole}** with **${studentSkills.length} skills tracked** (${studentSkills.slice(0, 4).join(', ')}).

Here is how I can assist you right now:
• **Skill Gap Analysis:** Pinpoint missing requirements for any opportunity.
• **Targeted Learning:** Get step-by-step roadmaps to bridge critical skills.
• **Portfolio Projects:** Build high-impact projects that impress recruiters.
• **Interview Prep:** Practice questions tailored to your target roles.

What would you like to explore next?`;
}

/**
 * Main query function for OpenPath Local AI Agent.
 * Calls Ollama local endpoint with token limits and timeout.
 * Automatically falls back to intelligent career guidance if Ollama is slow/offline.
 */
export async function queryLocalAgent({ prompt, messages = [], systemPrompt, context = {} }) {
  const baseUrl = ENV.LOCAL_AI_BASE_URL || 'http://localhost:11434';
  const configuredModel = ENV.LOCAL_AI_MODEL || 'llama3.2:1b';
  const timeoutMs = ENV.LOCAL_AI_TIMEOUT || 45000;

  // 1. Format context into clear instructions
  let contextBlock = '';
  if (context.student) {
    contextBlock += `\nStudent Profile:
- Name: ${context.student.name || 'Candidate'}
- Target Role: ${context.student.targetRole || 'Software Engineer'}
- Current Skills: ${Array.isArray(context.student.skills) ? context.student.skills.join(', ') : 'None listed'}
- Experience Level: ${context.student.experienceLevel || 'Entry-Level'}`;
  }

  if (context.opportunity) {
    contextBlock += `\n\nTarget Opportunity:
- Role Title: ${context.opportunity.title || 'Role'}
- Required Skills: ${Array.isArray(context.opportunity.requiredSkills) ? context.opportunity.requiredSkills.join(', ') : 'None listed'}
- Current Match Score: ${context.opportunity.matchScore || 'N/A'}%`;
  }

  const basePersona = systemPrompt || 
    `You are the OpenPath AI Career Mentor. OpenPath provides transparent 5-factor matching (Skills 40%, Academic 20%, Location 20%, Industry 10%, Experience 10%). Provide encouraging, direct, and actionable advice to bridge skill gaps. Keep responses concise (under 180 words) using clean bullet points.`;

  const finalSystemPrompt = `${basePersona}\n\nContext:${contextBlock}\n\nInstructions: Provide concise, high-impact bullet points directly answering the user's career query.`;

  // 2. Prepare message list (including recent conversation history)
  const chatMessages = [
    { role: 'system', content: finalSystemPrompt },
  ];

  if (Array.isArray(messages) && messages.length > 0) {
    const recentHistory = messages.slice(-4).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content || m.text || '',
    }));
    chatMessages.push(...recentHistory);
  }

  // Ensure latest prompt is included as user message if not already at the end
  const lastMsg = chatMessages[chatMessages.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== prompt) {
    chatMessages.push({ role: 'user', content: prompt });
  }

  // 3. Detect best available model
  const activeModel = await getAvailableModel(baseUrl, configuredModel);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: activeModel,
        messages: chatMessages,
        keep_alive: '1h',
        options: {
          num_predict: 200,      // Keeps generation fast on CPU (typically 5-10s)
          num_thread: 4,         // Utilize 4 CPU threads for fast inference
          temperature: 0.6,
        },
        stream: false,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Local model server responded with status: ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.message?.content || data.response;

    if (!replyText || typeof replyText !== 'string' || !replyText.trim()) {
      throw new Error('Empty response from model');
    }

    return {
      success: true,
      reply: replyText.trim(),
      model: activeModel,
      source: 'ollama',
    };
  } catch (err) {
    clearTimeout(timeoutId);

    // Fallback: provide intelligent domain-aware career guidance
    const fallbackReply = generateCareerAdvisorFallback({ prompt, context });

    return {
      success: true,
      reply: fallbackReply,
      model: activeModel || configuredModel,
      source: 'fallback',
      notice: err.name === 'AbortError' 
        ? 'Response generated via OpenPath Career Intelligence (Local model busy)'
        : 'Response generated via OpenPath Career Intelligence',
    };
  }
}

/**
 * Stream responses token-by-token directly from Ollama.
 * Dispatches each generated token to onChunk callback in real-time (<500ms TTFT).
 */
export async function streamLocalAgent({ prompt, messages = [], systemPrompt, context = {}, onChunk }) {
  const baseUrl = ENV.LOCAL_AI_BASE_URL || 'http://localhost:11434';
  const configuredModel = ENV.LOCAL_AI_MODEL || 'llama3.2:1b';
  const timeoutMs = ENV.LOCAL_AI_TIMEOUT || 45000;

  let contextBlock = '';
  if (context.student) {
    contextBlock += `\nStudent Profile:
- Name: ${context.student.name || 'Candidate'}
- Target Role: ${context.student.targetRole || 'Software Engineer'}
- Current Skills: ${Array.isArray(context.student.skills) ? context.student.skills.join(', ') : 'None listed'}
- Experience Level: ${context.student.experienceLevel || 'Entry-Level'}`;
  }

  if (context.opportunity) {
    contextBlock += `\n\nTarget Opportunity:
- Role Title: ${context.opportunity.title || 'Role'}
- Required Skills: ${Array.isArray(context.opportunity.requiredSkills) ? context.opportunity.requiredSkills.join(', ') : 'None listed'}
- Current Match Score: ${context.opportunity.matchScore || 'N/A'}%`;
  }

  const basePersona = systemPrompt || 
    `You are the OpenPath AI Career Mentor. OpenPath provides transparent 5-factor matching (Skills 40%, Academic 20%, Location 20%, Industry 10%, Experience 10%). Provide encouraging, direct, and actionable advice to bridge skill gaps. Keep responses concise (under 180 words) using clean bullet points.`;

  const finalSystemPrompt = `${basePersona}\n\nContext:${contextBlock}\n\nInstructions: Provide concise, high-impact bullet points directly answering the user's career query.`;

  const chatMessages = [
    { role: 'system', content: finalSystemPrompt },
  ];

  if (Array.isArray(messages) && messages.length > 0) {
    const recentHistory = messages.slice(-4).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content || m.text || '',
    }));
    chatMessages.push(...recentHistory);
  }

  const lastMsg = chatMessages[chatMessages.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== prompt) {
    chatMessages.push({ role: 'user', content: prompt });
  }

  const activeModel = await getAvailableModel(baseUrl, configuredModel);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: activeModel,
        messages: chatMessages,
        keep_alive: '1h',
        options: {
          num_predict: 200,
          num_thread: 4,
          temperature: 0.6,
        },
        stream: true,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama stream error status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let tokenCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(Boolean);

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          const token = json.message?.content || '';
          if (token) {
            tokenCount++;
            onChunk(token);
          }
        } catch {}
      }
    }

    if (tokenCount === 0) {
      throw new Error('No tokens received from stream');
    }

    return { success: true, model: activeModel, source: 'ollama' };
  } catch (err) {
    clearTimeout(timeoutId);
    const fallbackText = generateCareerAdvisorFallback({ prompt, context });
    onChunk(fallbackText);
    return { success: true, model: activeModel || configuredModel, source: 'fallback' };
  }
}