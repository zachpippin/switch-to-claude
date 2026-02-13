import { MigrationAnalysis, ParsedConversation, AIService } from './types';

interface ChatGPTMessage {
  id: string;
  author: { role: string };
  content: { parts?: string[] };
  create_time: number | null;
}

interface ChatGPTConversation {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, { message: ChatGPTMessage | null }>;
}

function extractTopics(text: string): string[] {
  const topicKeywords: Record<string, string[]> = {
    'Programming': ['code', 'python', 'javascript', 'react', 'api', 'function', 'debug', 'programming', 'software', 'developer', 'typescript', 'html', 'css', 'database', 'sql', 'git'],
    'Writing': ['write', 'essay', 'article', 'blog', 'story', 'content', 'draft', 'edit', 'grammar', 'copy', 'creative writing', 'email'],
    'Research': ['research', 'study', 'paper', 'academic', 'analysis', 'data', 'statistics', 'survey', 'literature'],
    'Business': ['business', 'strategy', 'marketing', 'sales', 'startup', 'revenue', 'customer', 'product', 'market', 'investor'],
    'Education': ['learn', 'explain', 'teach', 'course', 'student', 'tutorial', 'homework', 'exam', 'study'],
    'Creative': ['design', 'art', 'music', 'image', 'creative', 'generate', 'brainstorm', 'idea', 'concept'],
    'Data Analysis': ['data', 'chart', 'graph', 'csv', 'excel', 'spreadsheet', 'analytics', 'metrics', 'dashboard'],
    'Career': ['resume', 'interview', 'job', 'career', 'linkedin', 'salary', 'hiring', 'portfolio'],
    'Health & Fitness': ['health', 'diet', 'exercise', 'nutrition', 'medical', 'wellness', 'fitness', 'mental health'],
    'Travel': ['travel', 'trip', 'flight', 'hotel', 'itinerary', 'destination', 'vacation'],
    'Cooking': ['recipe', 'cook', 'food', 'meal', 'ingredient', 'kitchen', 'bake'],
    'Finance': ['finance', 'invest', 'stock', 'budget', 'tax', 'crypto', 'money', 'savings'],
    'Legal': ['legal', 'law', 'contract', 'agreement', 'compliance', 'policy', 'regulation'],
  };

  const lower = text.toLowerCase();
  const found: [string, number][] = [];

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    const matchCount = keywords.filter(k => lower.includes(k)).length;
    if (matchCount > 0) {
      found.push([topic, matchCount]);
    }
  }

  return found
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);
}

function detectCommunicationStyle(messages: string[]): string {
  const avgLength = messages.reduce((sum, m) => sum + m.length, 0) / Math.max(messages.length, 1);
  const hasQuestions = messages.filter(m => m.includes('?')).length / Math.max(messages.length, 1);
  const hasCodeBlocks = messages.filter(m => m.includes('```') || m.includes('function') || m.includes('def ')).length > 0;

  const traits: string[] = [];

  if (avgLength > 200) traits.push('detailed');
  else if (avgLength > 50) traits.push('moderate');
  else traits.push('concise');

  if (hasQuestions > 0.5) traits.push('inquisitive');
  if (hasCodeBlocks) traits.push('technical');

  return traits.join(', ') || 'conversational';
}

