





# 🗳️ Social Polling App

[![GitHub Repo stars](https://img.shields.io/github/stars/shreyasmulay23/social-polling-app?style=flat-square)](https://github.com/shreyasmulay23/social-polling-app/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shreyasmulay23/social-polling-app?style=flat-square)](https://github.com/shreyasmulay23/social-polling-app/network)
[![Top Lang](https://img.shields.io/github/languages/top/shreyasmulay23/social-polling-app?style=flat-square)](https://github.com/shreyasmulay23/social-polling-app)
[![Last Commit](https://img.shields.io/github/last-commit/shreyasmulay23/social-polling-app?style=flat-square)](https://github.com/shreyasmulay23/social-polling-app/commits/main)
[![Website Status](https://img.shields.io/website?url=http%3A//social-polling-app-seven.vercel.app)](https://img.shields.io/website?url=http%3A//social-polling-app-seven.vercel.app/)

Create, vote, and engage with real-time polls. Built with **Next.js**, **Supabase**, and **Tailwind CSS**. Features real-time updates, authentication, and interactive UI.

---

## 📸 Screenshots

| Home                            | Poll                              | Results                              |
|---------------------------------|-----------------------------------|--------------------------------------|
| ![Home](./screenshots/home.jpg) | ![Poll](./screenshots/poll_1.jpg) | ![Results](./screenshots/poll_3.jpg) |

---

## 🔗 Live Demo

👉 [Live on Vercel](https://social-polling-app-seven.vercel.app)

---

## 🚀 Features

- 🔐 User authentication (Supabase)
- 🧑‍🤝‍🧑 Create and vote on polls
- 📊 Real-time vote updates via Supabase Realtime
- 🖼️ Clean, responsive UI (TailwindCSS + ShadCN)
- 🧠 Smart percentage calculations
- 🔄 Real-time update for poll edits and deletions
---

## 🧰 Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org)
- [Supabase (Auth, Database, Realtime)](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.dev/)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org)

---

## 🛠️ Local Development

### 1. Clone the repository

```bash

git clone https://github.com/shreyasmulay/social-polling-app.git

cd social-polling-app
```
### 2. Install Dependencies
```bash

npm install

# or

yarn install
```
### 3. Set up environment variables
```bash

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_role_key
```

### 4. Run the development server
```bash

npm run dev
```
App should be running at http://localhost:3000.

## 📦 Folder Structure

```
/app
  └── (auth, dashboard, poll pages)
/components
  └── (PollCard, VoteForm, etc.)
/lib
  └── (supabase -- client.ts, server.ts, utils.ts)
/api
  └── poll, vote - REST API handlers
```

📦 Deployment
---
This app is automatically deployed using Vercel.
- Push to main → auto deploys to production 
- Push to other branches → deploys preview environments

🙌 Acknowledgements
---
- Inspired by real-time voting apps and community feedback tools 
- Thanks to Supabase and Vercel for the amazing developer tools

📄 License
---
MIT License © Shreyas Mulay

- Pull requests are welcome! Please open an issue first to discuss changes. 
- Let me know if you'd like to auto-generate screenshots from your app or if you want a separate `CONTRIBUTING.md` too?

💡 Future Improvements
---

- Dark Mode Support
- Poll Expiry Timers
- Pagination or Infinite Scroll
- Sharing Polls via Link or QR
- Unit tests using Jest and React Testing Library

### 🐞 Known Issues

- 🐢 **Real-time updates on poll creation are delayed for the poll creator**. Other users see the new poll instantly via Supabase subscriptions, but the creator may need to refresh. (WIP)
- 🕒 **Voting feedback is delayed for the user who casts the vote**. Other users see the updated vote count instantly, but the voter may notice a brief lag before their vote appears in the UI. (WIP)
- ✏️ **Poll updates (title + options) reflect partially for the creator**. The title updates instantly, but changes to poll options take time to appear unless refreshed. Other users see both updates in real time.
- 🧪 **No automated tests yet** — currently, no unit/integration test coverage. (WIP)
