import { FormControl } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import { create_faq_question, get_return_policy_data } from "../../reduxData/cms/cmsAction";

const normalizeStatus = (v) => {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  return false;
};

const ReturnPolicy = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { returnpolicydata } = useSelector((state) => state.cms);

  const [formData, setFormData] = useState({
    content: "",
    status: false, // default false
  });

  const [errors, setErrors] = useState({ content: "" });
  const [isPermission, setIsPermission] = useState(false);

  useEffect(() => {
    setIsPermission(
      (user?.role === "staff" && user?.permission?.p_staff > 1) ||
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
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleStatus = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, status: checked }));
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
        name: "return_policy",
        type: "return_policy",
        status: Boolean(formData.status),
        content: { Content: formData.content },
      };

      const contentId = returnpolicydata ? returnpolicydata?.id : null;
      await create_faq_question(
        localStorage.getItem("token"),
        quest_data,
        contentId,
        dispatch
      );
      await get_return_policy_data(localStorage.getItem("token"), "return_policy", dispatch);
    }
  };

  // Fetch once on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      get_return_policy_data(token, "return_policy", dispatch);
    }
  }, [dispatch]);

  // Update from API response
  useEffect(() => {
    if (!returnpolicydata) return;

    setFormData((prev) => {
      const next = { ...prev };

      if (
        returnpolicydata?.content?.Content !== undefined &&
        returnpolicydata?.content?.Content !== null
      ) {
        next.content = returnpolicydata.content.Content;
      }

      if (Object.prototype.hasOwnProperty.call(returnpolicydata, "status")) {
        next.status = normalizeStatus(returnpolicydata.status);
      }

      return next;
    });
  }, [returnpolicydata]);

  return (
    <div className="mt-1">
      <div className="container">
        <h3 className="mb-0 fw-600">Return Policy</h3>
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
                checked={!!formData.status}
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

export default ReturnPolicy;
