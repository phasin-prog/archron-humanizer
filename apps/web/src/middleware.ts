import { createAuthMiddleware } from "@archron/auth/middleware"

const middleware = createAuthMiddleware({
  protectedRoutes: [
    "/studio(.*)",
    "/settings(.*)",
    "/reviews(.*)",
    "/achievements(.*)",
    "/contributions(.*)",
    "/notifications(.*)",
    "/api/settings(.*)",
    "/api/reviews(.*)",
    "/api/notifications(.*)",
    "/api/contributions(.*)",
    "/api/achievements(.*)",
    "/api/studio(.*)",
    "/api/chat(.*)",
  ],
})

export default middleware
