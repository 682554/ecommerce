// This layout is no longer needed as the root page.tsx handles everything
import type { ReactNode } from "react";

export default function RootRouteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
