# BhaiWay — Backend Requirements & API Specification

**Product:** BhaiWay (corporate carpool / office commute platform)  
**Client:** Expo React Native app (`BhaiWayFE`)  
**API base URL (default):** `https://api.bhaiway.dev/v1`  
**Document purpose:** Spec for implementing backend services and REST APIs so the mobile app can replace local mocks with live data.

---

## 1. Product overview

BhaiWay lets professionals:

- Authenticate with phone OTP
- Find and book **outstation carpool** rides
- Publish **outstation** rides
- Publish / find **daily office commute** rides
- Complete trip lifecycle (tracking, OTP start, payment, review)
- Manage **profile**, **wallet**, **vehicles (garage)**, **corporate verification**, **referrals**, **support**, and **legal**

### Current client state

| Area | Status |
|------|--------|
| Auth (OTP + complete profile) | Contract defined; mock/live switchable |
| Home dashboard | Contract defined; mock/live switchable |
| Ride search, booking, trip, chat | UI + mocks only |
| Offer ride / commute publish | Local drafts / in-memory store |
| Profile ecosystem | UI + static data |
| Places / maps routing | Google Places + OSRM (not BhaiWay API) |

---

## 2. Technical conventions

### 2.1 Transport

- REST over HTTPS
- JSON request/response bodies (UTF-8)
- Multipart for images/documents (avatar, RC, corporate ID)
- Timeout expected by client: **15s** (`EXPO_PUBLIC_API_TIMEOUT_MS`)

### 2.2 Authentication

- After OTP verify, API returns a **Bearer token**
- Client sends: `Authorization: Bearer <token>`
- Protect all endpoints except:
  - `POST /auth/otp/request`
  - `POST /auth/otp/verify`
  - Public legal content (optional)
- Recommend JWT access token (+ refresh token later; not in client today)

### 2.3 Error shape (client expects)

```json
{
  "status": 400,
  "code": "INVALID_OTP",
  "message": "The OTP you entered is incorrect.",
  "details": null
}
```

Common codes:

| Code | HTTP | When |
|------|------|------|
| `INVALID_OTP` | 400 | Wrong OTP |
| `OTP_EXPIRED` | 400 | Verification id expired |
| `VALIDATION_ERROR` | 400 | Field validation |
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `FORBIDDEN` | 403 | Not allowed |
| `NOT_FOUND` | 404 | Resource missing |
| `CONFLICT` | 409 | Duplicate / invalid state |
| `RATE_LIMITED` | 429 | OTP spam |
| `INTERNAL_ERROR` | 500 | Unexpected |

### 2.4 Money & locale

- Currency: **INR (₹)**
- Amounts: integer **paise** preferred server-side; client currently uses rupee numbers (e.g. `850`). Document both; recommend returning `{ amount: 85000, currency: "INR", display: "₹850" }` and migrate client later. Until then, return **number in rupees** as the app does today.
- Phone: India only for v1 — `dialCode: "+91"`, 10-digit `phoneNumber`
- OTP: **4 digits**, resend cooldown **30 seconds**

### 2.5 IDs & timestamps

- Resource IDs: UUID strings
- Timestamps: ISO-8601 UTC
- Display labels (`dateLabel`, `timeLabel`) can be computed client-side; prefer sending raw ISO + timezone

---

## 3. Domain entities

### 3.1 User

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | UUID |
| `phoneNumber` | string | 10 digits |
| `dialCode` | string | `+91` |
| `fullName` | string \| null | Null until profile complete |
| `email` | string \| null | |
| `gender` | `male` \| `female` \| `other` \| null | |
| `avatarUrl` | string \| null | CDN URL |
| `rating` | number | e.g. 4.8 |
| `trustScore` | number | 0–100 |
| `isCorporateVerified` | boolean | |
| `createdAt` | string | ISO |

