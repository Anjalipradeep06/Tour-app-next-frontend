import { Suspense } from "react";
import SearchTours from "./SearchTours";

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