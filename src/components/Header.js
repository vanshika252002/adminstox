import React, { useEffect } from "react";
import Avatar from "@mui/joy/Avatar";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/joy/IconButton";
import Logo from "../images/logo.png";
// import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import { admin_profile, user_logout } from "../reduxData/auth/authAction";
import ProfileIcon from '@mui/icons-material/PersonOutline';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Dropdown } from "react-bootstrap";
import DefaultImg from '../images/no_profile.png';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Logout from "../Modals/Logout";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/joy";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

export const Header = () => {
  const { userDetails } = useSelector((state) => state.auth);
  const [isCancel, setIsCancel] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await admin_profile(localStorage.getItem('token'), dispatch);
        setProfile(res)
      } catch (error) {
        console.error("Error fetching auction categories:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    // let isLogout = 
    await user_logout(dispatch, localStorage.getItem('token'));
    // if(isLogout === true){
        localStorage.clear();
        window.location.reload();
        setIsCancel(false);
    // }
};

  return (
    <div>
      <nav className="cream-box d-flex justify-content-end cont">

        <Dropdown
          id="dropdown-basic-button"
          className="drop-downlist"
          variant="light"
        // onClick={handleShow}
        >
          <Dropdown.Toggle id="dropdown-basic" style={{ width: '100%', padding: '0', background: 'none', border: 'none', color: '#000', display: 'flex', gap: '10px', alignItems:'center' }}>
            {userDetails?.profile_pic ?
              <img src={`${REACT_APP_IMAGE_URL}${userDetails?.profile_pic}`} height={50} width={50} style={{ borderRadius: '50%' }} alt="" />
              :
              <img src={DefaultImg} alt="img not found" height={50} width={50} style={{ borderRadius: '50%' }}  />
            }
            {userDetails?.user_name}
    
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate('/profile')}><div className="dropdown-memulist">
              <ProfileIcon /> Profile</div>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => { setIsCancel(true); }}><LogoutRoundedIcon /> Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </nav>

      <Modal open={isCancel} onClose={() => setIsCancel(false)}>
          <ModalDialog>
            <DialogTitle>Logout</DialogTitle>
            <DialogContent>
                Are you sure you want to Logout ?
            </DialogContent>
            <Box>
              <Button onClick={() => setIsCancel(false)}>Cancel</Button>
              <Button
                className="mx-2"
                color="danger"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
    </div>
  );
};
export default Header;
