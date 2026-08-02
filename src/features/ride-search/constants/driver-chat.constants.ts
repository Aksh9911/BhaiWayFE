import type { ChatMessage, DriverChatProfile } from '../types';

export const DRIVER_CHAT_SCREEN = {
  onlineLabel: 'Online',
  todayLabel: 'Today',
  inputPlaceholder: 'Type a message...',
  moreTitle: 'More',
  moreMessage: 'More chat actions will be available soon.',
  attachTitle: 'Attachment',
  attachMessage: 'File attachments will be available soon.',
} as const;

export const DRIVER_CHAT_QUICK_REPLIES = [
  'On my way',
  'Wait 5 mins',
  'Where are you?',
] as const;

export const getDriverChatMock = (params: {
  driverName?: string;
  carModel?: string;
}): { profile: DriverChatProfile; messages: ChatMessage[] } => {
  const name = params.driverName?.trim() || 'Arjun';
  const car = params.carModel?.trim();
  const vehicleLabel =
    !car
      ? 'White Honda City'
      : /passenger|·|ka-|seat/i.test(car)
        ? car
        : `White ${car}`;

  return {
    profile: {
      name,
      vehicleLabel,
      isOnline: true,
    },
    messages: [
      {
        id: 'm1',
        sender: 'driver',
        text: 'I have arrived at the pickup point.',
        timeLabel: '10:42 AM',
      },
      {
        id: 'm2',
        sender: 'driver',
        text: "I'm waiting near Gate No. 3.",
        timeLabel: '10:42 AM',
      },
      {
        id: 'm3',
        sender: 'user',
        text: "Great, I'm coming in 2 minutes.",
        timeLabel: '10:43 AM',
        status: 'read',
      },
      {
        id: 'm4',
        sender: 'user',
        text: 'I see your car.',
        timeLabel: '10:44 AM',
        status: 'read',
      },
    ],
  };
};

export const getDriverChatPath = (params: {
  driverName?: string;
  carModel?: string;
}) => ({
  pathname: '/ride-search/driver-chat' as const,
  params: {
    driverName: params.driverName ?? '',
    carModel: params.carModel ?? '',
  },
});

export const formatChatTime = (date = new Date()): string =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
