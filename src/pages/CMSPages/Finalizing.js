import { FormControl, FormHelperText, Input } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import ReactQuill from "react-quill";
import { upload_sell_item_photo } from "../../reduxData/user/userAction";
import {
  create_faq_question,
  get_all_faq_questions,
} from "../../reduxData/cms/cmsAction";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const Finalizing = ({ faqItems }) => {
  const [formdata, setFormdata] = useState({
    heading: "",
    status: false,
  });
  const [errors, setErrors] = useState({
    heading: "",
  });
  const dispatch = useDispatch();
  const [contentData, setContentData] = useState([]);
  const [contentErrors, setContentErrors] = useState([]);
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
  const handleAddContent = (label) => {
    if (label === "content") {
      setContentData([...contentData, { type: "content", content: "" }]);
      setContentErrors([...contentErrors, { type: "content", content: "" }]);
    } else if (label === "image") {
      setContentData([...contentData, { type: "imagePath", imagePath: "" }]);
      setContentErrors([
        ...contentErrors,
        { type: "imagePath", imagePath: "" },
      ]);
    }
  };

  const handleRemove = (index, label) => {
    const removedContent = contentData?.filter((_, i) => i !== index);
    setContentData(removedContent);
    const removeErrors = contentErrors?.filter((_, i) => i !== index);
    setContentErrors(removeErrors);
  };

  const handleChange = (value) => {
    setFormdata({ ...formdata, heading: value });
    setErrors({ ...errors, heading: !value ? "Heading is required" : null });
  };

  const handleStatus = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFormdata({ ...formdata, status: true });
    } else {
      setFormdata({ ...formdata, status: false });
    }
  };

  const handleContentChange = async (label, value, index) => {
    const updatedContent = [...contentData];
    const updatedErrors = [...contentErrors];
    if (label === "content") {
      updatedContent[index].content = value;
      setContentData(updatedContent);
      updatedErrors[index].content =
        !value || value === "<p><br></p>" || value === "<h3><br></h3>"
          ? `Content is required`
          : null;
      setContentErrors(updatedErrors);
    } else if (label === "image") {
      const uploaded = [value];
      const photoData = await upload_sell_item_photo(
        uploaded,
        localStorage.getItem("token"),
        dispatch
      );
      updatedContent[index].imagePath = photoData?.data?.photos[0] || "";
      setContentData(updatedContent);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formvalid = true;

    setErrors({ heading: !formdata.heading ? "Heading is required" : null });

    const newErrors = [...contentErrors];

    contentData?.forEach((item, index) => {
      if (item.type === "content") {
        if (
          item?.content === "" ||
          item?.content === "<p><br></p>" ||
          item?.content === "<h3><br></h3>"
        ) {
          newErrors[index] = {
            ...newErrors[index],
            content: `Content is required`,
          };
          formvalid = false;
        }
      }

      if (item?.type === "imagePath") {
        if (item?.imagePath === "") {
          newErrors[index] = {
            ...newErrors[index],
            imagePath: `Image is required`,
          };
          formvalid = false;
        }
      }
    });
    setContentErrors([...newErrors]);

    if (formvalid && formdata?.heading) {
      const content = {
        name: "finalizing_collectible",
        type: "finalizing_collectible",
        status: formdata.status,
        content: {
          heading: formdata.heading,
          contentData,
        },
      };
      await create_faq_question(
        localStorage.getItem("token"),
        content,
        faqItems[0]?._id,
        dispatch
      );
      await get_all_faq_questions(
        localStorage.getItem("token"),
        "finalizing_collectible",
        dispatch
      );
      console.log("Data Conterttt", content);
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

  useEffect(() => {
    const handleQuest = async () => {
      await get_all_faq_questions(
        localStorage.getItem("token"),
        "finalizing_collectible",
        dispatch
      );
    };
    handleQuest();
  }, []);

  useEffect(() => {
    if (faqItems?.length > 0 && faqItems[0]?.content) {
      setFormdata({
        heading: faqItems[0]?.content?.heading,
        status: faqItems[0]?.status,
      });
      setContentData(faqItems[0]?.content?.contentData);
      const newErr =
        faqItems[0]?.content?.contentData?.map((item) => {
          if (item.type === "content") {
            return { ...item, content: "" };
          } else if (item.type === "imagePath") {
            return { ...item, imagePath: "" };
          } else {
            return item;
          }
        }) || [];
      setContentErrors(newErr);
    }
  }, [faqItems]);

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between">
        <h5 className="mb-2 fw-600 pt-2">Finalizing the sale</h5>
        <div className="d-flex gap-3">
          <Button
            type="button"
            className="btn common-button"
            disabled={!isPermission}
            onClick={() => handleAddContent("content")}
          >
            Add Content +
          </Button>
          <Button
            type="button"
            className="btn common-button"
            disabled={!isPermission}
            onClick={() => handleAddContent("image")}
          >
            Add Image +
          </Button>
        </div>
      </div>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <FormControl className="mt-2 mb-2">
          <FormLabel className="fw-600">Heading</FormLabel>
          <Input
            type="text"
            name="answer"
            disabled={!isPermission}
            value={formdata?.heading}
            onChange={(e) => handleChange(e.target.value)}
          />
          {errors?.heading && (
            <div className="error_msg">{errors?.heading}</div>
          )}
        </FormControl>
        {contentData?.map((item, index) =>
          item.type === "content" ? (
            <div key={index} className="position-relative">
              <FormControl className="mt-1 mb-2">
                <FormLabel className="fw-600">Content</FormLabel>
                <ReactQuill
                  name="answer"
                  value={item?.content}
                  modules={modules}
                  disabled={!isPermission}
                  onChange={(value) =>
                    handleContentChange("content", value, index)
                  }
                />
                {contentErrors[index] && contentErrors[index]?.content && (
                  <FormHelperText style={{ color: "red" }}>
                    {contentErrors[index]?.content}
                  </FormHelperText>
                )}
              </FormControl>
              <div className="position-absolute upload-file-close pt-4 ms-2">
                <button
                  type="button"
                  className="btn btn-sm rounded-circle"
                  disabled={!isPermission}
                  onClick={() => handleRemove(index, "content")}
                >
                  <i class="fa-solid fa-xmark color-white"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="upload-file position-relative" key={index}>
              <FormControl className="mt-2 mb-2">
                <FormLabel className="fw-600">Image</FormLabel>
                {item?.imagePath ? (
                  <img
                    src={`${item?.imagePath}`}
                    style={{
                      height: "400px",
                      width: "100%",
                    }}
                  />
                ) : (
                  <label
                    className="form-control text-center"
                    style={{
                      height: "200px",
                      paddingTop: "3rem",
                      marginTop: "1rem",
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
                      disabled={!isPermission}
                      accept="image/png, image/jpeg, image/jpg, image/gif"
                      onChange={(e) =>
                        handleContentChange("image", e.target.files[0], index)
                      }
                    />
                  </label>
                )}
                {isPermissionDelete && (
                  <div className="position-absolute upload-file-close">
                    <button
                      type="button"
                      className="btn btn-sm rounded-circle"
                      onClick={() => handleRemove(index, "image")}
                    >
                      <i class="fa-solid fa-xmark color-white"></i>
                    </button>
                  </div>
                )}
                {contentErrors[index] && contentErrors[index]?.imagePath && (
                  <FormHelperText style={{ color: "red" }}>
                    {contentErrors[index]?.imagePath}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
          )
        )}

        <FormControl className="mt-1 mb-2">
          <FormLabel className="fw-600">Status</FormLabel>
          <div class="form-check form-switch switch-large">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              checked={formdata.status}
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
  );
};

const mapStateToProps = (state) => {
  return {
    faqItems: state.cms.faqItems,
  };
};
export default connect(mapStateToProps)(Finalizing);
