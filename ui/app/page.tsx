import { Suspense } from "react";
import Dashboard from "./dashboard";

export default function ReportsDashboard() {
  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  )
};
