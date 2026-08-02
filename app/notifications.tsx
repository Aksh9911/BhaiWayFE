import React from 'react';

import { SCREENS } from '@/config';
import { ComingSoonScreen } from '@/shared/components';

export default function NotificationsRoute() {
  return (
    <ComingSoonScreen
      title={SCREENS.notifications.title}
      message="Your notifications will appear here soon."
      icon="notifications-outline"
    />
  );
}
