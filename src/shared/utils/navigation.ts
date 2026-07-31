import type { Href, Router } from 'expo-router';

/**
 * Clears the current stack history, then replaces with `href`.
 * Use after terminal flows (cancel, trip complete) so Back cannot reopen them.
 */
export const resetTo = (router: Router, href: Href): void => {
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace(href);
};
