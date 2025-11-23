import { FormControl, FormLabel, Input } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  add_badge,
  get_badge_lists,
  upload_sell_item_photo,
} from "../reduxData/user/userAction";
import { useDispatch } from "react-redux";


const AddBadge = ({ show, handleClose, data }) => {
  const [formData, setFormData] = useState({
    name: "",
    badge_image: "",
    badge: "", 
    min_point: "",
    max_point: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    badge_image: "",
    badge: "", 
    min_point: "",
    max_point: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [removePhotos, setRemovePhotos] = useState([]);
  const dispatch = useDispatch();
  const imageRef = useRef();
  const badgeRef = useRef();

  const handleClick = () => {
    imageRef.current.click();
  };

  const handleChange = (value, label) => {
    switch (label) {
      case "name":
        setErrors({
          ...errors,
          name: !value ? "Badge Name is required" : null,
        });
        setFormData({ ...formData, name: value });
        break;
      case "min_point":
        setErrors({
          ...errors,
          min_point: !value ? "Minimun Point is required" : null,
        });
        setFormData({ ...formData, min_point: value });
        break;
      case "max_point":
        setErrors({
          ...errors,
          max_point: !value ? "Maximum point is required" : null,
        });
        setFormData({ ...formData, max_point: value });
        break;
      default:
        setFormData({ ...formData, [label]: value });
        break;
    }
  };

  const handleImageChange = async (e) => {
    setIsEdit(true);
    const imageUpload = [e.target.files[0]];
    const photoData = await upload_sell_item_photo(
      imageUpload,
      localStorage.getItem("token"),
      dispatch
    );
    const photosFiles = photoData?.data?.photos[0];
    setFormData({ ...formData, badge_image: photosFiles });
    setErrors({ ...errors, badge_image: null });
  };

  const handleBadgeImageChange = async (e) => {
    setIsEdit(true);
    const imageUpload = [e.target.files[0]];
    const photoData = await upload_sell_item_photo(
      imageUpload,
      localStorage.getItem("token"),
      dispatch
    );
    const photosFiles = photoData?.data?.photos[0];
    setFormData({ ...formData, badge: photosFiles });
    setErrors({ ...errors, badge: null });
  };

  const handleCancel = () => {
    setFormData({ name: "", badge_image: "", badge: "", min_point: "", max_point: "" });
    setErrors({ name: "", badge_image: "", badge: "", min_point: "", max_point: "" });
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, badge_image, badge ,min_point, max_point } = formData;
    setErrors({
      name: !name ? "Badge Name is required" : null,
      badge_image: !badge_image ? "Badge Image is required" : null,
      badge: !badge ? "Badge Image is required" : null,
      min_point: !min_point ? "Minimun Point is required" : null,
      max_point: !max_point ? "Maximum point is required" : null,
    });
    if (name && badge_image && min_point && max_point) {
      const badgedata = {
        name: formData?.name,
         image: formData?.badge_image, // This is the first image
        badge: formData?.badge, 
        min_point: formData?.min_point,
        max_point: formData?.max_point,
      };
      if (data?._id) {
        badgedata.removePhotos = isEdit === true ? removePhotos : [];
      }
      let added_badge = await add_badge(
        localStorage.getItem("token"),
        badgedata,
        data?._id,
        dispatch
      );
      if (added_badge) {
        await get_badge_lists(localStorage.getItem("token"), dispatch);
        handleCancel();
      }
    }
  };

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        name: data?.name || "",
        badge_image: data?.image || "",
        badge: data?.badge || "",
        min_point: data?.min_point || "",
        max_point: data?.max_point || "",
      }));
      setRemovePhotos([data?.image, data?.badge]);
      setImagePreview(null);
      setErrors({ name: "", badge_image: "", min_point: "", max_point: "" });
    }
  }, [data]);

  return (
    <Modal show={show}>
      <Modal.Body>
        <Modal.Title>{data ? "Edit" : "Add"} Badge</Modal.Title>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <FormControl className="mt-1 mb-2">
            <FormLabel className="fw-600">Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData?.name}
              onChange={(e) => handleChange(e.target.value, "name")}
            />
            {errors?.name && <div className="error_msg">{errors?.name}</div>}
          </FormControl>
          <div className="row">
            <div className="col-md-6">
              <FormControl className="mt-1 mb-2">
                <FormLabel className="fw-600">Minimum Point</FormLabel>
                <Input
                  type="number"
                  name="min_point"
                  placeholder="Enter point"
                  value={formData?.min_point}
                  onChange={(e) => handleChange(e.target.value, "min_point")}
                />
                {errors?.min_point && (
                  <div className="error_msg">{errors?.min_point}</div>
                )}
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl className="mt-1 mb-2">
                <FormLabel className="fw-600">Maximum Point</FormLabel>
                <Input
                  type="number"
                  name="max_point"
                  placeholder="Enter point"
                  value={formData?.max_point}
                  onChange={(e) => handleChange(e.target.value, "max_point")}
                />
                {errors?.max_point && (
                  <div className="error_msg">{errors?.max_point}</div>
                )}
              </FormControl>
            </div>
          </div>
          {/* <FormControl className="mt-2 mb-2">
            <FormLabel className="fw-600">Badge Image</FormLabel>
            {formData?.badge_image && (
              <div className="position-relative pb-3 d-flex h-100">
                <img
                  src={`${formData?.badge_image}`}
                  style={{
                    height: "240px",
                    width: "80%",
                  }}
                />
                <div className="upload-file-close">
                  <button
                    type="button"
                    className="btn btn-sm rounded-circle"
                    onClick={() => {
                      setFormData({ ...formData, badge_image: "" });
                    }}
                  >
                    <i class="fa-solid fa-xmark color-white"></i>
                  </button>
                </div>
              </div>
            )}
            <input
              type="file"
              className="d-none"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              ref={imageRef}
              onChange={handleImageChange}
            />
            <Button className="btn upload-button" onClick={handleClick}>
              Upload
            </Button>
            {errors?.badge_image && (
              <div className="error_msg">{errors?.badge_image}</div>
            )}
          </FormControl> */}
          <div className="row">
            {/* First Image Upload */}
            <div className="col-12">
              <FormControl className="mt-2 mb-2">
                <FormLabel className="fw-600">Image</FormLabel>
                {formData?.badge_image && (
                  <div className="position-relative pb-3 d-flex h-100">
                    <img src={`${formData?.badge_image}`} style={{ height: "100px" }} />
                    <div className="upload-file-close">
                      <button type="button" className="btn btn-sm rounded-circle" onClick={() => { setFormData({ ...formData, badge_image: "" }); }}>
                        <i className="fa-solid fa-xmark color-white"></i>
                      </button>
                    </div>
                  </div>
                )}
                <input type="file" className="d-none" accept="image/png, image/jpg, image/jpeg, image/gif" ref={imageRef} onChange={handleImageChange} />
                <Button className="btn upload-button" onClick={() => imageRef.current.click()}>Upload</Button>
                {errors?.badge_image && (<div className="error_msg">{errors?.badge_image}</div>)}
              </FormControl>
            </div>

            {/* Second Image (Badge) Upload */}
            <div className="col-12">
              <FormControl className="mt-2 mb-2">
                <FormLabel className="fw-600">Badge</FormLabel>
                {formData?.badge && (
                  <div className="position-relative pb-3 d-flex h-100">
                    <img src={`${formData?.badge}`} style={{ height: "100px" }} />
                    <div className="upload-file-close">
                      <button type="button" className="btn btn-sm rounded-circle" onClick={() => { setFormData({ ...formData, badge: "" }); }}>
                        <i className="fa-solid fa-xmark color-white"></i>
                      </button>
                    </div>
                  </div>
                )}
                <input type="file" className="d-none" accept="image/png, image/jpg, image/jpeg, image/gif" ref={badgeRef} onChange={handleBadgeImageChange} />
                <Button className="btn upload-button" onClick={() => badgeRef.current.click()}>Upload</Button>
                {errors?.badge && (<div className="error_msg">{errors?.badge}</div>)}
              </FormControl>
            </div>
          </div>
          <div className="d-flex justify-content-space-between gap-2">
            <Button type="submit" className="btn common-button">
              {data ? "Edit" : "Save"}
            </Button>
            <Button
              className="question-button"
              variant="danger"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBadge;
