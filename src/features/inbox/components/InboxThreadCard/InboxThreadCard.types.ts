import type { InboxThread } from '../../types';

export interface InboxThreadCardProps {
  thread: InboxThread;
  onPress: (thread: InboxThread) => void;
}