### 3.2 Vehicle

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `userId` | string | Owner |
| `category` | `sedan` \| `suv` \| `hatchback` \| `luxury` | |
| `model` | string | e.g. Honda City |
| `color` | string | |
| `plateNumber` | string | Normalized uppercase |
| `displayName` | string | e.g. White Swift Dzire |
| `rcStatus` | `approved` \| `pending` \| `rejected` | |
| `rcDocumentUrl` | string \| null | |
| `createdAt` | string | |

### 3.3 Ride (listing — outstation publish)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `driverId` | string | |
| `vehicleId` | string | |
| `rideType` | `regular` \| `assured` | Assured = premium guarantee |
| `origin` | Location | |
| `destination` | Location | |
| `departureAt` | string | ISO |
| `availableSeats` | number | 1–6 |
| `maxTwoInBackSeat` | boolean | |
| `womenOnly` | boolean | |
| `pricePerSeat` | number | INR |
| `status` | `draft` \| `published` \| `full` \| `cancelled` \| `completed` | |
| `preferences` | Preference[] | |
| `features` | Feature[] | AC, luggage, etc. |

### 3.4 CommuteRide (recurring office)

Same as ride plus:

| Field | Type |
|-------|------|
| `recurringDays` | (`mon`…`sun`)[] |
| `returningBack` | boolean |
| `officeLocation` | Location |
| `startLocation` | Location |

### 3.5 Location

```ts
{
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  area?: string;
}
```

### 3.6 Booking

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | |
| `rideId` | string | or `commuteRideId` |
| `mode` | `outstation` \| `commute` | |
| `riderId` | string | |
| `seats` | number | |
| `rideType` | `regular` \| `assured` | |
| `promoCode` | string \| null | |
| `fare` | FareBreakdown | |
| `paymentMethodId` | PaymentMethodId | |
| `paymentStatus` | `pending` \| `paid` \| `failed` \| `refunded` | |
| `status` | BookingStatus | see below |
| `startOtp` | string | Shown to rider for trip start |
| `createdAt` | string | |

**BookingStatus:**  
`confirmed` → `driver_arriving` → `ongoing` → `completed` | `cancelled`

### 3.7 FareBreakdown

```ts
{
  rideFare: number;
  platformFee: number;
  promoDiscount: number;
  assuredFee: number; // 0 or 50 (assured)
  taxes?: number;
  total: number;
}
```

### 3.8 Wallet

| Field | Type |
|-------|------|
| `userId` | string |
| `balance` | number |
| `currency` | `INR` |

### 3.9 CorporateVerification

| Field | Type |
|-------|------|
| `id` | string |
| `userId` | string |
| `companyName` | string |
| `workEmail` | string |
| `frontIdUrl` | string |
| `backIdUrl` | string \| null |
| `status` | `pending` \| `approved` \| `rejected` |

### 3.10 Referral

| Field | Type |
|-------|------|
| `code` | string | Unique per user |
| `rewardAmount` | number | e.g. 50 |
| `totalEarned` | number | |
| `history[]` | `{ id, inviteeName, channel, status: successful\|waiting, amount, createdAt }` |

### 3.11 Support

- Ticket: `{ id, title, status: resolved\|in_progress\|open, submittedAt, categoryId }`
- Conversation message: `{ id, sender: user\|agent, text, createdAt, status?: sent\|read }`

### 3.12 Review

```ts
{
  bookingId: string;
  driverRating: number; // 1-5
  vehicleRating: number; // 1-5
  driverTags: string[];
  vehicleTags: string[];
  comments: string;
}
```

---

## 4. User journeys (must support)

### A. Auth

1. Request OTP → Verify OTP → receive token + `isNewUser`
2. If new: Complete profile (name, email, gender, optional avatar) → Home
3. If returning: Home

### B. Find outstation ride → trip

1. Search (origin, destination, date/time, passengers)
2. List results (filter `regular` / `assured`)
3. Ride details → Review booking (+ promo) → Choose payment → Confirm
4. Booked confirmation
5. Live tracking (ETA, start OTP)
6. Ongoing trip → Complete → Post-trip payment (if pay-after) → Review
7. Alternate: Cancel with reason; Chat with driver

