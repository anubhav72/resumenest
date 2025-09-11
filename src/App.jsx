import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loader from "./components/reusable/Loader";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/reusable/ErrorBoundary";
import ErrorPage from "./components/reusable/ErrorPage";

const ResumeBuilder = lazy(() =>
  import("./components/resume-builder/ResumeBuilder")
);

function App() {
  return (
    <>
      <ErrorBoundary
        fallback={<ErrorPage/>}
      >
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<ResumeBuilder />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toasterId="default"
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: "#363636",
              color: "#fff",
            },

            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />{" "}
      </ErrorBoundary>
    </>
  );
}

export default App;
