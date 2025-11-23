import React, { useEffect, useState } from "react";
import { Avatar, Button, Container, Grid, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import { update_admin, upload_image } from "../reduxData/user/userAction";
import { useNavigate } from "react-router-dom";
import FormLabel from "@mui/joy/FormLabel";
import DefaultImg from '../images/no_profile.png';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DefaultUserProfile from '../images/no_profile.png'

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const AdminProfile = () => {
  const { userDetails } = useSelector((state) => state.auth);
  let user = null;
  if (JSON.parse(localStorage.getItem("profile"))) {
    user = JSON.parse(localStorage.getItem("profile"));
  } else {
    user = JSON.parse(localStorage.getItem("auth"));
  }

  const getDate = (date) => {
    const dateTime = new Date(date);
    const formattedDate = dateTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formattedDate;
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: userDetails?.user_name,
    email: userDetails?.email,
    // bio: user.bio,
    profile_pic: userDetails?.profile_pic,
    selectedProfilePic: userDetails?.profile_pic ? null : DefaultImg,
    binaryImage: null
  });

  const [errros, setErrors] = useState({
    name: ''
  })

  const handleChange = (e) => {
    if (e.target.name == 'name') {
      if (!e.target.value) {
        setErrors({ ...errros, [e.target.name]: "Name is required" })
      } else {
        setErrors({ ...errros, [e.target.name]: "" })
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setFormData({ ...formData, selectedProfilePic: reader.result,binaryImage:file });
  //   };
  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  let maxSize = 40 * 1024 * 1024;
  const handleFileValidator = (fileArray) => {
    let maxFileSize = fileArray?.filter((item) => item?.size > maxSize);
    if (maxFileSize?.length > 0) {
      toast.error("Uploaded File should not exceed size of 40mb!", { toastId: "uploafileeeeerrr", autoClose: 2000 });
      return true;
    } else if (maxFileSize?.length === 0) {
      return false;
    }
  };

  const handleImageChange = async (value) => {
    const newImages = Array.from(value);
    if (handleFileValidator(newImages)) return;
    if (value) {
      const photoData = await upload_image(newImages[0], localStorage.getItem("token"), dispatch);
      if (photoData) {
        setFormData({ ...formData, selectedProfilePic: photoData?.data?.data });
      }
    }
  };


  const handleSave = async () => {
    if (errros.name) {
      return
    }
    const token = localStorage.getItem('token');
    const admindata = {
      user_name: formData.name,
      email: formData.email,
      profile_pic: formData.selectedProfilePic
    };

    await update_admin(admindata, navigate, token, dispatch, toast);
  };

  useEffect(() => {
    if (userDetails) {
      setFormData({
        ...formData,
        selectedProfilePic: userDetails?.profile_pic || '',
        name: userDetails?.user_name,
        email: userDetails?.email,
      });
    }
  }, [userDetails]);

  return (
    <Box
      sx={{
        backgroundImage: `url('your-background-image-url')`,
        backgroundSize: "cover",
        minHeight: "100vh",
        paddingTop: "20px", // Adjust as needed
      }}
    >


      <Container maxWidth="md">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4, backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
              <div className="userprofile">
                {formData?.selectedProfilePic ? (
                  <>
                  <img
                    alt="User Avatar"
                    src = {`${REACT_APP_IMAGE_URL}${formData?.selectedProfilePic}`}
                  />
                  </>
                ) : (
                  <>
                  <img
                    alt="User Avatar"
                    src = {DefaultUserProfile}
                  />
                  </>
                )}
             <label htmlFor="avatar-input"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 1.25a.75.75 0 0 1 .57.262l3 3.5a.75.75 0 1 1-1.14.976l-1.68-1.96V15a.75.75 0 0 1-1.5 0V4.027L9.57 5.988a.75.75 0 1 1-1.14-.976l3-3.5A.75.75 0 0 1 12 1.25M6.996 8.252a.75.75 0 0 1 .008 1.5c-1.093.006-1.868.034-2.457.142c-.566.105-.895.272-1.138.515c-.277.277-.457.666-.556 1.4c-.101.755-.103 1.756-.103 3.191v1c0 1.436.002 2.437.103 3.192c.099.734.28 1.122.556 1.4c.277.276.665.456 1.4.555c.754.102 1.756.103 3.191.103h8c1.435 0 2.436-.001 3.192-.103c.734-.099 1.122-.279 1.399-.556s.457-.665.556-1.399c.101-.755.103-1.756.103-3.192v-1c0-1.435-.002-2.436-.103-3.192c-.099-.733-.28-1.122-.556-1.399c-.244-.243-.572-.41-1.138-.515c-.589-.108-1.364-.136-2.457-.142a.75.75 0 1 1 .008-1.5c1.082.006 1.983.032 2.72.167c.758.14 1.403.405 1.928.93c.602.601.86 1.36.982 2.26c.116.866.116 1.969.116 3.336v1.11c0 1.368 0 2.47-.116 3.337c-.122.9-.38 1.658-.982 2.26s-1.36.86-2.26.982c-.867.116-1.97.116-3.337.116h-8.11c-1.367 0-2.47 0-3.337-.116c-.9-.121-1.658-.38-2.26-.982s-.86-1.36-.981-2.26c-.117-.867-.117-1.97-.117-3.337v-1.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.525-.524 1.17-.79 1.928-.929c.737-.135 1.638-.161 2.72-.167" clip-rule="evenodd" /></svg></label>

                <input
                  id="avatar-input"
                  type="file"
                  accept='.jpeg,.jpg,.png'
                  className="form-control"
                  onChange={(e) => {
                    handleImageChange(e.target.files);
                    e.target.value = "";
                  }}
                  style={{ display: "none", cursor: "pointer" }}
                />

              </div>

              <Typography variant="h4" className="mb-2" gutterBottom>
                <FormLabel className="mb-2">Name:</FormLabel>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errros?.name && <div className="error_msg">{errros?.name}</div>}
              </Typography>
              <Typography variant="body1" className="mb-2" gutterBottom>
                <FormLabel className="mb-2">Email:</FormLabel>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </Typography>
              {/* <Typography variant="body1" className="mb-2" gutterBottom>
                <FormLabel className="mb-2">Bio:</FormLabel>
                <textarea
                  type="text"
                  name="bio"
                  placeholder="Enter bio"
                  className="form-control"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </Typography> */}
              {/* <Typography variant="body1" className="text-dark" align="center" gutterBottom>
                Last Login Date: {getDate(user.loginDate)}
              </Typography> */}
              <Button
                variant="unset"
                className="btn common-button"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSave}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

    </Box>
  );
};

export default AdminProfile;
