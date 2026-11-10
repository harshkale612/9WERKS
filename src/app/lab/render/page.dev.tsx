// DEV-ONLY render route for scripts/3d/render-stills.mjs (never part of the production export).
import RenderClient from "./RenderClient";
export const metadata = { robots: { index: false } };
export default function Page() {
  return <RenderClient />;
}
