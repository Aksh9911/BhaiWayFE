/**
 * App navigation entrypoint (BhaiWay architecture checklist).
 * Expo Router owns file-based routes under `app/`; this module centralizes
 * route constants, screen indexes, and navigation helpers.
 *
 * Prefer: `import { ROUTES, resetTo, TAB_ROUTES } from '@/navigation'`
 */

export {
  AUTH_SCREEN_INDEX,
  AUTH_SCREENS,
  OFFER_RIDE_SCREEN_INDEX,
  OFFER_RIDE_SCREENS,
  MY_RIDES_SCREEN_INDEX,
  MY_RIDES_SCREENS,
  OFFICE_COMMUTE_SCREEN_INDEX,
  OFFICE_COMMUTE_SCREENS,
  RIDE_SEARCH_SCREEN_INDEX,
  RIDE_SEARCH_SCREENS,
  ROOT_SCREEN_INDEX,
  ROOT_SCREENS,
  ROUTES,
  SCREENS,
} from '@/config';

export type { AppRoute, ScreenDefinition, ScreenId, ScreenPath } from '@/config';

export { resetTo } from '@/shared/utils/navigation';

import { ROUTES as APP_ROUTES } from '@/config';

/** Main bottom-tab destinations used by AppFooter. */
export const TAB_ROUTES = {
  home: APP_ROUTES.home,
  rides: APP_ROUTES.myRides,
  inbox: APP_ROUTES.inbox,
  profile: APP_ROUTES.profile,
} as const;

export type MainTabId = keyof typeof TAB_ROUTES;
