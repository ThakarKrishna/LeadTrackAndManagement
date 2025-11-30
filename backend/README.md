## Lead Tracking & Management - Backend

Environment variables:

- `PORT` (default: 5000)
- `MONGODB_URI` (e.g. mongodb://127.0.0.1:27017/lead_tracking)
- `JWT_SECRET` (required)
- `CLIENT_URL` (e.g. http://localhost:5173)

Scripts:

- `npm run dev` - start with nodemon
- `npm start` - start in production

Endpoints:

- `GET /health` - health check
- `GET /capture.js` - public capture script
- `POST /auth/signup` - signup { name, email, password }
- `POST /auth/login` - login { email, password }
- `GET/POST/PUT/DELETE /api/websites` (JWT)
- `GET /api/forms` (JWT)
- `POST /api/forms/auto-detect/:websiteId` (JWT)
- `POST /api/forms/extract` (JWT)
- `POST /api/forms` (JWT)
- `DELETE /api/forms/:id` (JWT)
- `POST /api/leads/:formId` - public capture
- `GET /api/leads` (JWT) - list with filters
- `GET /api/analytics/leads-per-day` (JWT)
- `GET /api/analytics/leads-per-form` (JWT)



