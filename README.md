# Safety Alerts App

![GitHub repo size](https://img.shields.io/github/repo-size/romhenri/safety-alerts-app?style=for-the-badge)

> Campus safety incident reporting and guard coordination. Students report incidents with location on a map; the **UniShield** FastAPI backend stores them in SQLite while a Next.js front end lists history, shows live maps, and gives guards a hub to confirm or close incidents.

### How to run

Run the **API** and the **web app** in two terminals. The UI expects the API at `http://127.0.0.1:8000` (see `front-end` proxy / `BACKEND_PROXY_URL` if you change the port).

#### Back-end (FastAPI)

Prerequisites: **Python 3.11+** (3.13 works with the pinned stack).

```bash
cd back-end
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS / Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- Health check: `GET http://127.0.0.1:8000/health`
- OpenAPI docs: `http://127.0.0.1:8000/docs`

#### Front-end (Next.js)

Prerequisites: **Node.js** (LTS recommended) and **npm**.

```bash
cd front-end
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

<hr>

### Languages and Technologies

<div display="inline_block">
<a href="https://nextjs.org/" target="_blank"><img align="center" alt="Next.js" height="54" width="54" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg"></a>
<a href="https://react.dev/" target="_blank"><img align="center" alt="React" height="54" width="54" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg"></a>
<a href="https://www.typescriptlang.org/" target="_blank"><img align="center" alt="TypeScript" height="54" width="54" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg"></a>
<a href="https://tailwindcss.com/" target="_blank"><img align="center" alt="Tailwind CSS" height="54" width="54" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg"></a>
<a href="https://leafletjs.com/" target="_blank"><img align="center" alt="Leaflet" height="54" width="54" src="https://unpkg.com/leaflet@1.9.4/dist/images/logo.svg"></a>
<a href="https://www.python.org/" target="_blank"><img align="center" alt="Python" height="54" width="54" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"></a>
<a href="https://fastapi.tiangolo.com/" target="_blank"><img align="center" alt="FastAPI" height="54" width="54" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg"></a>
<a href="https://www.sqlite.org/" target="_blank"><img align="center" alt="SQLite" height="54" width="54" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original.svg"></a>
</div>
