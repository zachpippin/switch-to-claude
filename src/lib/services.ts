import { ServiceInfo } from './types';

export const services: ServiceInfo[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    color: '#10A37F',
    icon: 'ð¢',
    description: 'OpenAI\'s ChatGPT (Plus, Team, or Free)',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    color: '#4285F4',
    icon: 'ðµ',
    description: 'Google\'s Gemini (formerly Bard)',
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    color: '#0078D4',
    icon: 'ð£',
    description: 'Microsoft Copilot (formerly Bing Chat)',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    color: '#20808D',
    icon: 'ð¹',
    description: 'Perplexity AI search assistant',
  },
];

export const exportGuides: Record<string, { steps: string[]; notes: string; fileType: string }> = {
  chatgpt: {
    steps: [
      'Go to chatgpt.com and log in to your account',
      'Click your profile icon in the top-right corner',
      'Select "Settings" from the dropdown menu',
      'Click "Data controls" in the left sidebar',
      'Click "Export data" and confirm with "Confirm export"',
      'Check your email â you\'ll receive a download link within a few minutes',
      'Download the ZIP file and extract it',
      'Find the conversations.json file inside â that\'s what you\'ll upload here',
    ],
    notes: 'The export typically takes 1-5 minutes. The file contains all your conversations in JSON format.',
    fileType: 'conversations.json',
  },
  gemini: {
    steps: [
      'Go to takeout.google.com and sign in',
      'Click "Deselect all" to start fresh',
      'Scroll down and check "Gemini Apps" (or search for it)',
      'Click "Next step" at the bottom',
      'Choose "Export once" and your preferred file type (ZIP)',
      'Click "Create export" and wait for the download link',
      'Download and extract the ZIP file',
      'Look for JSON files inside the Gemini Apps folder',
    ],
    notes: 'Google Takeout exports can take a few hours for large accounts. You\'ll get an email when it\'s ready.',
    fileType: 'Gemini Apps/*.json',
  },
  copilot: {
    steps: [
      'Go to copilot.microsoft.com and sign in',
      'Click the menu icon (three dots) in the top right',
      'Select "Activity" or "Chat history"',
      'Look for an export or download option',
      'If no export exists, you can copy conversations manually',
      'Alternatively, check your Microsoft account privacy dashboard at account.microsoft.com/privacy',
      'Request a data export and download when ready',
    ],
    notes: 'Microsoft Copilot\'s export options may vary. The privacy dashboard export is the most reliable method.',
    fileType: '.json files',
  },
  perplexity: {
    steps: [
      'Go to perplexity.ai and log in',
      'Click your profile icon in the bottom-left',
      'Go to "Settings"',
      'Look for "Account" or "Data" section',
      'Find and click "Export data" or "Download my data"',
      'Download the exported file when it\'s ready',
    ],
    notes: 'If a direct export isn\'t available, you can access your conversation history through the Library section.',
    fileType: '.json files',
  },
};
