# Personal Portfolio — Full Stack (React-free HTML/CSS/JS + Node/Express + MongoDB)

A complete full-stack portfolio: projects are stored in MongoDB, served through an
Express REST API, and rendered by a hand-built, dependency-free frontend with an
"editor/terminal" visual theme (Fraunces + Inter + JetBrains Mono, dark UI, signal-green accent).

```
portfolio/
├── backend/      Express API + MongoDB models (deploy to Render)
│   ├── models/Project.js
│   ├── models/Message.js
│   ├── routes/projects.js
│   ├── routes/messages.js
│   ├── server.js
│   ├── seed.js          ← run once to populate sample projects
│   └── .env.example
└── frontend/      Static site (deploy to Vercel)
    ├── index.html
    ├── css/style.css
    └── js/{config.js, main.js}
```

## 1. MongoDB Atlas (5 min)

1. Go to https://cloud.mongodb.com → create a free cluster (you said you already have an account, so just create/open a cluster).
2. **Database Access** → add a user with a password.
3. **Network Access** → Add IP Address → "Allow access from anywhere" (`0.0.0.0/0`) — fine for an intern demo project.
4. **Connect** → "Drivers" → copy the connection string, looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`

## 2. Backend — run locally first (5 min)

```bash
cd backend
npm install
cp .env.example .env
# paste your MongoDB URI into .env as MONGODB_URI=...
npm run dev          # or: npm start
```

Populate sample projects (edit seed.js with your real projects first, optional):

```bash
node seed.js
```

Visit `http://localhost:5000/api/health` → should show `dbState: 1` (connected).
Visit `http://localhost:5000/api/projects` → should show your projects as JSON.

## 3. Frontend — run locally

`frontend/js/config.js` already points at `http://localhost:5000`. Just open
`frontend/index.html` in a browser (or use VS Code's "Live Server" extension)
and you should see projects load into the **Work** section.

## 4. Deploy backend to Render (10 min)

1. Push the `backend/` folder to a GitHub repo (or the whole `portfolio/` repo — Render lets you set a root directory).
2. On Render → **New** → **Web Service** → connect your repo.
3. Settings:
   - **Root Directory:** `backend` (if monorepo)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment variables** (Render dashboard → Environment):
   - `MONGODB_URI` = your Atlas connection string
   - `CLIENT_ORIGIN` = your Vercel URL (you can set this after step 5, or use `*` for now)
5. Deploy. You'll get a URL like `https://your-app.onrender.com`. Test
   `https://your-app.onrender.com/api/projects`.

> Render free tier sleeps after inactivity — first request after idle can take ~30s. Normal for a free demo project.

## 5. Deploy frontend to Vercel (5 min)

1. Before deploying, edit `frontend/js/config.js`:
   ```js
   const API_BASE_URL = "https://your-app.onrender.com";
   ```
2. Push `frontend/` to GitHub (or the same repo).
3. On Vercel → **Add New Project** → import the repo → set **Root Directory** to `frontend`.
4. Framework preset: **Other** (it's static HTML/CSS/JS — no build step needed).
5. Deploy. You'll get `https://your-portfolio.vercel.app`.

## 6. Final connection

Go back to Render → set `CLIENT_ORIGIN` to your real Vercel URL (comma-separate
multiple origins if needed) → redeploy, so CORS only allows your frontend.

## Customize before submitting

- Replace "Your Name" everywhere in `index.html`, update social links and email.
- Edit `backend/seed.js` with your real projects, re-run `node seed.js`.
- Swap the favicon / add a screenshot per project (`image` field — any public image URL).
- Update the About section stats and the Skills lists to match your actual experience.

## API Reference

| Method | Route               | Description              |
|--------|----------------------|---------------------------|
| GET    | `/api/projects`      | List all projects         |
| GET    | `/api/projects/:id`  | Get one project           |
| POST   | `/api/projects`      | Create a project          |
| PUT    | `/api/projects/:id`  | Update a project          |
| DELETE | `/api/projects/:id`  | Delete a project           |
| POST   | `/api/messages`      | Submit contact form        |
| GET    | `/api/messages`      | List contact messages (admin)|
| GET    | `/api/health`        | Health check / DB status   |

Total realistic time: ~30 min setup/customization + deploy waiting time — comfortably inside 2 hours.
