# 👁 Eye Drop Schedule

A web application for ophthalmologists and optometrists to create printable eye drop schedules and prescriptions for patients.

Glaucoma management depends heavily on consistent, accurate medication use. This tool was built to improve patient compliance with glaucoma eye drop regimens, reduce errors on both the provider and patient side, and decrease confusion around complex multi-drop schedules — making it easier for patients to understand exactly what to take, when, and in which eye.

**Live app:** [fahadbutt-git.github.io/eyedrop-app](https://fahadbutt-git.github.io/eyedrop-app)

---

## Features

### 🗂 Formulary
A fully editable drug reference table containing all available eye drop medications.
- View brand name, generic name, default frequency, default drop count, and LU code for every medication
- Add new medications at any time
- Edit any field inline — changes instantly reflect across the entire app
- Delete medications no longer in use
- Sort by any column, search by brand name, generic name, or LU code

### 💊 Drop Selection
Configure a patient's personalized eye drop regimen.
- Separate columns for Right Eye (OD) and Left Eye (OS)
- Up to 5 drops per eye
- Selecting a medication auto-populates frequency and drop count from the Formulary
- All values remain manually editable after auto-population
- Generic name and LU code displayed beneath each selected drug
- Patient name and address fields carry through to the Schedule and Rx

### 📅 Schedule
Generates a printable 1-month medication tracking calendar.
- Only shows columns for selected medications — no empty columns
- Each drug column header displays name, frequency, and drop count
- Checkbox cells (☐) per day matching the prescribed frequency
- Sundays and Saturdays highlighted for easy reading
- Select any month and year
- Print-optimized landscape layout

### 📋 Rx Template
Generates a printable prescription pad page.
- Physician name, clinic, address, phone, and license number auto-fill the header
- Selected medications auto-populate with generic name, dosing instructions, and eye designation
- If the same drug is prescribed for both eyes it is automatically consolidated as "Both Eyes (OU)"
- LU codes displayed on the prescription for insurance reference
- Refill authorization selector (0–5)
- Additional notes field for patient instructions
- Signature line at the bottom

---

## Running Locally

git clone https://github.com/fahadbutt-git/eyedrop-app.git
cd eyedrop-app
npm install
npm run dev

Open http://localhost:5173 in your browser.

## Deploying

npm run deploy

This builds the app and publishes it to GitHub Pages automatically.

---

## Built With

- React
- Vite
- GitHub Pages

---

## Medications Included

25 glaucoma and ocular hypertension medications including Xalatan, Lumigan-RC, DuoTrav, Combigan, Cosopt, Alphagan-P, Simbrinza, and more. All medications, dosing defaults, and LU codes are editable through the Formulary tab.
