import React from 'react';

import { FindRideScreen } from '@/features/ride-search';

/** Office commute book-ride entry — reuses FindRideScreen in office mode. */
export default function OfficeCommuteSearchScreen() {
  return <FindRideScreen mode="office" />;
}