function categorizeConversations(conversations: ParsedConversation[]): { category: string; count: number; percentage: number }[] {
  const categoryMap: Record<string, number> = {};

  for (const conv of conversations) {
    const mainTopic = conv.topics[0] || 'General';
    categoryMap[mainTopic] = (categoryMap[mainTopic] || 0) + 1;
  }

  const total = conversations.length;
  return Object.entries(categoryMap)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function parseChatGPT(data: ChatGPTConversation[]): MigrationAnalysis {
  const conversations: ParsedConversation[] = [];
  let totalMessages = 0;
  const allUserMessages: string[] = [];
  let earliestDate = Infinity;
  let latestDate = 0;

  for (const conv of data) {
    const messages: string[] = [];
    const userMessages: string[] = [];
    let convMessageCount = 0;

    if (conv.mapping) {
      for (const node of Object.values(conv.mapping)) {
        if (node.message?.content?.parts) {
          const text = node.message.content.parts.join(' ').trim();
          if (text) {
            messages.push(text);
            convMessageCount++;
            if (node.message.author?.role === 'user') {
              userMessages.push(text);
              allUserMessages.push(text);
            }
          }
        }
      }
    }

    if (conv.create_time) {
      earliestDate = Math.min(earliestDate, conv.create_time);
      latestDate = Math.max(latestDate, conv.update_time || conv.create_time);
    }

    totalMessages += convMessageCount;

    const allText = messages.join(' ');
    const topics = extractTopics(allText);

    conversations.push({
      title: conv.title || 'Untitled conversation',
      messageCount: convMessageCount,
      dateRange: conv.create_time
        ? new Date(conv.create_time * 1000).toLocaleDateString()
        : 'Unknown',
      topics,
      summary: userMessages.slice(0, 2).join(' ').substring(0, 150) + '...',
    });
  }

  const allTopics = conversations.flatMap(c => c.topics);
  const topicCounts = allTopics.reduce<Record<string, number>>((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([t]) => t);

  const dateRange = earliestDate < Infinity
    ? `${new Date(earliestDate * 1000).toLocaleDateString()} â ${new Date(latestDate * 1000).toLocaleDateString()}`
    : 'Unknown';

  return {
    totalConversations: conversations.length,
    totalMessages,
    dateRange,
    topTopics,
    conversationCategories: categorizeConversations(conversations),
    userProfile: {
      interests: topTopics.slice(0, 4),
      commonTasks: topTopics.slice(0, 3).map(t => `${t}-related tasks`),
      communicationStyle: detectCommunicationStyle(allUserMessages),
      expertise: topTopics.slice(0, 3),
    },
    conversations: conversations.sort((a, b) => b.messageCount - a.messageCount).slice(0, 20),
  };
}

export function parseGenericJSON(data: unknown): MigrationAnalysis {
  // Try to extract conversations from various formats
  const conversations: ParsedConversation[] = [];
  let totalMessages = 0;

  const items = Array.isArray(data) ? data : [data];

  for (const item of items) {
    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;
      const title = (obj.title || obj.name || obj.subject || 'Imported conversation') as string;
      const messages = (obj.messages || obj.conversation || obj.content || []) as unknown[];
      const msgCount = Array.isArray(messages) ? messages.length : 1;

      totalMessages += msgCount;

      conversations.push({
        title: String(title),
        messageCount: msgCount,
        dateRange: 'Imported',
        topics: ['General'],
        summary: JSON.stringify(item).substring(0, 150) + '...',
      });
    }
  }

  return {
    totalConversations: conversations.length || 1,
    totalMessages: totalMessages || items.length,
    dateRange: 'Imported data',
    topTopics: ['General'],
    conversationCategories: [{ category: 'General', count: conversations.length || 1, percentage: 100 }],
    userProfile: {
      interests: ['Various topics'],
      commonTasks: ['General assistance'],
      communicationStyle: 'conversational',
      expertise: [],
    },
    conversations,
  };
}

export function parseUploadedFile(content: string, service: AIService): MigrationAnalysis {
  try {
    const data = JSON.parse(content);

    if (service === 'chatgpt' && Array.isArray(data)) {
      return parseChatGPT(data);
    }

    return parseGenericJSON(data);
  } catch {
    // If JSON parse fails, try to create a basic analysis from text
    const lines = content.split('\n').filter(l => l.trim());
    return {
      totalConversations: 1,
      totalMessages: lines.length,
      dateRange: 'Imported',
      topTopics: extractTopics(content),
      conversationCategories: [{ category: 'Imported', count: 1, percentage: 100 }],
      userProfile: {
        interests: extractTopics(content).slice(0, 3),
        commonTasks: ['General assistance'],
        communicationStyle: 'conversational',
        expertise: [],
      },
      conversations: [{
        title: 'Imported data',
        messageCount: lines.length,
        dateRange: 'Imported',
        topics: extractTopics(content),
        summary: content.substring(0, 150) + '...',
      }],
    };
  }
}
