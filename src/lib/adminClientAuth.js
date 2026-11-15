import { notify } from "@/components/common/AppToaster";

/**
 * Shared client-side logout helper that clears the HttpOnly JWT session cookie
 * via API and redirects cleanly to the admin login page.
 */
export async function performAdminLogout(router) {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Fallback: expire legacy client cookie even if request failed
    document.cookie =
      "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
  notify.info("Signed out of Admin Portal");
  router.push("/admin/login");
  router.refresh();
}