### C. Publish outstation ride

1. Choose ride type → Fill route, seats, price, preferences → Publish listing

### D. Office commute

1. Publish recurring commute OR search commute rides
2. Book → payment → trip lifecycle (same as B where applicable)
3. Optional corporate verification for trust

### E. Profile

1. View profile (wallet, earnings, badges)
2. Garage: list / add vehicle / RC upload
3. Refer & earn
4. Help & support chat / tickets
5. Legal policies
6. Delete account (reason + feedback)

---

## 5. API catalog

Base path: `/v1`

All authenticated endpoints require Bearer token unless noted.

---

### 5.1 Auth (already contracted in app)

#### `POST /auth/otp/request` — public

**Request**

```json
{
  "phoneNumber": "9876543210",
  "dialCode": "+91"
}
```

**Response `200`**

```json
{
  "verificationId": "ver_abc123",
  "expiresInSeconds": 300
}
```

#### `POST /auth/otp/verify` — public

**Request**

```json
{
  "verificationId": "ver_abc123",
  "code": "1234",
  "phoneNumber": "9876543210"
}
```

**Response `200`**

```json
{
  "userId": "usr_…",
  "token": "eyJ…",
  "isNewUser": true
}
```

#### `POST /auth/profile` — auth

**Request**

```json
{
  "fullName": "Arjun Sharma",
  "email": "arjun@company.com",
  "gender": "male",
  "avatarUri": null
}
```

> Prefer multipart later: `avatar` file field. Until then accept optional URL or skip.

**Response `200`** — `UserProfile`

```json
{
  "id": "usr_…",
  "fullName": "Arjun Sharma",
  "email": "arjun@company.com",
  "gender": "male",
  "avatarUri": "https://cdn…/avatar.jpg"
}
```

#### Recommended additions

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/auth/logout` | Invalidate token |
| `POST` | `/auth/otp/resend` | Resend OTP (rate-limited) |

---

### 5.2 Users / profile

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/users/me` | Full profile for Master Profile screen |
| `PATCH` | `/users/me` | Update name/email/gender |
| `POST` | `/users/me/avatar` | Multipart image upload → `{ avatarUri }` |
| `POST` | `/users/me/delete` | Soft-delete + reason |

**`GET /users/me` response (suggested)**

```json
{
  "id": "usr_…",
  "fullName": "Arjun Sharma",
  "phoneLabel": "+91 98765 43210",
  "email": "arjun@company.com",
  "avatarUri": "https://…",
  "rating": 4.8,
  "trustScore": 98,
  "badges": [
    { "id": "corporate", "label": "Corporate ID", "tone": "success" }
  ],
  "walletBalance": 850,
  "paymentMethodsSubtitle": "UPI, Cards linked",
  "driverEarnings": {
    "total": 2450,
    "breakdown": [
      { "label": "Regular Rides", "amount": 1850 },
      { "label": "Assured Rides", "amount": 600 }
    ],
    "insight": "You earned ₹600 from Assured Rides…"
  }
}
```

**`POST /users/me/delete`**

```json
{
  "reasonId": "competitor",
  "feedback": "Moving to another app"
}
```

`reasonId`: `competitor` | `privacy` | `not_needed` | `complex`

---

### 5.3 Home

#### `GET /home/dashboard` — auth (already contracted)

**Response**

```json
{
  "location": { "label": "Sector 62", "city": "Noida" },
  "cardIds": ["outstation", "office", "publish"]
}
```

Client maps `cardIds` to local service card catalog.

---

### 5.4 Rides (outstation listings)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/rides` | Publish outstation ride |
| `GET` | `/rides/:id` | Listing details |
| `PATCH` | `/rides/:id` | Update seats/price/status |
| `DELETE` | `/rides/:id` | Cancel listing |
| `POST` | `/rides/search` | Search available rides |

**`POST /rides` body** (from app draft)

