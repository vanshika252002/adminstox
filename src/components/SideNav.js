import * as React from "react";
import Box from "@mui/joy/Box";
import DialogContent from "@mui/joy/DialogContent";
import List from "@mui/joy/List";
import { Link, useLocation } from "react-router-dom";
import { TocOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";

export default function SideNav() {
  const location = useLocation();
  const [profile, setProfile] = React.useState(JSON.parse(localStorage.getItem('auth')));
  const {user}=useSelector(state=>state.auth);
  // Function to check if a given path is the current path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Box
      sx={{
        height: "100vh",
        position: "sticky",
        top: "0",
        backgroundColor: "white",
        borderRight: "1px solid #ccc",
        overflowY: "auto",
        width: "22%",
        padding: "0px 20px 0px 20px",
        boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* <DialogTitle>Gaming Auction</DialogTitle> */}
      <DialogContent>
        <List>
        {(((user?.role==='staff') && (user?.permission?.p_categories>0)) || (user?.role!=='staff')) && <Link
            className={isActive("/category") ? "active" : ""}
            to={`/category`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /><path d="M14 14h6v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 4h6v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" /></g></svg>
            <span className="ml-2">Categories</span>
          </Link>}
          {(((user?.role==='staff') && (user?.permission?.p_users>0)) || (user?.role!=='staff')) && <Link
            className={isActive("/") ? "active" : ""}
            to={`/`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 19.5c0-1.657-2.239-3-5-3s-5 1.343-5 3m14-3c0-1.23-1.234-2.287-3-2.75M3 16.5c0-1.23 1.234-2.287 3-2.75m12-4.014a3 3 0 1 0-4-4.472M6 9.736a3 3 0 0 1 4-4.472m2 8.236a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></svg>
            <span className="ml-2"> Users</span>
          </Link>}


          {(((user?.role==='staff') && (user?.permission?.p_auctions>0)) || (user?.role!=='staff')) && <Link
            className={isActive("/item-listing") ? "active" : ""}
            to={`/item-listing`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M704 192h160v736H160V192h160v64h384zM288 512h448v-64H288zm0 256h448v-64H288zm96-576V96h256v96z" /></svg>
            <span className="ml-2">Auctions</span>
          </Link>}
          {/* <Link
            className={isActive("/auction-management") ? "active" : ""}
            to={`/auction-management`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M2.686 10.462a2.5 2.5 0 0 0 0 3.536l2.829 2.828a2.5 2.5 0 0 0 4.242-2.121l.973-.973l6.078 7.014a2.793 2.793 0 1 0 3.94-3.94l-7.013-6.079l.972-.972a2.5 2.5 0 0 0 2.121-4.243L14 2.685a2.5 2.5 0 0 0-4.243 2.122l-4.95 4.949a2.496 2.496 0 0 0-2.12.707M12.94 8.695l-4.242 4.242l-2.122-2.121l4.243-4.243zM4.1 12.584a.5.5 0 1 1 .707-.708l2.829 2.829a.5.5 0 1 1-.707.707zm7.778-7.779a.5.5 0 1 1 .707-.707l2.829 2.829a.5.5 0 1 1-.707.707zm6.442 14.631l-6.008-6.932l.194-.195l6.933 6.008a.793.793 0 1 1-1.12 1.12" /></g></svg>
            <span className="ml-2"> Active Auctions</span>
          </Link> */}
          {/* <Link
            className={isActive("/past-auction") ? "active" : ""}
            to={`/past-auction`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.005 20.003v2h-12v-2zM14.59.689l7.778 7.778l-1.414 1.414l-1.061-.353l-2.475 2.475l5.657 5.657l-1.414 1.414l-5.657-5.657l-2.404 2.404l.283 1.132l-1.415 1.414l-7.778-7.778l1.414-1.415l1.132.283l6.293-6.293l-.353-1.06z" /></svg>
            <span className="ml-2"> Past Auctions</span>
          </Link> */}

          {(((user?.role==='staff') && (user?.permission?.p_bid_manage>0)) || (user?.role!=='staff')) && <Link
            className={isActive("/bid-management") ? "active" : ""}
            to={`/bid-management`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24">
              <g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M2.686 10.462a2.5 2.5 0 0 0 0 3.536l2.829 2.828a2.5 2.5 0 0 0 4.242-2.121l.973-.973l6.078 7.014a2.793 2.793 0 1 0 3.94-3.94l-7.013-6.079l.972-.972a2.5 2.5 0 0 0 2.121-4.243L14 2.685a2.5 2.5 0 0 0-4.243 2.122l-4.95 4.949a2.496 2.496 0 0 0-2.12.707M12.94 8.695l-4.242 4.242l-2.122-2.121l4.243-4.243zM4.1 12.584a.5.5 0 1 1 .707-.708l2.829 2.829a.5.5 0 1 1-.707.707zm7.778-7.779a.5.5 0 1 1 .707-.707l2.829 2.829a.5.5 0 1 1-.707.707zm6.442 14.631l-6.008-6.932l.194-.195l6.933 6.008a.793.793 0 1 1-1.12 1.12" /></g>
            </svg>
            <span className="ml-2">Bid Management</span>
          </Link>}

          {(((user?.role==='staff') && (user?.permission?.p_cms>0)) || (user?.role!=='staff')) && <Link
            className={isActive("/cms-pages") ? "active" : ""}
            to={`/cms-pages`}
          >
            <TocOutlined />
            <span className="ml-2">CMS Pages</span>
          </Link>}
          
        </List>
      </DialogContent>

    </Box>
  );
}
