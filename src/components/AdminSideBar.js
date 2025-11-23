import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  Password,
  ContactMail,
  NotificationsActive,
  TocOutlined,
  Home,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../images/logo.png";
import ICONS from "../assets";

const AdminSideBar = () => {
  const [open, setOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = [
    {
      name: "Analytics", value: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
          <g fill="none">
            <rect x={4} y={10} width={3} height={9} rx={1} fill="currentColor" opacity={0.16}></rect>
            <rect x={10.5} y={6} width={3} height={13} rx={1} fill="currentColor" opacity={0.16}></rect>
            <rect x={17} y={3} width={3} height={16} rx={1} fill="currentColor" opacity={0.16}></rect>
            <rect x={4} y={10} width={3} height={9} rx={1} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"></rect>
            <rect x={10.5} y={6} width={3} height={13} rx={1} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"></rect>
            <rect x={17} y={3} width={3} height={16} rx={1} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"></rect>
          </g>
        </svg>
      ), subitem: [], key: "p_analytics",
    },

    { name: "Categories", value: "/category", icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none"><circle cx={17} cy={7} r={3} fill="currentColor" opacity={0.16}></circle><circle cx={7} cy={17} r={3} fill="currentColor" opacity={0.16}></circle><path fill="currentColor" d="M14 14h6v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 4h6v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" opacity={0.16}></path><circle cx={17} cy={7} r={3} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></circle><circle cx={7} cy={17} r={3} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></circle><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 14h6v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 4h6v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"></path></g></svg>, subitem: [], key: "p_categories" },

    { name: "Users", value: "/users", icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={6} r={4}></circle><path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z"></path></g></svg>, subitem: [], key: "p_users" },



    {name: "Brands" , value:"/brands" , icon :<i className="bi bi-box-seam fs-4"></i>,subitem: [], key:"p_brands"},
   

    {name: "Products" , value:"/products" , icon :<i className="bi bi-box-seam fs-4"></i>,subitem: [], key:"p_products"},
    { name: "Auctions", value: "/item-listing", icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M2.686 10.462a2.5 2.5 0 0 0 0 3.536l2.829 2.828a2.5 2.5 0 0 0 4.242-2.121l.973-.973l6.078 7.014a2.793 2.793 0 1 0 3.94-3.94l-7.013-6.079l.972-.972a2.5 2.5 0 0 0 2.121-4.243L14 2.685a2.5 2.5 0 0 0-4.243 2.122l-4.95 4.949a2.5 2.5 0 0 0-2.12.707M12.94 8.695l-4.242 4.242l-2.122-2.121l4.243-4.243zM4.1 12.584a.5.5 0 1 1 .707-.708l2.829 2.829a.5.5 0 1 1-.707.707zm7.778-7.779a.5.5 0 1 1 .707-.707l2.829 2.829a.5.5 0 1 1-.707.707zm6.442 14.631l-6.008-6.932l.194-.195l6.933 6.008a.793.793 0 1 1-1.12 1.12"></path></g></svg>, subitem: [], key: "p_auctions" },

    { name: "Orders", value: "/orders", icon: (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"> <g fill="none" fillRule="evenodd"> <path d="M0 0h24v24H0z"></path> <path fill="currentColor" d="M6 7V6a6 6 0 0 1 12 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm2 0h8V6a4 4 0 0 0-8 0zm11 2H5v11h14z"></path></g></svg>), subitem: [], key: "p_orders", },

    { name: "Payments", value: "/payments", icon: (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" ><g fill="none" fillRule="evenodd"> <path d="M0 0h24v24H0z"></path><path fill="currentColor" d="M3 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm18 2v2H3V7zm0 4v6H3v-6zm-3 3a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2z"></path></g></svg>), subitem: [], key: "p_payments", },

    // {
    //   name: "Logs Tracking",
    //   value: "/logs",
    //   icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
    //       <g fill="none" fillRule="evenodd">
    //         <path d="M0 0h24v24H0z"></path>
    //         <path
    //           fill="currentColor"
    //           d="M3 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm18 2v2H3V7zm0 4v6H3v-6zm-3 3a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2z"
    //         ></path>
    //       </g>
    //     </svg>
    //   ),
    //   subitem: [],
    //   key: "audit_logs",
    // },

    // { name: "Newsletter", value: "/newsletters", icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 32 32"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 16v8c0 1.5 1.5 3 3 3h16c1.5 0 3-1.5 3-3v-8M5 16h5.5s1 3.5 5.5 3.5s5.5-3.5 5.5-3.5H27M5 16v3.5M5 16l1-5m21 5l-1-5M13.5 9h5m-5 4h5m-9 0V5h13v8"></path></svg>, subitem: [], key: "p_notify_user" },

    // { name: "Queries", value: "/queries", icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 20 20"><path fill="currentColor" d="M12 8.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0 3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-8-.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v.75q.001.001-.004.065a1.44 1.44 0 0 1-.496.92c-.325.282-.863.515-1.75.515C4 13 4 11.5 4 11.5zM6.25 9a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5m4.25-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-1.065 3.977a2.5 2.5 0 0 1-.197.523H9.5A1.5 1.5 0 0 0 11 11a1 1 0 0 0-1-1h-.668c.108.227.168.482.168.75v.788l-.002.029l-.008.104c-.009.08-.025.185-.055.306M4.5 4A2.5 2.5 0 0 0 2 6.5v7A2.5 2.5 0 0 0 4.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 15.5 4zM3 6.5A1.5 1.5 0 0 1 4.5 5h11A1.5 1.5 0 0 1 17 6.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 13.5z"></path></svg>, subitem: [], key: "p_contact_user" },
    //
    //  {
    //   name: "CMS Pages",
    //   value: "/cms-pages",
    //   icon: <TocOutlined />,
    //   subitem: [
    //     {
    //       name: "Home Page",
    //       value: "/cms-pages/homepages",
    //       icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1}><path d="M5 12.76c0-1.358 0-2.037.274-2.634c.275-.597.79-1.038 1.821-1.922l1-.857C9.96 5.75 10.89 4.95 12 4.95s2.041.799 3.905 2.396l1 .857c1.03.884 1.546 1.325 1.82 1.922c.275.597.275 1.276.275 2.634V17c0 1.886 0 2.828-.586 3.414S16.886 21 15 21H9c-1.886 0-2.828 0-3.414-.586S5 18.886 5 17z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 21v-5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v5"></path></g></svg>
    //     },
    //     {
    //       name: "Privacy Policy",
    //       value: "/cms-pages/privacy-policy",
    //       icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z" /><path stroke-linecap="round" stroke-linejoin="round" d="m9.5 12.4l1.429 1.6l3.571-4" /></g></svg>,
    //     },
    //     {
    //       name: "Terms and Conditions",
    //       value: "/cms-pages/terms",
    //       icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h2.5a3 3 0 0 1 3-3a3 3 0 0 1 3 3H17a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1v3H7V6zm2 2h7V6H8zm3.5-5a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M6 11h11v1H6zm0 3h11v1H6zm0 3h9v1H6z"></path></svg>,
    //     },
    //     {
    //       name: "Cookie Policy",
    //       value: "/cms-pages/cookie-policy",
    //       icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h2.5a3 3 0 0 1 3-3a3 3 0 0 1 3 3H17a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1v3H7V6zm2 2h7V6H8zm3.5-5a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M6 11h11v1H6zm0 3h11v1H6zm0 3h9v1H6z"></path></svg>,
    //     },
    //     {
    //       name: "How it Works",
    //       value: "/cms-pages/how-it-works",
    //       icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h2.5a3 3 0 0 1 3-3a3 3 0 0 1 3 3H17a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1v3H7V6zm2 2h7V6H8zm3.5-5a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M6 11h11v1H6zm0 3h11v1H6zm0 3h9v1H6z"></path></svg>,
    //     },
    //     {
    //       name: "About",
    //       value: "/cms-pages/about-us",
    //       icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h2.5a3 3 0 0 1 3-3a3 3 0 0 1 3 3H17a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1v3H7V6zm2 2h7V6H8zm3.5-5a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M6 11h11v1H6zm0 3h11v1H6zm0 3h9v1H6z"></path></svg>,
    //     },
    //     {
    //       name: "DPA",
    //       value: "/cms-pages/dpa",
    //       icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h2.5a3 3 0 0 1 3-3a3 3 0 0 1 3 3H17a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1v3H7V6zm2 2h7V6H8zm3.5-5a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M6 11h11v1H6zm0 3h11v1H6zm0 3h9v1H6z"></path></svg>,
    //     },
    //     {
    //       name: "FAQ's",
    //       value: "/cms-pages/faq",
    //       icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h2.5a3 3 0 0 1 3-3a3 3 0 0 1 3 3H17a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1v3H7V6zm2 2h7V6H8zm3.5-5a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M6 11h11v1H6zm0 3h11v1H6zm0 3h9v1H6z"></path></svg>,
    //     },
    //     {
    //       name: "Return Policy",
    //       value: "/cms-pages/return-policy",
    //       icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6 5h2.5a3 3 0 0 1 3-3a3 3 0 0 1 3 3H17a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1v3H7V6zm2 2h7V6H8zm3.5-5a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2M6 11h11v1H6zm0 3h11v1H6zm0 3h9v1H6z"></path></svg>,
    //     },
    //   ],
    //   key: "p_cms",
    // },
    {
      name:"Atrributes" , value:"/attributes" , icon :<i class="bi bi-sliders"></i>, subitem: [], key: "p_attributes"
    }
  ];

  return (
    <>
      {/* Hamburger toggle only on mobile */}
      {isMobile && (
        <button
          className="btn btn-light"
          onClick={() => setShowSidebar(true)}
          style={{ zIndex: 1101, position: "fixed", top: 10, left: 10 }}
        >
          <MenuIcon />
        </button>
      )}

      {/* Overlay */}
      {isMobile && showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1100,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: isMobile ? "fixed" : "sticky",
          top: "0",
          height: "100vh",
          width: "260px",
          background: "#fff",
          boxShadow: isMobile ? "2px 0 8px rgba(0,0,0,0.2)" : "none",
          zIndex: 1101,
          paddingTop: "10px",
          transition: "transform 0.3s ease-in-out",
          transform: isMobile
            ? showSidebar
              ? "translateX(0)"
              : "translateX(-100%)"
            : "translateX(0)", // desktop always visible
        }}
      >
        {/* Logo */}
        <div className="d-flex justify-content-between">
          <Link to="/">
            <img
              src={ICONS.STOX_LOGO}
              alt="logo"
              className="sidebar-logo"
            />
          </Link>

          {isMobile && (
            <button
              className="btn btn-light"
              onClick={() => setShowSidebar(false)}
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {/* Close button only for mobile */}


        <Sidebar>
          <Menu>
            {items.map((item) =>
              item.subitem.length === 0 ? (
                <MenuItem
                  key={item.key}
                  className={
                    item?.value === location.pathname ? "is-active" : "not-active"
                  }
                  component={<Link to={item?.value} />}
                  onClick={() => isMobile && setShowSidebar(false)}
                >
                  {item.icon} {item.name}
                </MenuItem>
              ) : (
                <SubMenu
                  key={item.key}
                  label={item.name}
                  icon={item.icon}
                  open={
                    item.subitem.find((r) => r.value === location.pathname) ||
                      open === item.value
                      ? true
                      : false
                  }
                  className={
                    item?.value === location.pathname ? "is-active" : "not-active"
                  }
                  onOpenChange={(open) => setOpen(open ? item.value : null)}
                >
                  {item.subitem.map((subItem) => (
                    <MenuItem
                      key={subItem.name}
                      className={
                        subItem?.value === location.pathname ? "is-active" : "not-active"
                      }
                      component={<Link to={subItem?.value} />}
                      onClick={() => isMobile && setShowSidebar(false)}
                    >
                      {subItem.icon} {subItem.name}
                    </MenuItem>
                  ))}
                </SubMenu>
              )
            )}

            {user?.role === "staff" && (
              <MenuItem
                className={
                  location.pathname === "/change-password" ? "is-active" : "not-active"
                }
                component={<Link to={"/change-password"} />}
                onClick={() => isMobile && setShowSidebar(false)}
              >
                <Password /> Change Password
              </MenuItem>
            )}
          </Menu>
        </Sidebar>
      </div>
    </>
  );
};

export default AdminSideBar;




