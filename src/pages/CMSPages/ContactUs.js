import { FormControl, Input } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { upload_sell_item_photo } from "../../reduxData/user/userAction";
import TagsInput from "react-tagsinput";
import AutoInput from "../../Shared/AutoInput";
import {
  create_faq_question,
  get_contact_us_content,
  upload_cms_photo,
} from "../../reduxData/cms/cmsAction";
import { connect } from "react-redux";
import { useSelector } from "react-redux";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const ContactUs = ({ contactCont }) => {
  const [formData, setFormData] = useState({
    heading: "",
    content: "",
    image: "",
    emailoptions: [],
    status: false,
  });

  const [errors, setErrors] = useState({
    heading: "",
    content: "",
    image: "",
    emailoptions: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [removePhotos, setRemovePhotos] = useState([]);

  const [location, setLocation] = useState("");
  const [locationErrors, setLocationErrors] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [isPermission, setIsPermission] = useState(false);
  const [isPermissionDelete, setIsPermissionDelete] = useState(false);
  useEffect(() => {
    setIsPermission(
      (user?.role === "staff" && user?.permission?.p_staff > 1) ||
        user?.role !== "staff"
        ? true
        : false
    );
    setIsPermissionDelete(
      (user?.role === "staff" && user?.permission?.p_staff > 2) ||
        user?.role !== "staff"
        ? true
        : false
    );
  }, [user]);
  const dispatch = useDispatch();

  const handleChange = async (value, label) => {
    switch (label) {
      case "heading":
        setFormData({ ...formData, heading: value });
        setErrors({
          ...errors,
          heading: !value ? "Heading is required" : null,
        });
        break;
      case "content":
        setErrors({
          ...errors,
          content:
            !value || value === "<p><br></p>" ? "Content is required" : null,
        });
        setFormData({ ...formData, content: value });
        break;
      case "image":
        const imageupload = [value];
        const photoData = await upload_cms_photo(
          imageupload,
          localStorage.getItem("token"),
          dispatch
        );
        setFormData({ ...formData, image: photoData?.data?.photos[0] || "" });
        setErrors({ ...errors, image: null });
        setIsEdit(true);
        break;
      default:
        setFormData({ ...formData, [label]: value });
        break;
    }
  };

  const handleEmailOptions = (emails) => {
    const newEmails = emails?.map((email) => email.trim());
    const invalidEmails = newEmails?.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
    if (newEmails?.length === 0) {
      setErrors({ ...errors, emailoptions: "Email is required" });
    }

    if (invalidEmails?.length > 0) {
      setErrors({ ...errors, emailoptions: "Enter the Valid Email" });
      setTimeout(() => {
        setErrors({ ...errors, emailoptions: null });
      }, 2000);
    }

    if (newEmails?.length > 0 && invalidEmails?.length === 0) {
      setErrors({ ...errors, emailoptions: null });
    }

    setFormData({
      ...formData,
      emailoptions: emails?.filter((email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ),
    });
  };

  const handleLocation = (value, label) => {
    setLocation(value);
    setLocationErrors(!value ? "Location is required" : null);
  };

  const handleStatus = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFormData({ ...formData, status: true });
    } else {
      setFormData({ ...formData, status: false });
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
    ],
  };

  const handleRemove = () => {
    setFormData({ ...formData, image: "" });
    setErrors({ ...errors, image: "Image is required" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { heading, content, image, emailoptions } = formData;
    setErrors({
      ...errors,
      heading: !heading ? "Heading is required" : null,
      content:
        !content || content === "<p><br></p>" ? "Content is required" : null,
      image: image === "" ? "Image is required" : null,
      emailoptions: emailoptions.length === 0 ? "Email is required" : null,
    });
    setLocationErrors(location === "" ? "Location is required" : null);
    if (heading && content && image && emailoptions && location) {
      const contactdata = {
        name: "contact_data",
        type: "contact_data",
        status: formData.status,
        content: {
          heading: formData.heading,
          content: formData.content,
          image: formData.image,
          emails: formData.emailoptions,
          mailaddress: location,
        },
        removePhotos:
          isEdit === true && removePhotos?.length > 0 ? removePhotos : [],
      };
      // console.log("Data to be send....", contactdata);
      await create_faq_question(
        localStorage.getItem("token"),
        contactdata,
        contactCont[0]?._id,
        dispatch
      );
      await get_contact_us_content(
        localStorage.getItem("token"),
        "contact_data",
        dispatch
      );
      setIsEdit(false);
    }
  };

  useEffect(() => {
    const handleData = async () => {
      await get_contact_us_content(
        localStorage.getItem("token"),
        "contact_data",
        dispatch
      );
    };
    handleData();
  }, []);

  useEffect(() => {
    if (contactCont && contactCont?.length > 0) {
      setFormData({
        heading: contactCont[0]?.content?.heading,
        content: contactCont[0]?.content?.content,
        image: contactCont[0]?.content?.image,
        emailoptions: contactCont[0]?.content?.emails,
        status: contactCont[0]?.status,
      });
      setLocation(contactCont[0]?.content?.mailaddress);
      setRemovePhotos([contactCont[0]?.content?.image]);
    }
  }, [contactCont]);

  return (
    <div className="container">
      <h3 className="fw-500">Contact Us</h3>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <FormControl className="mt-2 mb-2">
          <FormLabel className="fw-600">Heading</FormLabel>
          <Input
            type="text"
            name="answer"
            value={formData?.heading}
            placeholder="Enter heading"
            disabled={!isPermission}
            onChange={(e) => handleChange(e.target.value, "heading")}
          />
          {errors?.heading && (
            <div className="error_msg">{errors?.heading}</div>
          )}
        </FormControl>
        <FormControl className="mt-2 mb-2">
          <FormLabel className="fw-600">Content</FormLabel>
          <ReactQuill
            name="answer"
            value={formData.content}
            modules={modules}
            placeholder="enter content"
            disabled={!isPermission}
            onChange={(value) => handleChange(value, "content")}
          />
          {errors?.content && (
            <div className="error_msg">{errors?.content}</div>
          )}
        </FormControl>
        <FormControl className="mt-1 mb-2">
          <FormLabel className="fw-600">Image</FormLabel>
          {formData?.image ? (
            <div className="position-relative">
              <img
                src={`${formData?.image}`}
                style={{
                  height: "400px",
                  width: "100%",
                }}
              />
              {isPermissionDelete && (
                <div className="position-absolute upload-file-close mt-1">
                  <button
                    type="button"
                    className="btn btn-sm rounded-circle"
                    onClick={() => handleRemove()}
                  >
                    <i class="fa-solid fa-xmark color-white"></i>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <label
              className="form-control text-center"
              style={{
                height: "200px",
                paddingTop: "3rem",
                marginTop: "0.2rem",
              }}
            >
              +{" "}
              <span className="d-block">
                (Click to Upload Images){" "}
                <span className="d-block">
                  (Jpg, png, Webp, Avif, format support) &nbsp;
                </span>{" "}
              </span>
              <input
                className="form_control d-none"
                id="photos"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                disabled={!isPermission}
                onChange={(e) => handleChange(e.target.files[0], "image")}
              />
            </label>
          )}
          {errors?.image && <div className="error_msg">{errors?.image}</div>}
        </FormControl>
        <FormControl className="mt-1 mb-2 col-lg-9">
          <FormLabel className="fw-600">Emails</FormLabel>
          <div className="inpt_body">
            <TagsInput
              className="input-tag"
              value={formData?.emailoptions}
              inputProps={{ placeholder: "Describe your Emails: (Hit enter)" }}
              disabled={!isPermission}
              onChange={handleEmailOptions}
            />
          </div>
          {errors?.emailoptions && (
            <div className="error_msg">{errors?.emailoptions}</div>
          )}
        </FormControl>
        <FormControl className="mt-2 mb-2">
          <FormLabel className="fw-600">Mailing Address</FormLabel>
          <AutoInput
            address={location}
            disabled={!isPermission}
            handleChange={(value, label) => handleLocation(value, label)}
          />
          {locationErrors && <div className="error_msg">{locationErrors}</div>}
        </FormControl>
        <FormControl className="mt-1 mb-2">
          <FormLabel className="fw-600">Status</FormLabel>
          <div class="form-check form-switch switch-large">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              disabled={!isPermission}
              id="flexSwitchCheckDefault"
              checked={formData.status}
              onChange={handleStatus}
            />
          </div>
        </FormControl>
        <Button
          type="submit"
          className="btn common-button"
          disabled={!isPermission}
        >
          Save
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    contactCont: state.cms.contactCont,
  };
};
export default connect(mapStateToProps)(ContactUs);
