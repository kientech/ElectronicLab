// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AboutMe from "./pages/AboutMe";
import PopularProjects from "./pages/PopularProjects";
import ChallengeSeries from "./pages/BlogsPage";
import HomePage from "./pages/HomePage";
import RecoverPassword from "./pages/RecoverPage";
import Dashboard from "./admin/Dashboard";
import CreateBlog from "./admin/CreateBlog";
import DashboardSidebar from "./admin/DashboardSidebar";
import ProtectRoute from "./admin/ProtectRoute";
import BlogDetail from "./pages/BlogDetail";
import ContactMe from "./pages/ContactMe";
import Footer from "./components/Footer";
import AllProjects from "./admin/AllProjects";
import LatestDevelopment from "./pages/LatestDevelopment";
import EditBlog from "./admin/EditBlog";
import CategoryPage from "./pages/CategoryPage";
import BlogsPage from "./pages/BlogsPage";
import { useEffect } from "react";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import TechApplyPage from "./pages/TechApplyPage";
import MicPicPage from "./pages/MicPicPage";
import { ConfigProvider, theme } from "antd";
import { AuthProvider } from "./contexts/AuthContext";
import NotFound from "./pages/NotFound";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../database/db";
import { ThemeProvider } from "./context/ThemeContext";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { PositionProvider } from "./contexts/PositionContext";
import Profile from "./pages/Profile";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    NProgress.start();
    NProgress.configure({ showSpinner: false });

    // Simulate loading progress
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
};

const Layout = () => {
  return (
    <div className="bg-[#F5F7FE] dark:bg-[#1C1C1C]">
      <div className="md:flex bg-[#F5F7FE] dark:bg-[#1C1C1C] md:min-h-screen w-full p-2 rounded-xl">
        <Sidebar />
        <div className="md:w-[80%] w-full">
          <Header />
          <div className="md:px-4 px-2 md:mx-4">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <div className="flex bg-[#F5F7FE] h-screen p-2 rounded-xl">
      <DashboardSidebar />
      <div className="w-[80%] flex flex-col">
        <Header />
        <div className="px-4 mx-8 flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <AuthProvider>
          <DarkModeProvider>
            <PositionProvider>
              <Router>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col">
                  <main className="flex-grow">
                    <Routes>
                      {/* Protected Admin Routes */}
                      <Route element={<ProtectRoute />}>
                        <Route path="/dashboard" element={<DashboardLayout />}>
                          <Route index element={<Dashboard />} />
                          <Route
                            path="create-project"
                            element={<CreateBlog />}
                          />
                          <Route
                            path="edit-project/:id"
                            element={<EditBlog />}
                          />
                          <Route
                            path="all-projects"
                            element={<AllProjects />}
                          />
                        </Route>
                      </Route>

                      {/* Public Routes */}
                      <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="about-me" element={<AboutMe />} />
                        <Route path="profile" element={<Profile />} />
                        <Route
                          path="danh-muc/:category"
                          element={<CategoryPage />}
                        />
                        <Route
                          path=":category/:slug"
                          element={<BlogDetail />}
                        />
                        <Route
                          path="phat-trien-moi-nhat"
                          element={<LatestDevelopment />}
                        />
                        <Route
                          path="du-an-noi-bat"
                          element={<PopularProjects />}
                        />
                        <Route
                          path="ung-dung-cong-nghe"
                          element={<TechApplyPage />}
                        />
                        <Route
                          path="nen-tang-ky-thuat"
                          element={<MicPicPage />}
                        />
                        <Route path="bai-viet" element={<BlogsPage />} />
                        <Route path="contact" element={<ContactMe />} />
                      </Route>

                      {/* Fallback Route for NotFound */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </Router>
            </PositionProvider>
          </DarkModeProvider>
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
