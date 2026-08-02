# Cloudinary Integration (BhaiWay)

## Security rules

1. **Never** put `API Secret` in the mobile app, `EXPO_PUBLIC_*` vars, or git.
2. Mobile uploads use an **unsigned upload preset** only.
3. Asset **delete** / signed uploads must run on the **backend**.
4. If an API secret was shared in chat or screenshots, **rotate it** in Cloudinary Console.

## Install

```bash
npx expo install expo-image-manipulator expo-document-picker expo-file-system
```

## Environment

Add to `.env` (already sketched in `.env.example`):

```bash
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=mzh4sidd
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bhaiway_upload
```

Defaults in `src/config/cloudinary.ts` match these values. Upload URL:

`https://api.cloudinary.com/v1_1/mzh4sidd/image/upload`

Create the unsigned preset in Cloudinary:

1. Settings → Upload → Upload presets → Add upload preset  
2. Signing mode: **Unsigned**  
3. Preset name: `bhaiway_upload` (must match config)  
4. Folder: leave empty / Dynamic (app sends `folder`)  
5. Save, then restart Expo: `npx expo start -c`

## Folder map

Uploads send a `folder` field to Cloudinary. Folders are created automatically on first upload.

| Kind | Folder | Media Library path |
|------|--------|--------------------|
| Profile photo | `bhaiway/profile` | `bhaiway` → `profile` → `user1.jpg` |
| Driving licence | `bhaiway/documents/dl` | `bhaiway` → `documents` → `dl` → `dl123.jpg` |
| Vehicle RC | `bhaiway/documents/rc` | `bhaiway` → `documents` → `rc` → `rc123.jpg` |

```ts
import { uploadFile } from '@/services/cloudinary';

await uploadFile({ uri, kind: 'profile' }); // → bhaiway/profile
await uploadFile({ uri, kind: 'dl' });      // → bhaiway/documents/dl
await uploadFile({ uri, kind: 'rc' });      // → bhaiway/documents/rc
```

`useUpload({ kind: 'profile' | 'dl' | 'rc' })` resolves the same folders automatically.

## File map

| Path | Role |
|------|------|
| `src/config/cloudinary.ts` | Client Cloudinary config (no secret) |
| `src/types/cloudinary.ts` | Request/response types + error class |
| `src/services/cloudinary/upload.ts` | Single reusable `uploadFile` |
| `src/services/cloudinary/delete.ts` | `deleteFile(publicId)` via backend |
| `src/hooks/useUpload.ts` | Pick → validate → compress → upload |
| `src/utils/imageCompression.ts` | Resize / square crop / JPEG compress |
| `src/utils/fileValidation.ts` | Format + size checks |
| `src/shared/constants/uploadFolders.ts` | Folder paths |
| `src/shared/constants/uploadTypes.ts` | Per-kind limits / mime / sources |
| `src/shared/utils/feedback.ts` | User-facing upload alerts |
| `src/shared/components/ImageUploader/` | UI + progress |
| `src/features/media/api/media.api.ts` | Persist `secure_url` to backend |
| `src/screens/media/` | Example Profile / DL / RC screens |

## Example routes

- `/upload-profile-photo`
- `/upload-dl`
- `/upload-rc`

## Usage (any screen)

```tsx
import { useUpload } from '@/hooks/useUpload';
import { saveProfilePhotoUrl } from '@/features/media';

const { pickAndUpload, progress, isUploading, result } = useUpload({
  kind: 'profile',
  onUploaded: saveProfilePhotoUrl,
});

// Camera / gallery / files depending on kind
await pickAndUpload('gallery');
```

Or drop-in UI:

```tsx
<ImageUploader
  kind="dl"
  title="Driving License"
  onUploaded={saveDrivingLicenseUrl}
/>
```

## Backend expectations

### Save asset after upload

`POST /media/assets`

```json
{
  "kind": "profile",
  "secureUrl": "https://res.cloudinary.com/…",
  "publicId": "bhaiway/profile/abc",
  "format": "jpg",
  "bytes": 184320
}
```

Store **only** Cloudinary URL / public id in your DB.

### Delete asset (signed on server)

`POST /media/cloudinary/delete`

```json
{ "publicId": "bhaiway/profile/abc" }
```

Server uses Cloudinary Admin API with the **API secret**.

## Limits

| Asset | Max size | Formats | Notes |
|-------|----------|---------|-------|
| Profile | 2 MB | JPG/PNG | Square crop ~600×600 |
| DL / RC | 5 MB | JPG/PNG/PDF | Compressed for images |
