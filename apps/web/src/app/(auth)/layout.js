import { requireRole } from "@archron/auth";

export default async function AuthLayout({ children }) {
    await requireRole("member");
    return children;
}
