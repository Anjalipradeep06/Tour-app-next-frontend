import { Suspense } from "react";
import SearchTours from "./SearchTours.tsx/page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SearchTours />
    </Suspense>
  );
}