/**
 * AI Engine — Helplytics AI
 * =========================
 * Local NLP heuristics for tag suggestions, urgency detection,
 * auto-categorization, extractive summarization, and helper matching.
 * No external API calls needed.
 */

// ─── Tag Taxonomy ────────────────────────────────────────────────
const TAG_TAXONOMY: Record<string, string[]> = {
  // Technical
  javascript: ["javascript", "js", "node", "nodejs", "react", "nextjs", "vue", "angular", "typescript", "ts"],
  python: ["python", "django", "flask", "fastapi", "pandas", "numpy", "pytorch", "tensorflow"],
  webdev: ["html", "css", "tailwind", "bootstrap", "frontend", "backend", "fullstack", "web", "website", "api", "rest"],
  mobile: ["mobile", "android", "ios", "flutter", "react native", "swift", "kotlin"],
  database: ["database", "sql", "nosql", "mongodb", "postgres", "mysql", "redis", "firebase"],
  devops: ["docker", "kubernetes", "aws", "azure", "gcp", "cloud", "ci/cd", "deployment", "linux", "server"],
  ai_ml: ["machine learning", "ai", "artificial intelligence", "deep learning", "nlp", "computer vision", "model"],
  git: ["git", "github", "version control", "merge", "branch", "pull request"],

  // Career
  resume: ["resume", "cv", "cover letter", "portfolio"],
  interview: ["interview", "behavioral", "technical interview", "whiteboard", "coding challenge"],
  job_search: ["job", "hiring", "career", "internship", "freelance", "remote work", "salary", "negotiate"],
  networking: ["networking", "linkedin", "connections", "mentorship", "mentor"],

  // Academic
  math: ["math", "calculus", "algebra", "statistics", "probability", "linear algebra"],
  writing: ["essay", "thesis", "research paper", "writing", "academic writing", "citation"],
  study: ["study", "exam", "test", "homework", "assignment", "deadline", "course"],
  science: ["physics", "chemistry", "biology", "lab", "experiment"],

  // Creative
  design: ["design", "ui", "ux", "figma", "sketch", "prototype", "wireframe", "user interface"],
  graphic: ["graphic design", "photoshop", "illustrator", "logo", "branding", "illustration"],
  video: ["video", "editing", "premiere", "after effects", "animation", "motion graphics"],
  music: ["music", "audio", "production", "mixing", "mastering"],

  // Life
  health: ["health", "fitness", "mental health", "wellness", "stress", "anxiety", "meditation"],
  finance: ["finance", "budget", "investing", "savings", "taxes", "financial", "money"],
  housing: ["housing", "apartment", "rent", "roommate", "moving", "relocation"],
  legal: ["legal", "law", "contract", "rights", "dispute"],
};

// ─── Category Keywords ───────────────────────────────────────────
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  technical: [
    "code", "bug", "error", "api", "server", "database", "deploy", "build",
    "programming", "software", "app", "website", "framework", "library",
    "function", "debug", "crash", "performance", "security", "authentication",
    "javascript", "python", "react", "node", "css", "html", "docker",
    "algorithm", "data structure", "testing", "git",
  ],
  career: [
    "job", "interview", "resume", "career", "salary", "promotion", "hiring",
    "internship", "freelance", "portfolio", "linkedin", "networking",
    "mentor", "professional", "workplace", "manager", "negotiate",
  ],
  academic: [
    "homework", "assignment", "exam", "test", "course", "class", "study",
    "research", "thesis", "paper", "professor", "university", "college",
    "school", "grade", "gpa", "lecture", "textbook", "lab",
  ],
  creative: [
    "design", "art", "music", "video", "photo", "illustration", "animation",
    "branding", "logo", "creative", "portfolio", "sketch", "prototype",
    "ui", "ux", "graphic", "film", "content", "writing",
  ],
  life: [
    "health", "fitness", "mental", "stress", "finance", "budget", "housing",
    "apartment", "relationship", "family", "travel", "food", "cooking",
    "legal", "insurance", "tax", "moving", "wellness",
  ],
};

