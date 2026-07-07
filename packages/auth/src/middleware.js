import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const isPublicRoute = createRouteMatcher([
    "/",
    "/th",
    "/th/login(.*)",
    "/th/register(.*)",
    "/th/about(.*)",
    "/th/concepts(.*)",
    "/th/thinkers(.*)",
    "/api/public(.*)",
]);
const middleware = clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});
export default middleware;
