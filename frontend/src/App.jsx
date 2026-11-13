import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home/Home";
import Customer from "./components/customer/Customer";
import LoginPage from "./components/Auth/LoginPage";
import SignUpPage from "./components/Auth/SignUpPage";
import ContactUs from "./components/Home/ContactUs";
import AboutPage from "./components/Home/AboutPage";
import ForgotPassword from "./components/Auth/ForgotPassword";
import RequireMember from "./components/Auth/RequireMember";
import NotFound from "./components/Home/NotFound";
import ScrollManager from "./components/ui/ScrollManager";

function App() {
  return (
    <Router>
      <ScrollManager />
      <ToastContainer position="bottom-right" theme="dark" hideProgressBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/Customer/*"
          element={
            <RequireMember>
              <Customer />
            </RequireMember>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignUpPage />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/AboutPage" element={<AboutPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
