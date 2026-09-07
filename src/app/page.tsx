import { permanentRedirect } from "next/navigation";

// The `/` → `/fr` redirect is normally served by the next.config `redirects()`
// entry (308, at the edge). This stays as a permanent fallback in case the
// request ever reaches the App Router.
export default function RootPage() {
  permanentRedirect("/fr");
}
