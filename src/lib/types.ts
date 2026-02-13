export type AIService = 'chatgpt' | 'gemini' | 'copilot' | 'perplexity';

export interface ServiceInfo {
  id: AIService;
  name: string;
  color: string;
  icon: string;
  description: string;
}

export interface ParsedConversation {
  title: string;
  messageCount: number;
  dateRange: string;
  topics: string[];
  summary: string;
}

export interface MigrationAnalysis {
  totalConversations: number;
  totalMessages: number;
  dateRange: string;
  topTopics: string[];
  conversationCategories: {
    category: string;
    count: number;
    percentage: number;
  }[];
  userProfile: {
    interests: string[];
    commonTasks: string[];
    communicationStyle: string;
    expertise: string[];
  };
  conversations: ParsedConversation[];
}

export type WizardStep = 'landing' | 'select-source' | 'export-guide' | 'upload' | 'analyzing' | 'results' | 'claude-setup' | 'complete';
