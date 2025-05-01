# Profession Portal

A Next.js portal with Firebase Authentication (Google & Email), protected dashboard, and backend API proxy example (Finnhub). Built with shadcn/ui and deployable to Firebase Hosting.

---

## 🚀 Local Development

```bash
bun install
bun run dev
```
Visit [http://localhost:3000](http://localhost:3000)

Your credentials are set in `.env.local`.

---

## 🔥 Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```sh
   npm install -g firebase-tools
   ```
2. **Login to Firebase**
   ```sh
   firebase login
   ```
3. **Build Next.js**
   ```sh
   bun run build
   ```
4. **Deploy to Firebase**
   ```sh
   firebase deploy
   ```

This will deploy your Next.js (SSR) app as a Firebase Cloud Function and serve via Hosting.

---

## 🤖 GitHub Integration

1. Create a GitHub repo, push this code.
2. In the [Firebase Console](https://console.firebase.google.com/), open your project.
3. Go to **Hosting > Get started** > **GitHub Actions** and enable deploy-on-push.
4. Approve workflows and set up any env secrets if needed.

---

## 🌐 Structure & Features
- **/src/app/page.tsx**: Landing/login/registration, uses Firebase Auth.
- **/src/app/dashboard/page.tsx**: Protected page. Demo for secure API requests.
- **/src/app/api/finnhub/route.ts**: Example API route; validates Firebase ID token and proxies Finnhub request.
- **/src/lib/firebase.ts**: Firebase SDK client initialization.
- **shadcn/ui**: Modern UI components.

---

## 🛂 Environment
- Local: `.env.local` (already present).
- For CI: Set secrets accordingly if customizing build.

---

## 🏁 Next Steps
- Extend dashboard features as needed.
- Adjust authentication or add roles/permissions.
- Add CI/CD as needed via GitHub.
- See [Firebase Hosting Docs](https://firebase.google.com/docs/hosting/)

---

Questions? Suggestions? Just ask!