```json
{
  "rideType": "regular",
  "origin": { "name": "…", "address": "…", "latitude": 28.5, "longitude": 77.3 },
  "destination": { "name": "…", "address": "…", "latitude": 28.6, "longitude": 77.2 },
  "departureAt": "2026-08-01T08:30:00+05:30",
  "availableSeats": 3,
  "maxTwoInBackSeat": true,
  "womenOnly": false,
  "pricePerSeat": 450,
  "vehicleId": "veh_…"
}
```

**`POST /rides/search` body**

```json
{
  "origin": { "latitude": 28.5, "longitude": 77.3 },
  "destination": { "latitude": 28.6, "longitude": 77.2 },
  "departureDate": "2026-08-01",
  "departureTime": "08:30",
  "passengers": 1,
  "filter": "assured"
}
```

**Search item shape (matches app `RideResultItem`)**

```json
{
  "id": "ride_…",
  "rideType": "assured",
  "driver": {
    "id": "usr_…",
    "name": "Rohit",
    "rating": 4.9,
    "verified": true,
    "yearsDriving": 5,
    "avatarUri": "https://…"
  },
  "price": 499,
  "originalPrice": 549,
  "departureTime": "08:30 AM",
  "carModel": "Swift Dzire",
  "seatsLeft": 2,
  "ac": true,
  "luggage": "2 bags",
  "originCity": "Noida",
  "destinationCity": "Delhi",
  "distanceKm": 28,
  "durationLabel": "55 min",
  "preferences": [{ "id": "quiet", "label": "Quiet", "icon": "volume-mute" }],
  "features": [{ "id": "ac", "label": "AC", "icon": "snow" }]
}
```

---

### 5.5 Commute rides

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/commute-rides` | Publish recurring commute |
| `GET` | `/commute-rides/mine` | Driver’s published commutes |
| `POST` | `/commute-rides/search` | Find matching commutes |
| `GET` | `/commute-rides/:id` | Details |
| `PATCH` / `DELETE` | `/commute-rides/:id` | Update / unpublish |

**Publish body**

```json
{
  "startLocation": { "name": "…", "address": "…", "latitude": 0, "longitude": 0 },
  "officeLocation": { "name": "…", "address": "…", "latitude": 0, "longitude": 0 },
  "departureTime": "08:30",
  "seats": 3,
  "recurringDays": ["mon", "tue", "wed", "thu", "fri"],
  "returningBack": true,
  "pricePerSeat": 80,
  "vehicleId": "veh_…"
}
```

Search response may include `matchPercent`, `vehicleColor`, `seatsNote` (app commute cards).

---

### 5.6 Bookings

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/bookings/:rideId/preview` | Review booking screen data |
| `POST` | `/bookings` | Create booking |
| `GET` | `/bookings` | List (`?status=upcoming\|past`) |
| `GET` | `/bookings/:id` | Details / booked screen |
| `POST` | `/bookings/:id/cancel` | Cancel |
| `GET` | `/bookings/:id/tracking` | Live tracking |
| `POST` | `/bookings/:id/start` | Driver verifies start OTP |
| `GET` | `/bookings/:id/ongoing` | Ongoing trip |
| `POST` | `/bookings/:id/complete` | Mark complete |
| `GET` | `/bookings/:id/receipt` | Trip completed / fare |
| `POST` | `/bookings/:id/payment` | Settle payment |
| `POST` | `/bookings/:id/reviews` | Submit review |
| `GET`/`POST` | `/bookings/:id/messages` | Driver chat |

**`POST /bookings`**

```json
{
  "rideId": "ride_…",
  "mode": "outstation",
  "seats": 1,
  "promoCode": "BHAIWAY10",
  "paymentMethodId": "upi_gpay"
}
```

`paymentMethodId` values used in UI: `wallet` | `gpay` | `phonepe` | `visa` | `pay-after-ride`

**Cancel**

```json
{
  "reasonId": "plan-changed",
  "comments": "Meeting postponed"
}
```

`reasonId`: `plan-changed` | `wait-time` | `another-ride` | `driver-not-responding` | `other`

**Assured rule:** Assured fee (₹50) is non-refundable on cancel — encode in business rules + cancel messaging.

