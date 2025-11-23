import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FormControl, FormLabel, Input, Select, Option } from "@mui/joy";
import {
  createAwardAPI,
  updateAwardAPI,
  uploadAwardImageAPI,
} from "../reduxData/user/userAction";

const AddAward = ({ show, handleClose, data, onSave }) => {
  const initialState = {
    text: "",
    type: "", 
    image: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      setFormData({
        text: data.text || "",
        type: data.type || "",
        image: data.image || "",
      });
    } else {
      setFormData(initialState);
    }
    setErrors({}); 
  }, [data, show]);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const uploadData = new FormData();
      uploadData.append("awardImage", file);

      setIsUploading(true);
      const result = await uploadAwardImageAPI(uploadData);
      setIsUploading(false);

      if (result && result.imageUrl) {
        setFormData({ ...formData, image: result.imageUrl });
        setErrors({ ...errors, image: "" });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.text) newErrors.text = "Award text is required.";
    if (!formData.image) newErrors.image = "Award image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let success = false;
    if (data?._id) {
    // This is the only change needed. Replace the placeholder.
    success = await updateAwardAPI(data._id, formData);
  } else {
    success = await createAwardAPI(formData);
  }

    if (success) {
      onSave(); 
      handleModalClose();
    }
  };

  const handleModalClose = () => {
    setFormData(initialState);
    setErrors({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{data ? "Edit" : "Add"} Award</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <FormControl className="mb-3">
            <FormLabel>Badge Text/Description</FormLabel>
            <Input
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              placeholder="e.g., 'Awarded to the first 100 users who signed up'"
              error={!!errors.text}
            />
            {errors.text && (
              <div className="text-danger mt-1">{errors.text}</div>
            )}
          </FormControl>

          <FormControl className="mb-3">
            <FormLabel>Award Name</FormLabel>
            <div className="form-text mb-2 mt-0">
              Used by the devs for automatically assigning the badge to users
            </div>
            <Input
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="e.g., 'Verification'"
            />
          </FormControl>

          <FormControl className="mb-3">
            <FormLabel>Award Image</FormLabel>
            <input
              type="file"
              accept="image/*"
              className="d-none"
              ref={imageInputRef}
              onChange={handleImageChange}
            />
            <Button
              variant="outline-secondary"
              onClick={() => imageInputRef.current.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
            {errors.image && (
              <div className="text-danger mt-1">{errors.image}</div>
            )}
          </FormControl>

          {formData.image && (
            <div className="mt-2 text-center">
              <img
                src={formData.image}
                alt="Award Preview"
                style={{ width: "100px"}}
              />
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit" variant="warning">
              {data ? "Save Changes" : "Create Award"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAward;
