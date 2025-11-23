import React, { useEffect, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import { FormControl } from "@mui/joy";
import ReactQuill from "react-quill";
import {
  create_faq_question,
  get_privacy_policy_data,
} from "../../reduxData/cms/cmsAction";
import { useDispatch, useSelector } from "react-redux";

const normalizeStatus = (v) => {
  // Converts many possible API shapes into a strict boolean
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  return false;
};

const Policy = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { privacypolicydata } = useSelector((state) => state.cms);

  // default status is false
  const [formData, setFormData] = useState({
    content: "",
    status: false,
  });

  const [errors, setErrors] = useState({ content: "" });
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

  const modules = {
    toolbar: [
      [{ font: [] }, { size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }, { align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
      [{ undo: "undo" }, { redo: "redo" }],
    ],
    history: { delay: 1000, maxStack: 100, userOnly: true },
  };

  const handleQuillChange = (value) => {
    setErrors({
      ...errors,
      content: !value || value === "<p><br></p>" ? "Content is required" : null,
    });
    setFormData((p) => ({ ...p, content: value }));
  };

  const handleStatus = (e) => {
    const { checked } = e.target;
    setFormData((p) => ({ ...p, status: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { content } = formData;
    setErrors({
      ...errors,
      content: !content || content === "<p><br></p>" ? "Content is required" : null,
    });

    if (content) {
      const quest_data = {
        name: "privacy_policy",
        type: "privacy_policy",
        status: Boolean(formData.status), // ensure boolean
        content: {
          Content: formData.content,
        },
      };

      const contentId = privacypolicydata ? privacypolicydata?.id : null;
      await create_faq_question(localStorage.getItem("token"), quest_data, contentId, dispatch);
      await get_privacy_policy_data(localStorage.getItem("token"), "privacy_policy", dispatch);
    }
  };

  // fetch on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      get_privacy_policy_data(token, "privacy_policy", dispatch);
    }
  }, [dispatch]);

  // update formData only when API actually provides fields
  useEffect(() => {
    if (!privacypolicydata) return;

    setFormData((prev) => {
      const next = { ...prev };

      // if API provides content, overwrite; otherwise keep previous
      if (privacypolicydata?.content?.Content !== undefined && privacypolicydata?.content?.Content !== null) {
        next.content = privacypolicydata.content.Content;
      }

      // only overwrite status if API explicitly has the 'status' key
      if (Object.prototype.hasOwnProperty.call(privacypolicydata, "status")) {
        next.status = normalizeStatus(privacypolicydata.status);
      }

      return next;
    });
  }, [privacypolicydata]);

  // optional debugging:
  // console.log("API status raw:", privacypolicydata?.status, " => formData.status:", formData.status);

  return (
    <div className="mt-1">
      <div className="container">
        <h3 className="mb-0 fw-600">Privacy Policy</h3>
        <Form onSubmit={handleSubmit}>
          <FormControl className="mt-2 mb-2">
            <FormLabel className="fw-600">Content</FormLabel>
            <ReactQuill
              name="answer"
              value={formData.content}
              modules={modules}
              disabled={!isPermission}
              onChange={handleQuillChange}
            />
            {errors?.content && <div className="error_msg">{errors?.content}</div>}
          </FormControl>

          <FormControl className="mt-1 mb-2">
            <FormLabel className="fw-600">Status</FormLabel>
            <div className="form-check form-switch switch-large">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                disabled={!isPermission}
                checked={!!formData.status} // strict boolean
                onChange={handleStatus}
              />
            </div>
          </FormControl>

          <Button type="submit" className="btn common-button" disabled={!isPermission}>
            Save
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Policy;

