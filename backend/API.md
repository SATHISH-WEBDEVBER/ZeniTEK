# ZeniTEK API reference

Base URL: `http://localhost:5000/api` in development (the frontend reads `VITE_API_BASE_URL`).

## Conventions

- Every response is JSON with a `success` boolean. Errors always include a `message`:
  `{ "success": false, "message": "Bug not found" }`. Validation errors may also include an `errors` array.
- Successful responses return the resource under a named key (`bug`, `bugs`, `lead`, `leads`, `summary`, `data`, ...) and often a `message`.
- Status codes: `200` OK, `201` created, `400` invalid input, `401` not signed in or session expired,
  `403` signed in but the role is not allowed, `404` not found (also used when a tester asks for someone else's bug),
  `409` conflict (duplicate slug, editing a completed bug), `429` too many login attempts, `503` database unavailable.
- Protected endpoints need `Authorization: Bearer <token>` from `POST /api/auth/login`. Tokens last 8 hours.

## Roles

| Role | Who | Accounts (backend/.env) |
|---|---|---|
| `client` | Client Admin: website CMS, enquiries, reviews, read-only bug progress | `CLIENT_ADMIN_USERNAME` / `CLIENT_ADMIN_PASSWORD` |
| `developer` | Developer Admin: triage and fix bugs, Excel report | `DEVELOPER_USERS=user:pass,...` |
| `tester` | Tester: report and track their own bugs | `TESTER_USERS=user:pass,...` |

---

## Health and index

| Method | Path | Role | Response |
|---|---|---|---|
| GET | `/api/health` | public | `{ success: true, status: "ok", db: true \| false, service, uptimeSeconds, timestamp }` |
| GET | `/api` | public | `{ success, service, version, endpoints: [...], mongoStatus }` |

## Auth

| Method | Path | Role | Request | Response |
|---|---|---|---|---|
| POST | `/api/auth/login` | public | `{ username, password, role: "client" \| "developer" \| "tester" }` | `{ success, token, expiresIn: "8h", user: { username, role } }` |
| GET | `/api/auth/me` | any signed-in | | `{ success, user: { username, role } }` |

Login errors: `400` missing fields or unknown role, `401` wrong username or password, `429` after 10 failed attempts in 15 minutes from one IP.

## Client Admin dashboard

| Method | Path | Role | Response |
|---|---|---|---|
| GET | `/api/admin/overview` | client | `{ success, data }` (below) |

```json
{
  "success": true,
  "data": {
    "generatedAt": "2026-10-09T10:00:00.000Z",
    "products": { "total": 8, "published": 6 },
    "sections": { "total": 7, "published": 7 },
    "gallery":  { "total": 40, "published": 38 },
    "leads":    { "total": 12, "last7Days": 3 },
    "reviews":  { "total": 5, "pending": 2, "approved": 3 },
    "bugs":     { "total": 4, "open": 1, "inProgress": 1, "completed": 2, "notCompleted": 2, "overdue": 0 },
    "recentLeads": [ { "_id": "...", "name": "...", "phone": "...", "state": "...", "district": "...",
                       "clientType": "...", "cropType": "...", "capacityNeeded": "...", "message": "...",
                       "whatsappPreference": true, "submittedAt": "..." } ]
  }
}
```

Returns `503` if MongoDB is not connected.

## Enquiries (leads)

| Method | Path | Role | Request | Response |
|---|---|---|---|---|
| POST | `/api/leads` | public | `{ name, phone, state, district, clientType, cropType, capacityNeeded, whatsappPreference?, message? }` | `201 { success, message, lead, whatsappUrl }` |
| GET | `/api/leads?search=&sort=newest\|oldest&limit=` | client | | `{ success, count, leads: [lead] }` |
| GET | `/api/leads/:id` | client | | `{ success, lead }` or `404` |
| DELETE | `/api/leads/:id` | client | | `{ success, message }` or `404` |

Lead fields: `name`, `phone`, `whatsappPreference` (boolean), `state`, `district`,
`clientType` (`Individual Farmer`, `FPO / Cooperative Group`, `Food Processor & Exporter`, `Industrial/Sludge Processor`, `NGO / CSR Partner`),
`cropType` (`Copra/Coconut`, `Moringa/Herbs`, `Spices/Chillies`, `Fruits/Veggies`, `Fish/Seafood`, `Other`),
`capacityNeeded` (`Under 50 kg (Portable)`, `100 to 500 kg (Commercial)`, `1 Ton+ (Industrial)`), `message`, `submittedAt`.
A POST with missing fields returns `400 { success: false, message, errors }`.

## Reviews

| Method | Path | Role | Request | Response |
|---|---|---|---|---|
| GET | `/api/reviews` | public | | `{ success, count, reviews }` (approved only) |
| GET | `/api/reviews/all` | client | | `{ success, count, reviews, source? }` (approved and pending; `source: "initial"` means the built-in samples are shown because the database has none) |
| GET | `/api/reviews/:id` | public | | `{ success, review }` |
| POST | `/api/reviews` | public | `{ name, location, comment, role?, rating? (1-5), videoUrl? }` | `201 { success, message, review }` (pending approval) |
| PUT | `/api/reviews/:id/approve` | client | optional `{ approved: true \| false }` (default `true`; `false` hides it again) | `{ success, message, review }`, `400` if `approved` is not a boolean, `404` |
| DELETE | `/api/reviews/:id` | client | | `{ success, message }` or `404` |

## Bug tracker

Bug object (as returned by every bug endpoint):

```text
_id, bugNumber, title, description, affectedPage, stepsToReproduce, expectedResult, actualResult,
severity (low|medium|high|critical, set by the tester), environment, screenshots: [{ _id, url, filename, originalName }],
reportedBy, priority (unset|low|medium|high|critical, set by a developer), status (open|in-progress|completed),
assignedTo, developerNotes, history: [{ at, by, action, note }], submittedAt, deadline (submittedAt + 7 days),
completedAt, completedBy, completedLate, overdue, createdAt, updatedAt,
computed: isOverdue, displayStatus (open|in-progress|completed|overdue), daysRemaining, hoursRemaining
```

Screenshots are served from `/uploads/bugs/<file>` (outside `/api`).

| Method | Path | tester | developer | client | Request | Response |
|---|---|---|---|---|---|---|
| GET | `/api/bugs` | own bugs | all | all (read-only) | query: `status`, `priority`, `overdue=true\|false`, `tester`, `search` | `{ success, count, bugs }` |
| GET | `/api/bugs/:id` | own only (else `404`) | yes | yes (read-only) | | `{ success, bug }` |
| POST | `/api/bugs` | yes | `403` | `403` | multipart: `title`*, `description`*, `affectedPage`*, `stepsToReproduce`, `expectedResult`, `actualResult`, `severity`, `environment`, `screenshots` (up to 5 images, 5 MB each, PNG/JPG/WEBP/GIF) | `201 { success, message, bug }` |
| PUT | `/api/bugs/:id` | own, not completed | `403` | `403` | multipart: any report field, new `screenshots`, `removeScreenshots` (JSON array of screenshot ids) | `{ success, message, bug }`, `409` if completed |
| DELETE | `/api/bugs/:id` | own, not completed | `403` | `403` | | `{ success, message }`, `409` if completed |
| PATCH | `/api/bugs/:id` | `403` | yes | `403` | JSON: `priority`, `status`, `assignedTo` (developer username or `""`), `developerNotes`, `note` (adds a history entry) | `{ success, message, bug }` |
| POST | `/api/bugs/:id/complete` | `403` | yes | `403` | JSON: `{ note? }` | `{ success, message, bug }`, `409` if already completed |
| GET | `/api/bugs/meta` | `403` | yes | `403` | | `{ success, developers, testers, priorities, statuses, severities }` |
| GET | `/api/bugs/reports/summary` | `403` | yes | yes | | `{ success, summary }` (below) |
| GET | `/api/bugs/reports/excel` | `403` | yes | `403` | | `.xlsx` file (sheets: All Bugs, Summary, Overdue, Completed) |

```text
summary: { generatedAt, total, open, inProgress, completed, overdue, completedLate, completedOnTime,
           byPriority: { unset, low, medium, high, critical }, bySeverity: { low, medium, high, critical },
           byTester: [{ tester, total, completed, overdue }], dueSoon: [bug] }
```

Developers cannot delete bugs; they close them by completing them. The overdue flag is refreshed hourly and on every report request.

## Website CMS (client)

All admin routes below need role `client`. Public routes return published items only.

### Products

| Method | Path | Role | Request | Response |
|---|---|---|---|---|
| GET | `/api/products?category=&published=true\|false` | client | | `{ success, count, products }` |
| GET | `/api/products/:id` | client | | `{ success, product }` |
| POST | `/api/products` | client | multipart: `name`*, `category`* (`Tunnel Type`, `Box Type`, `Solar Thermal`, `Accessories`, `Other`), `slug`, `shortDescription`, `description`, `features` (JSON array), `specifications` (JSON `[{label,value}]`), `displayOrder`, `published`, `images` (up to 10) | `201 { success, message, product }`, `400`, `409` duplicate slug |
| PUT | `/api/products/:id` | client | same as POST plus `keepImageIds` (JSON array) | `{ success, message, product }` |
| PATCH | `/api/products/:id/status` | client | `{ published }` | `{ success, message, product }` |
| DELETE | `/api/products/:id/images/:imageId` | client | | `{ success, message, product }` |
| DELETE | `/api/products/:id` | client | | `{ success, message }` |
| GET | `/api/public/products?category=&limit=` | public | | `{ success, count, products }` |
| GET | `/api/public/products/:slug` | public | | `{ success, product }` |

### Product sections

| Method | Path | Role | Request | Response |
|---|---|---|---|---|
| GET | `/api/sections` | client | | `{ success, count, sections }` |
| GET | `/api/sections/:slug` | client | | `{ success, section }` |
| POST | `/api/sections/seed` | client | | `{ success, message, count, sections }` (restores the 7 defaults if missing) |
| POST | `/api/sections` | client | multipart: `slug`*, `title`*, `subtitle`, `content`, `highlights` (JSON array), `displayOrder`, `published`, `thumbnail` (file) or `thumbnailUrl` | `201 { success, message, section }`, `409` duplicate slug |
| PUT | `/api/sections/:slug` | client | same fields | `{ success, message, section }` |
| POST | `/api/sections/:slug/images` | client | multipart: `images` (up to 20) and/or `imageUrl` | `{ success, message, section }` |
| DELETE | `/api/sections/:slug/images/:imageId` | client | | `{ success, message, section }` |
| PATCH | `/api/sections/:slug/status` | client | `{ published }` | `{ success, message, section }` |
| DELETE | `/api/sections/:slug` | client | | `{ success, message }` |
| GET | `/api/public/sections` | public | | `{ success, count, sections }` |
| GET | `/api/public/sections/:slug` | public | | `{ success, section }` |

### Gallery

| Method | Path | Role | Request | Response |
|---|---|---|---|---|
| GET | `/api/gallery?category=&published=` | client | | `{ success, count, items }` |
| GET | `/api/gallery/:id` | client | | `{ success, item }` |
| POST | `/api/gallery` | client | multipart: `title`*, `category`* (`box_dryers`, `tunnel_external`, `tunnel_internal`, `trays_produce`, `engineering`, `Other`), `image`* (file), `description`, `location`, `state`, `productModel`, `capacity`, `lat`, `lng`, `displayOrder`, `published` | `201 { success, message, item }` |
| PUT | `/api/gallery/:id` | client | same fields, `image` optional | `{ success, message, item }` |
| PATCH | `/api/gallery/:id/status` | client | `{ published }` | `{ success, message, item }` |
| DELETE | `/api/gallery/:id` | client | | `{ success, message }` |
| GET | `/api/public/gallery?category=&limit=` | public | | `{ success, count, items }` |

### Projects (installation map) and seeding

| Method | Path | Role | Request | Response |
|---|---|---|---|---|
| GET | `/api/projects` | public | | `{ success, count, projects }` |
| GET | `/api/projects/:id` | public | | `{ success, project }` |
| POST | `/api/projects` | client | `{ title, locationName, latitude, longitude, cropDrying, dryerType, capacity, imageUrl?, description? }` | `201 { success, message, project }` |
| PUT | `/api/projects/:id` | client | any project field | `{ success, message, project }` |
| DELETE | `/api/projects/:id` | client | | `{ success, message }` |
| GET / POST | `/api/seed` | client | | `{ success, message, ... }` |

Unknown `/api/*` paths return `404 { success: false, message }`.
