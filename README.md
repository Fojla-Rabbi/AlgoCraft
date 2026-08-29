# AlgoCraft — Competitive Programming Learning Platform

## Admin-only content management
The project now uses **one login: Administrator only**. There are no student/teacher signup flows.

### Demo admin credentials
- Email: `admin@algocraft.dev`
- Password: `admin123`

After login, the admin is taken to `admin.html`.

### Admin capabilities
- Create, edit, delete and publish/unpublish Levels (programs).
- Add/update a program banner image.
- Create, edit and delete Topics.
- Upload a topic cover image from the browser or use an image URL.
- Edit lesson description, badge, level and sections.
- Reorder topic membership inside a level with multi-select.
- Reset the demo content to the original dataset.

All content changes are stored in browser `localStorage` for this frontend prototype and are immediately reflected on the public homepage, level pages and lesson pages.

> Important: client-side login/localStorage is only a prototype. For real security, the admin login and CRUD operations must be moved behind an authenticated server/API and database.

## Run
Open `index.html` directly or use VS Code Live Server.
