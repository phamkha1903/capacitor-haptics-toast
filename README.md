# Haptics & Toast — UX Lab (Vite + React + Capacitor)

Project prepared for the assignment: Bài 8 - Haptics & Toast UX Lab.
It uses @capacitor/haptics and @capacitor/toast plugins.

## Quick steps (copy/paste)

1. Install node dependencies
   ```bash
   npm install
   ```

2. Run web dev server (fast feedback)
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

3. Initialize Capacitor (only once)
   ```bash
   npx cap init "HapticsToast" com.example.hapticstoast --web-dir=dist
   ```
   If you prefer interactive, run `npx cap init` and answer prompts.
   Make sure `capacitor.config.json` has "webDir": "dist"

4. Add Android platform
   ```bash
   npx cap add android
   ```

5. Build web assets -> copy to native
   ```bash
   npm run build
   npx cap copy android
   # or npx cap sync android  (sync installs native plugins too)
   ```

6. Open Android Studio and run (emulator or device)
   ```bash
   npx cap open android
   ```

## Important notes / troubleshooting

- After installing any Capacitor plugin, run `npx cap sync` to update native projects.
- If Capacitor complains it cannot find webDir: run `npm run build` first (Vite outputs to dist by default).
- Android needs VIBRATE permission for vibration to work. Add to `android/app/src/main/AndroidManifest.xml`:
  ```xml
  <uses-permission android:name="android.permission.VIBRATE" />
  ```
  (most templates already include it)

- On web (desktop browsers) haptics are not available usually; this app uses `navigator.vibrate` fallback or `alert` for toast.
- Haptics testing is most reliable on a real Android device. Emulators may not simulate vibration correctly.

## What is implemented
- Impact haptics (Light/Medium/Heavy)
- Selection haptics (selectionStart/changed/end fallback)
- Notification haptics (Success/Warning/Error)
- Toast messages on actions
- Form submit triggers selection + toast
- Logs of recent actions for demo

## Checklist professor grading (map to rubric)
- Minimal requirements (4pts): implemented impact, selection, notification, toast, form submit.
- UI stable and non crashing (2pts): simple UI, error fallbacks.
- Permissions handling (2pts): mention vibration permission; `npx cap sync` used.
- Bonus (2pts): small logs, clear README.

---
If you want, I can also:
- create a `.zip` file ready to download (with this project), or
- run through any error message you get step-by-step.
