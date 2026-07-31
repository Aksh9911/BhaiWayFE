import { Redirect } from 'expo-router';

import { ROUTES } from '@/config';

export default function LoginIndex() {
  return <Redirect href={ROUTES.phone} />;
}