// ─── Urgency Signals ─────────────────────────────────────────────
const URGENCY_SIGNALS = {
  critical: {
    keywords: ["asap", "emergency", "urgent", "immediately", "right now", "critical", "broken production", "down", "outage"],
    weight: 4,
  },
  high: {
    keywords: ["deadline", "tomorrow", "today", "tonight", "due soon", "time-sensitive", "blocking", "stuck", "hours left"],
    weight: 3,
  },
  medium: {
    keywords: ["this week", "few days", "soon", "need help", "struggling", "confused", "lost"],
    weight: 2,
  },
  low: {
    keywords: ["whenever", "no rush", "learning", "curious", "exploring", "just wondering", "someday", "eventually"],
    weight: 1,
  },
};

// ─── Public API ──────────────────────────────────────────────────

/**
 * Suggest tags based on description text.
 * Returns top matched tag categories.
 */
export function suggestTags(text: string): string[] {
  const lower = text.toLowerCase();
  const matched = new Set<string>();

  for (const [tag, keywords] of Object.entries(TAG_TAXONOMY)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matched.add(tag);
        break;
      }
    }
  }

  // Also extract individual significant words as potential tags
  const words = lower.split(/\s+/);
  const stopWords = new Set([
    "i", "me", "my", "we", "our", "you", "your", "he", "she", "it", "they",
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "during",
    "before", "after", "above", "below", "between", "and", "but", "or",
    "not", "no", "so", "if", "than", "too", "very", "just", "about",
    "also", "then", "that", "this", "what", "which", "who", "how", "when",
    "where", "why", "all", "each", "every", "both", "few", "more", "most",
    "other", "some", "such", "only", "own", "same", "need", "help",
    "want", "get", "got", "make", "know", "think", "try", "use",
    "really", "please", "thanks", "thank",
  ]);

  for (const word of words) {
    const clean = word.replace(/[^a-z0-9]/g, "");
    if (clean.length > 3 && !stopWords.has(clean)) {
      // Check if it's a known keyword in any taxonomy
      for (const keywords of Object.values(TAG_TAXONOMY)) {
        if (keywords.includes(clean) && !matched.has(clean)) {
          matched.add(clean);
        }
      }
    }
  }

  return Array.from(matched).slice(0, 8);
}

/**
 * Detect urgency level from description text.
 */
export function detectUrgency(text: string): "low" | "medium" | "high" | "critical" {
  const lower = text.toLowerCase();
  let maxWeight = 0;
  let detected: "low" | "medium" | "high" | "critical" = "medium";

  for (const [level, config] of Object.entries(URGENCY_SIGNALS)) {
    for (const keyword of config.keywords) {
      if (lower.includes(keyword)) {
        if (config.weight > maxWeight) {
          maxWeight = config.weight;
          detected = level as typeof detected;
        }
        break;
      }
    }
  }

  // Check for date patterns indicating urgency
  const datePatterns = /\b(today|tonight|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
  if (datePatterns.test(text) && maxWeight < 3) {
    detected = "high";
  }

  // Check for exclamation marks (many = higher urgency)
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations >= 3 && maxWeight < 3) {
    detected = "high";
  }

  return detected;
}

/**
 * Auto-categorize a request based on its title and description.
 */
export function autoCategorizе(title: string, description: string): "technical" | "career" | "academic" | "creative" | "life" | "other" {
  const combined = `${title} ${description}`.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      if (combined.includes(keyword)) {
        scores[category]++;
      }
    }
  }

  let maxScore = 0;
  let bestCategory = "other";

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  // Only assign if there's a meaningful match
  if (maxScore < 2) return "other";
  return bestCategory as "technical" | "career" | "academic" | "creative" | "life" | "other";
}

/**
 * Generate an extractive summary of the description.
 * Picks the most important 2-3 sentences.
 */
