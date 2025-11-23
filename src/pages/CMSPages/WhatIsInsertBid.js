import React, { useEffect, useRef, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import { upload_sell_item_photo } from "../../reduxData/user/userAction";
import ReactQuill from "react-quill";
import { FormControl } from "@mui/joy";
import {
  create_faq_question,
  get_all_faq_questions,
  upload_cms_photo,
} from "../../reduxData/cms/cmsAction";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const WhatIsInsertBid = ({ faqItems }) => {
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
  const [formData, setFormData] = useState({
    content: "",
    image: "",
    status: false,
  });
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    content: "",
    image: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [removePhotos, setRemovePhotos] = useState([]);
  const imageRef = useRef();
  const handleClick = () => {
    imageRef.current.click();
  };

  const handleImageChange = async (e) => {
    const imageUpload = [e.target.files[0]];
    const photoData = await upload_cms_photo(
      imageUpload,
      localStorage.getItem("token"),
      dispatch
    );
    const photosFiles = photoData?.data?.photos[0];
    setFormData({ ...formData, image: photosFiles });
    setErrors({ ...errors, image: null });
    setIsEdit(true);
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

  const handleChange = (value, label) => {
    switch (label) {
      case "content":
        setErrors({
          ...errors,
          content:
            !value || value === "<p><br></p>" ? "Content is required" : null,
        });
        setFormData({ ...formData, content: value });
        break;
      default:
        setFormData({ ...formData, [label]: value });
        break;
    }
  };

  const handleStatus = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFormData({ ...formData, status: true });
    } else {
      setFormData({ ...formData, status: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { content, image } = formData;
    setErrors({
      ...errors,
      content:
        !content || content === "<p><br></p>" ? "Content is required" : null,
      image: !image ? "Image is required" : null,
    });
    if (content && image) {
      const quest_data = {
        name: "What_InsertBid",
        type: "What_InsertBid",
        status: formData.status,
        content: {
          content1: formData?.content,
          image: formData?.image,
        },
        removePhotos:
          isEdit === true && removePhotos?.length > 0 ? removePhotos : [],
      };
      await create_faq_question(
        localStorage.getItem("token"),
        quest_data,
        faqItems[0]?._id,
        dispatch
      );
      setRemovePhotos([]);
      await get_all_faq_questions(
        localStorage.getItem("token"),
        "What_InsertBid",
        dispatch
      );
      setIsEdit(false);
    }
  };

  useEffect(() => {
    const handleQuest = async () => {
      await get_all_faq_questions(
        localStorage.getItem("token"),
        "What_InsertBid",
        dispatch
      );
    };
    handleQuest();
  }, []);

  useEffect(() => {
    if (faqItems) {
      setFormData({
        ...formData,
        content: faqItems[0]?.content?.content1,
        image: faqItems[0]?.content?.image,
        status: faqItems[0]?.status,
      });
      setRemovePhotos([faqItems[0]?.content?.image]);
      setErrors({ content: "", image: "" });
    }
  }, [faqItems]);

  return (
    <div className="mt-1">
      <div className="container">
        {/* <h3 className="mb-0 fw-600">What's Bid4 Styles</h3> */}
        <Form onSubmit={handleSubmit}>
          <FormControl className="mt-2 mb-2">
            <FormLabel className="fw-600">Content</FormLabel>
            <ReactQuill
              name="answer"
              value={formData.content}
              modules={modules}
              disabled={!isPermission}
              onChange={(value) => handleChange(value, "content")}
            />
            {errors?.content && (
              <div className="error_msg">{errors?.content}</div>
            )}
          </FormControl>
          <FormControl className="mt-2 mb-2">
            <FormLabel className="fw-600">Image</FormLabel>
            {formData?.image && (
              <div className="position-relative pb-3 d-flex h-100">
                <img
                  src={`${formData?.image}`}
                  style={{
                    height: "500px",
                    width: "90%",
                  }}
                />
                {isPermissionDelete && (
                  <div className="position-absolute upload-file-close">
                    <button
                      type="button"
                      className="btn btn-sm rounded-circle"
                      disabled={!isPermission}
                      onClick={() => {
                        setFormData({ ...formData, image: "" });
                      }}
                    >
                      <i class="fa-solid fa-xmark color-white"></i>
                    </button>
                  </div>
                )}
              </div>
            )}
            <input
              type="file"
              className="d-none"
              disabled={!isPermission}
              accept="image/png, image/jpg, image/jpeg, image/gif"
              ref={imageRef}
              onChange={handleImageChange}
            />
            <Button
              className="btn upload-button"
              disabled={!isPermission}
              onClick={handleClick}
            >
              Upload
            </Button>
            {errors?.image && <div className="error_msg">{errors?.image}</div>}
          </FormControl>
          <FormControl className="mt-1 mb-2">
            <FormLabel className="fw-600">Status</FormLabel>
            <div class="form-check form-switch switch-large">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked={formData.status}
                disabled={!isPermission}
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    faqItems: state.cms.faqItems,
  };
};
export default connect(mapStateToProps)(WhatIsInsertBid);
