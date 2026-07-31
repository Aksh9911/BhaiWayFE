import type { SupportChatMessage } from '../types';

export const SUPPORT_CHAT_SCREEN = {
  title: 'Support',
  dateLabel: 'Today',
  typingLabel: 'Support is typing',
  inputPlaceholder: 'Type a message...',
  attachTitle: 'Attachments',
  attachMessage: 'File attachments will be available soon.',
} as const;

export const SUPPORT_AGENT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCTF3zrJ-u69R62iAo01T-qkR_ATTwq0NbHlMJrhSJFV8rG7D1GGs7Cr-z_5lvJsKJ3-6Qv0hhJ4ksCorjEDY4yusOY3EdGxoXWootBUrMXgVfnjHywnLPQZwQoKx_-YT0vOh0ZwDKmXz9aKsfn1cUs2wJD_sveyQvJSh_h1MhaEmU8nuDpP8wjuHMOODzqrVzKrRwyNu8fyqki9Oj6ZMsBCtml8yOmPB4pvsc6qgk220fpfJh5gHZeQZNBTk4rv1VI37CgYUsLnRU';

export const DEFAULT_SUPPORT_CHAT_MESSAGES: readonly SupportChatMessage[] = [
  {
    id: 's1',
    sender: 'support',
    text: 'Hi Arjun! I see you have a query about your recent ride #BW-88291. How can I help you today?',
    timeLabel: '10:14 AM',
  },
  {
    id: 'u1',
    sender: 'user',
    text: 'Hi, I was charged twice for this trip.',
    timeLabel: '10:15 AM',
    status: 'read',
  },
  {
    id: 's2',
    sender: 'support',
    text: "I'm sorry to hear that, Arjun. Let me check the payment logs for #BW-88291. One moment please.",
    timeLabel: '10:16 AM',
  },
] as const;

export const formatSupportChatTime = (date = new Date()): string =>
  date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