**Tracking response (app fields)**

```json
{
  "rideId": "…",
  "rideType": "assured",
  "statusLabel": "Driver on the way",
  "etaMinutes": 8,
  "startOtp": "4481",
  "driver": { "name": "…", "phone": "…", "avatarUri": "…", "vehicleLabel": "…", "plateNumber": "…" },
  "pickup": { "label": "…", "latitude": 0, "longitude": 0 },
  "dropoff": { "label": "…", "latitude": 0, "longitude": 0 }
}
```

> Prefer WebSocket/SSE later for live location; REST polling OK for MVP (every 5–10s).

---

### 5.7 Promo

| Method | Path |
|--------|------|
| `POST` | `/promo/validate` |

```json
{ "code": "BHAIWAY10", "rideId": "…", "amount": 499 }
```

```json
{ "valid": true, "discount": 24, "message": "Promo applied" }
```

---

### 5.8 Vehicles (My Garage)

| Method | Path |
|--------|------|
| `GET` | `/vehicles` |
| `POST` | `/vehicles` |
| `GET` | `/vehicles/:id` |
| `PATCH` | `/vehicles/:id` |
| `DELETE` | `/vehicles/:id` |
| `POST` | `/vehicles/:id/rc-document` | Multipart |

**`POST /vehicles`**

```json
{
  "category": "sedan",
  "model": "Honda City",
  "color": "White",
  "plateNumber": "DL 3C AB 1234"
}
```

RC upload sets `rcStatus: "pending"` until admin/auto verify → `approved`.

---

### 5.9 Corporate verification

| Method | Path |
|--------|------|
| `POST` | `/verifications/corporate` |
| `GET` | `/verifications/me` |

Multipart or JSON + pre-uploaded URLs:

```json
{
  "companyName": "Acme Pvt Ltd",
  "workEmail": "name@acme.com",
  "frontIdUrl": "https://…",
  "backIdUrl": "https://…"
}
```

On approve: set `isCorporateVerified` + profile badge.

---

### 5.10 Wallet & payments

| Method | Path |
|--------|------|
| `GET` | `/wallet` |
| `POST` | `/wallet/topup` |
| `POST` | `/wallet/redeem` |
| `GET` | `/payment-methods` |
| `POST` | `/payment-methods` |
| `DELETE` | `/payment-methods/:id` |

Integrate UPI/PG (Razorpay/Cashfree/etc.) for production; return `orderId` / `paymentLink` for client checkout.

---

### 5.11 Referrals

| Method | Path |
|--------|------|
| `GET` | `/referrals/me` |
| `POST` | `/referrals/apply` | On signup (optional) |

```json
{
  "code": "ARJUN2023",
  "rewardPerSuccess": 50,
  "totalEarned": 150,
  "history": [
    {
      "id": "ref_1",
      "name": "Rohan M.",
      "detail": "Joined via link • 12 Oct 2023",
      "amountLabel": "₹50 Earned",
      "status": "successful"
    }
  ]
}
```

---

### 5.12 Support

| Method | Path |
|--------|------|
| `GET` | `/support/categories` |
| `GET` | `/support/tickets` |
| `POST` | `/support/tickets` |
| `GET` | `/support/tickets/:id` |
| `POST` | `/support/conversations` | Start chat |
| `GET`/`POST` | `/support/conversations/:id/messages` |

---

### 5.13 Legal

| Method | Path |
|--------|------|
| `GET` | `/legal/policies` |
| `GET` | `/legal/policies/:id` |

Policy IDs used in app:  
`terms` | `privacy` | `safety` | `community` | `licenses` | `cookies` | `deletion`

---

### 5.14 Notifications (screen stub today)

| Method | Path |
|--------|------|
| `GET` | `/notifications` |
| `POST` | `/notifications/:id/read` |
| Push | FCM / APNs for trip events |

---

## 6. Business rules (must implement)

