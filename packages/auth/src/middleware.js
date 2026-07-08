import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
export function createAuthMiddleware(options = {}) {
    const isPublicRoute = options.publicRoutes
        ? createRouteMatcher(options.publicRoutes)
        : null;
    const isProtectedRoute = options.protectedRoutes
        ? createRouteMatcher(options.protectedRoutes)
        : null;
    return clerkMiddleware(async (auth, req) => {
        if (isProtectedRoute) {
            if (isProtectedRoute(req)) {
                await auth.protect();
            }
        }
        else if (isPublicRoute) {
            if (!isPublicRoute(req)) {
                await auth.protect();
            }
        }
        else {
            await auth.protect();
        }
    });
}
const middleware = createAuthMiddleware({
    publicRoutes: [
        "/",
        "/th",
        "/th/login(.*)",
        "/th/register(.*)",
        "/th/about(.*)",
        "/th/concepts(.*)",
        "/th/thinkers(.*)",
        "/api/public(.*)",
    ],
});
export default middleware;
