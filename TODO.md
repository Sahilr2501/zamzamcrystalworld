# TODO - Enterprise-Grade MERN E-Commerce Blueprint

## Step 0: Repo understanding

- [x] Reviewed current backend and frontend scaffolding.
- [x] Confirmed backend has only /api/health, /api/hello, /api/echo.
- [x] Confirmed frontend is a minimal Next.js page with a fetch to /api/hello.

## Step 1: Create enterprise directory structure

- [x] backend: create config/controllers/middleware/models/routes/utils + server.js

- [ ] frontend: create src/components/layout/screens/slices + store/app wiring
- [ ] update existing entry files to use new structure

## Step 2: Backend core wiring (compile + run)

- [ ] Add Mongoose models: User, Product(with Variants), Order, Coupon
- [ ] Add auth infrastructure: JWT access + refresh token (httpOnly cookie)
- [ ] Add middleware: protect/admin + centralized error handler + 404
- [ ] Add routes + controllers skeleton for all API endpoints
- [ ] Add local upload storage folder integration (no AWS)

## Step 3: Redis caching integration (local)

- [ ] Add Redis client config and helper utilities
- [ ] Wire caching hooks (initially for inventory blocks / token rotation helper paths)

## Step 4: Frontend Redux Toolkit + screens

- [ ] Add Redux store + slices (auth/cart/product)
- [ ] Wire Provider into Next.js \_app.js
- [ ] Implement screens matching endpoint specs (minimal but functional)

## Step 5: Environment templates

- [ ] Add backend/.env.example (Mongo + JWT + Redis + local upload path)
- [ ] Add frontend/.env.example (NEXT_PUBLIC_API_URL)

## Step 6: Smoke testing

- [ ] Start backend and verify /api/health
- [ ] Verify /api/hello still works
- [ ] Verify auth endpoints compile (register/login/refresh/profile)
- [ ] Verify frontend loads and dispatches basic cart/auth actions
