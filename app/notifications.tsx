import React from 'react';
import { ComingSoonScreen } from '@/shared/components';
import { SCREENS } from '@/config';

export default function NotificationsRoute() {
  return (
    <ComingSoonScreen
      title={SCREENS.notifications.title}
      message="Your notifications will appear here soon."
      icon="notifications-outline"
      footerActiveTab="inbox"
    />
  );
}
