import Login from "./auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-tagsinput/react-tagsinput.css'
import 'react-quill/dist/quill.snow.css';
import UserManagement from "./pages/UserManagement/index";
import { BrowserRouter as Router, Navigate, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import AddEditUserManagement from "./pages/UserManagement/AddEditUserManagement";
import { connect } from "react-redux";
import AdminProfile from "./pages/AdminProfile";
import ItemListing from "./pages/ItemListing";
import "./css/style.css";
import RunningAuctions from "./pages/RunningAuctions";
import PastAuction from "./pages/PastAuction";
import EditListItem from "./components/EditListItem";
import Category from "./pages/Category";
import SideNav from "./components/SideNav";
import '@fortawesome/fontawesome-free/css/all.min.css';
import BidManagement from "./pages/BidManagement";
import CMS from "./pages/CMSPages/CMS";
import { ProSidebarProvider } from "react-pro-sidebar";
import AdminSideBar from "./components/AdminSideBar";
import FAQ from "./pages/CMSPages/FAQ";
import Policy from "./pages/CMSPages/Policy";
import Terms from "./pages/CMSPages/Terms";
import HowItWorks from "./pages/CMSPages/HowItWorks";
import HomePages from "./pages/CMSPages/HomePages";
import PointsSystem from "./pages/LevelSystem/PointsSystem";
import WhatIsInsertBid from "./pages/CMSPages/WhatIsInsertBid";
import ContactUs from "./pages/CMSPages/ContactUs";
import SellItem from "./pages/CMSPages/SellItem";
import SalesHistory from "./pages/SalesHistory";
import { Spinner } from "react-bootstrap";
import Staff from "./pages/StaffManage";
import AddEditStaff from "./pages/StaffManage/addEditStaff";
import DisputesList from "./pages/Disputes";
import AboutUsContent from "./pages/CMSPages/AboutUsContent";
import FlagCommentsList from "./pages/FlagCommentsList";
import ChangePassword from "./components/ChangePassword";
import PhotoGuide from "./pages/CMSPages/PhotoGuide";
import HeaderContent from "./pages/CMSPages/HeaderContent";
import NotifyUsers from "./pages/NotifyUsers";
import StoreManager from "./pages/StoreManager";
import AwardsSystem from "./pages/AwardsSysten";
import ApproveAuction from "./pages/ApproveAuction";
import NewsLetter from "./pages/NewsLetter";
import Contacts from "./pages/Contacts";
import CookiePolicy from "./pages/CMSPages/CookiePolicy";
import DPA from "./pages/CMSPages/DPA";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import ReturnPolicy from "./pages/CMSPages/ReturnPolicy";
import AuditLogs from "./pages/AuditLogs";
import Products from "./pages/Products/Products";
import AddProducts from "./pages/Products/AddProducts";
import Attributes from "./pages/Attributes/Attributes";
import AddVariants from "./pages/Products/AddVariants";
import AddSize from "./pages/Products/AddSize";
import Brands from "./pages/Brands/Brands";
import CreateVariants from "./pages/Products/CreateVariants";
import VariantsList from "./pages/Products/VariantsList";

function App({ user, isLoading, resetToken }) {
  const AuthRoutes = () =>
    useRoutes([
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ]);

  const AfterLoginCustomerRoutes = () =>
    useRoutes([
      { path: "/", element: <Analytics /> },
      // { path: "/users", element: <UserManagement /> },
      {},
      {path:"/add-variant/:productId", element : <CreateVariants/>},
      { path: "/profile", element: <AdminProfile /> },
      { path: "/users", element: <UserManagement /> },
      { path: "/addUser", element: <AddEditUserManagement /> },
      { path: "/editUser/:id", element: <AddEditUserManagement /> },
      { path: "/item-listing", element: <ItemListing /> },
      { path: "/item-details/:id", element: <ApproveAuction /> },
      { path: "/sales-history", element: <SalesHistory /> },
      { path: "/orders", element: <Orders /> },
    

      {path: "/products", element:<Products />},
     {path: "/add-product", element:<AddProducts/>},
    {path:"/edit-product/:id", element:<AddProducts type="edit"/>},
    {path:"/attributes", element:<Attributes/>},
    {path:"/add-size", element:<AddSize/>},
    {path:"/brands", element:<Brands/>},
    {path:"/variants/:id",element:<VariantsList/>},


   , { path: "/payments", element: <Payments /> },

      { path: "/logs", element: <AuditLogs /> },
      // { path: "/auction-management", element: <RunningAuctions /> },
      // { path: "/past-auction", element: <PastAuction /> },
      { path: "/bid-management", element: <BidManagement /> },
      { path: "/store-management", element: <StoreManager /> },
      // { path: "/cms-pages", element: <CMS /> },
      { path: "/cms-pages/header", element: <HeaderContent /> },
      { path: "/cms-pages/homepages", element: <HomePages /> },
      { path: "/cms-pages/faq", element: <FAQ /> },
      { path: "/cms-pages/privacy-policy", element: <Policy /> },
      { path: "/cms-pages/terms", element: <Terms /> },
      { path: "/cms-pages/cookie-policy", element: <CookiePolicy /> },
      { path: "/cms-pages/return-policy", element: <ReturnPolicy/> },
      { path: "/cms-pages/what-is-insert-bids", element: <WhatIsInsertBid /> },
      { path: "/cms-pages/how-it-works", element: <HowItWorks /> },
      { path: "/cms-pages/contact-us", element: <ContactUs /> },
      { path: "/cms-pages/about-us", element: <AboutUsContent />},
      { path: "/cms-pages/dpa", element: <DPA />},
      { path: "/newsletters", element: <NewsLetter />},
      { path: "/queries", element: <Contacts /> },
      { path: "/cms-pages/sell-an-item", element: <SellItem /> },
      { path: "/cms-pages/photo-guide", element: <PhotoGuide /> },
      { path: "/edit-list/:id", element: <EditListItem /> },
      { path: "/category", element: <Category /> },
      { path: "/badge", element: <PointsSystem /> },
      { path: "/awards", element: <AwardsSystem /> },
      { path: "/staff", element: <Staff /> },
      { path: "/staff/:id", element: <AddEditStaff /> },
      { path: "/staff/add", element: <AddEditStaff /> },
      { path: "/disputes", element: <DisputesList /> },
      { path: "/flag-comments", element: <FlagCommentsList /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ]);

  const SideBarDashBoard = () => {
    return (
      <ProSidebarProvider>
        <AdminSideBar />
      </ProSidebarProvider>
    );
  };

  return (
    <Router>
      <ToastContainer limit={1} autoClose={2000} />
      {user ? (
        <>
          <Header />
          <div className="d-flex">
            <SideBarDashBoard />
            <div className="home-page w-100">
              {isLoading && <Spinner animation="border" variant="warning" className="spinner"/>}
              <AfterLoginCustomerRoutes />
            </div>
          </div>
        </>
      ) : (
        <AuthRoutes />
      )}
    </Router>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state?.auth?.user,
    resetToken: state?.auth?.resetToken,
    isLoading: state.loading.isLoading,
  };
};

export default connect(mapStateToProps)(App);
