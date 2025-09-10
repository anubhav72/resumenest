import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

const ResumeBuilder = lazy(() =>
  import("./components/resume-builder/ResumeBuilder")
);

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="text-center mt-10 text-gray-500 dark:text-gray-400 dark:bg-gray-800">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<ResumeBuilder />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