export function generateSummary(description: string): string {
  // Split into sentences
  const sentences = description
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  if (sentences.length <= 2) return description;

  // Score each sentence by keyword density and position
  const importantWords = new Set<string>();
  for (const keywords of Object.values(TAG_TAXONOMY)) {
    keywords.forEach((k) => importantWords.add(k));
  }
  for (const keywords of Object.values(CATEGORY_KEYWORDS)) {
    keywords.forEach((k) => importantWords.add(k));
  }

  const scored = sentences.map((sentence, index) => {
    const words = sentence.toLowerCase().split(/\s+/);
    let score = 0;

    // Keyword density
    for (const word of words) {
      if (importantWords.has(word.replace(/[^a-z]/g, ""))) {
        score += 2;
      }
    }

    // Position bonus (first sentence is usually important)
    if (index === 0) score += 3;
    if (index === sentences.length - 1) score += 1;

    // Length bonus (prefer medium-length sentences)
    if (words.length >= 5 && words.length <= 25) score += 1;

    return { sentence, score };
  });

  // Sort by score and take top 2-3
  scored.sort((a, b) => b.score - a.score);
  const topCount = Math.min(3, Math.ceil(sentences.length / 2));
  const topSentences = scored.slice(0, topCount);

  // Restore original order
  const origOrder = topSentences.sort(
    (a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence)
  );

  return origOrder.map((s) => s.sentence).join(" ");
}

/**
 * Match potential helpers based on request tags/category against user skills.
 * Returns a scoring function for sorting users.
 */
export function calculateHelperScore(
  userSkills: string[],
  requestTags: string[],
  requestCategory: string,
  userTrustScore: number
): number {
  let score = 0;
  const normalizedSkills = userSkills.map((s) => s.toLowerCase());
  const normalizedTags = requestTags.map((t) => t.toLowerCase());

  // Skill-tag overlap
  for (const tag of normalizedTags) {
    if (normalizedSkills.includes(tag)) {
      score += 10;
    }
    // Partial match
    for (const skill of normalizedSkills) {
      if (skill.includes(tag) || tag.includes(skill)) {
        score += 5;
      }
    }
  }

  // Category match — check if user has skills in the category's keyword space
  const categoryKeywords = CATEGORY_KEYWORDS[requestCategory] || [];
  for (const skill of normalizedSkills) {
    if (categoryKeywords.includes(skill)) {
      score += 3;
    }
  }

  // Trust score bonus (normalized to 0-5)
  score += (userTrustScore / 100) * 5;

  return score;
}

/**
 * Calculate trust score change after completing a help request.
 */
export function calculateTrustScoreChange(
  currentScore: number,
  isSuccessful: boolean
): number {
  if (isSuccessful) {
    // Diminishing returns as score increases
    const gain = Math.max(1, Math.floor((100 - currentScore) / 10));
    return Math.min(100, currentScore + gain);
  } else {
    // Small penalty for incomplete help
    return Math.max(0, currentScore - 2);
  }
}

/**
 * Determine badges based on user stats.
 */
export function calculateBadges(helpGiven: number, trustScore: number): string[] {
  const badges: string[] = [];

  if (helpGiven >= 1) badges.push("first_help");
  if (helpGiven >= 10) badges.push("helper_10");
  if (helpGiven >= 25) badges.push("helper_25");
  if (helpGiven >= 50) badges.push("helper_50");
  if (helpGiven >= 100) badges.push("helper_100");
  if (trustScore >= 70) badges.push("trusted");
  if (trustScore >= 85) badges.push("highly_trusted");
  if (trustScore >= 95) badges.push("mentor");

  return badges;
}

/**
 * Badge display metadata.
 */
export const BADGE_INFO: Record<string, { label: string; emoji: string; description: string }> = {
  first_help: { label: "First Help", emoji: "🌱", description: "Helped someone for the first time" },
  helper_10: { label: "Rising Star", emoji: "⚡", description: "Helped 10 people" },
  helper_25: { label: "Community Hero", emoji: "🦸", description: "Helped 25 people" },
  helper_50: { label: "Legend", emoji: "🏆", description: "Helped 50 people" },
  helper_100: { label: "Centurion", emoji: "💯", description: "Helped 100 people" },
  trusted: { label: "Trusted", emoji: "💎", description: "Trust score above 70" },
  highly_trusted: { label: "Highly Trusted", emoji: "🛡️", description: "Trust score above 85" },
  mentor: { label: "Mentor", emoji: "👑", description: "Trust score above 95" },
};