1. **OTP:** 4 digits; expire ~5 min; rate-limit request/resend.
2. **Assured rides:** Higher price / fee; cancel messaging must state assured fee non-refundable (₹50).
3. **Seats:** Cannot book more than `seatsLeft`; decrement on book; restore on cancel (if policy allows).
4. **Women-only listings:** Only female-gender profiles can book (enforce server-side).
5. **Corporate commute:** Prefer verified users; do not hard-block MVP unless product requires.
6. **Start OTP:** Generate per booking; driver submits to start trip.
7. **Pay after ride:** Allow `paymentStatus=pending` until receipt payment.
8. **Wallet:** Deduct atomically on pay; prevent negative balance.
9. **Referrals:** Credit referrer only after invitee completes profile (or first ride — decide & document).
10. **Account delete:** Soft-delete; anonymize PII; cancel future bookings; keep financial records as required by law.
11. **RC / corporate docs:** Store privately; scan for malware; retention policy.

---

## 7. Non-functional requirements

| Area | Requirement |
|------|-------------|
| Availability | 99.5% MVP |
| Latency | p95 < 500ms for read APIs |
| Security | TLS, hashed OTP secrets, encrypted docs at rest |
| PII | Phone/email encrypted or restricted access |
| Audit | Log booking/payment/verification state changes |
| Idempotency | `Idempotency-Key` on `POST /bookings` and payments |
| Pagination | `?cursor=` or `?page=&limit=` on lists |
| Observability | Request ID header echoed to client |

---

## 8. Out of scope for BhaiWay backend

These stay client/third-party:

- Google Places autocomplete & geocoding
- Google Maps tiles / SDK
- OSRM route distance/duration (or replace with Maps Directions API server-side later)

Backend should still **store** selected lat/lng/address on rides and bookings.

---

## 9. Implementation priority

### Phase 1 — Core (unblock real usage)

1. Auth (already contracted) + session persistence on client later  
2. `GET /users/me`  
3. `POST /rides/search` + `GET` ride details  
4. Booking preview → create → list (My Rides)  
5. Cancel booking  

### Phase 2 — Trip lifecycle

6. Tracking + start OTP + ongoing + complete  
7. Payment settle + reviews  
8. Driver chat  

### Phase 3 — Supply side

9. Publish outstation `/rides`  
10. Commute publish + search  

### Phase 4 — Trust & growth

11. Vehicles + RC  
12. Corporate verification  
13. Wallet / payment methods  
14. Referrals  
15. Support chat/tickets  
16. Legal CMS  
17. Notifications / push  

---

## 10. Suggested service modules

| Service | Owns |
|---------|------|
| **Auth Service** | OTP, tokens, profile complete |
| **User Service** | Profile, delete, badges |
| **Catalog / Ride Service** | Outstation + commute listings, search |
| **Booking Service** | Bookings, cancel, trip state machine |
| **Payment / Wallet Service** | Wallet, PG, promo |
| **Trust Service** | Vehicles, RC, corporate KYC |
| **Engagement Service** | Referrals, support, notifications |
| **Media Service** | Uploads → CDN URLs |

---

## 11. Existing client endpoint map

Already in `src/network/endpoints.ts`:

```
POST /auth/otp/request
POST /auth/otp/verify
POST /auth/profile
GET  /home/dashboard
```

All other APIs in this document are **new** and should be added to the client `ENDPOINTS` map when implemented.

---

## 12. Acceptance checklist for backend MVP

- [ ] OTP signup/login returns valid Bearer token  
- [ ] New user must complete profile before using rides  
- [ ] Search returns rides near origin/destination for date  
- [ ] Booking reduces seats and appears in My Rides upcoming  
- [ ] Cancel updates inventory and booking status  
- [ ] Tracking returns OTP + ETA  
- [ ] Trip complete produces receipt  
- [ ] Errors follow `ApiError` shape  
- [ ] All protected routes reject missing/invalid tokens  

---

*Generated from the BhaiWayFE mobile codebase to guide backend API design. Align field names with client TypeScript types under `src/features/*/types` where possible to minimize FE rework.*
