// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AboutMe from "./pages/AboutMe";
import ExplorerSeries from "./pages/PopularProjects";
import ChallengeSeries from "./pages/ChallengeSeries";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecoverPassword from "./pages/RecoverPage";
import Dashboard from "./admin/Dashboard";
import CreateBlog from "./admin/CeateBlog";
import NotFound from "./pages/NotFound";
import DashboardSidebar from "./admin/DashboardSidebar";
import ProtectRoute from "./admin/ProtectRoute";
import BlogDetail from "./pages/BlogDetail";
import ContactMe from "./pages/ContactMe";
import Footer from "./components/Footer";
import AllProjects from "./admin/AllProjects";
import LatestDevelopment from "./pages/LatestDevelopment";
import EditBlog from "./admin/EditBlog";
import CategoryPage from "./pages/CategoryPage";

const Layout = () => {
  return (
    <div className="bg-[#F5F7FE]">
      <div className="md:flex bg-[#F5F7FE] md:min-h-screen w-full p-2 rounded-xl">
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
    <div className="flex bg-[#F5F7FE] min-h-screen p-2 rounded-xl">
      <DashboardSidebar />
      <div className="w-[80%]">
        <Header />
        <div className="px-4 mx-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Admin Routes */}
        <Route element={<ProtectRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="create-project" element={<CreateBlog />} />
            <Route path="edit-project/:id" element={<EditBlog />} />
            <Route path="all-projects" element={<AllProjects />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about-me" element={<AboutMe />} />
          <Route path=":category" element={<CategoryPage />} />
          <Route path=":category/:slug" element={<BlogDetail />} />
          <Route path="phat-trien-moi-nhat" element={<LatestDevelopment />} />
          <Route path="explorer-series" element={<ExplorerSeries />} />
          <Route path="challenge-series" element={<ChallengeSeries />} />
          <Route path="contact" element={<ContactMe />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="recover-password" element={<RecoverPassword />} />

        {/* Fallback Route for NotFound */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
