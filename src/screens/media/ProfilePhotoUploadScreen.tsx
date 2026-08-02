import React from 'react';

import { MediaUploadExampleScreen } from './MediaUploadExampleScreen';

export const ProfilePhotoUploadScreen = () => (
  <MediaUploadExampleScreen
    kind="profile"
    title="Profile Photo"
    subtitle="Square crop, compressed to ~600×600, max 2 MB. Uploads to bhaiway/profile."
    submitLabel="Save profile photo URL"
  />
);
