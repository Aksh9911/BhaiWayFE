# DemoData common files

Folder: `src/DemoData/files`

| File | Purpose |
|------|---------|
| `demoData.common.ts` | Shared constants: sheet ID, headers, ID starts, roles, storage keys |
| `UserDetails.csv` | Header template for UserDetails |
| `Vehicles.csv` | Header template for Vehicles |
| `Notifications.csv` | Header template for Notifications (per user) |
| `ChatThreads.csv` | Header template for ChatThreads (inbox, per user) |
| `WalletTransactions.csv` | Header template for wallet credits/debits (per user) |
| `BankAccounts.csv` | Header template for linked bank accounts (per user) |
| `google-sheet-apps-script.js` | Apps Script to deploy for sheet writes |
| `index.ts` | Barrel export — `import { … } from '@/DemoData/files'` |

## Tabs
1. **UserDetails** — one row per user  
2. **Vehicles** — many vehicles per user  
3. **Notifications** — many alerts per user (`Mobile` / `UserID`)  
4. **ChatThreads** — inbox conversations per user  
5. **ChatMessages** — messages per `ThreadKey` + user  
6. **WalletTransactions** — real add-money / withdraw (and future ride) ledger per user  
7. **PublishedRides** / **RideBookings** — published offers and bookings  
8. **BankAccounts** — withdrawal bank accounts per user (`gid` default `8`)  

## Import

```ts
import {
  DEMO_GOOGLE_SHEET_ID,
  WALLET_TRANSACTIONS_SHEET_HEADERS,
} from '@/DemoData/files';
```
