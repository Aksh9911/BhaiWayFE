# Make app data appear in Google Sheets

Your sheet link is correct:
https://docs.google.com/spreadsheets/d/1W_2ZuTbhrlMKuArAov4E5hzH11LtGs_s6xtiI98nj6w/edit?usp=sharing

The app **reads** this sheet, but **cannot write** into it from Expo Go until you add a free Google Apps Script webhook.

---

## Option A — Paste CSV now (works immediately)

1. In Google Sheets row 1, ensure headers end with: **ProfilePicture | RC | CorporateID**
2. In the app: **Profile → Local Demo Data → Sheet**
3. Confirm your rows are listed there (local storage)
4. Tap **CSV** → Share / copy
5. Open the Google Sheet → click cell **A1** → Paste

You will then see the data (including Cloudinary URLs) when you open the sheet in the browser.

---

## Option B — Auto write (recommended)

### 1. Open Apps Script on YOUR sheet
1. Open the Google Sheet (link above)
2. **Extensions → Apps Script**
3. Delete any placeholder code
4. Paste the full script from:  
   `src/DemoData/sheet/appsScriptTemplate.ts`  
   (the string `USER_DETAILS_SHEET_APPS_SCRIPT`)

### 2. Deploy Web App
1. Click **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy** → **Authorize**
6. Copy the **Web app URL**  
   (looks like `https://script.google.com/macros/s/XXXX/exec`)

### 3. Put URL in `.env`
```bash
EXPO_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

### 4. Restart Expo
```bash
npx expo start -c
```

### 5. In the app
**Profile → Local Demo Data → Push**

New profiles will then insert into the Google Sheet automatically.

---

## Why the browser sheet looks empty
Profile data is saved on the **phone** first.  
Until you paste CSV (**Option A**) or set the webhook (**Option B**), Google’s website will only show the header row.
