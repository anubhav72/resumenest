import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loader from "./components/reusable/Loader";

const ResumeBuilder = lazy(() =>
  import("./components/resume-builder/ResumeBuilder")
);

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<ResumeBuilder />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
