import { FormControl, FormLabel, Input } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import { connect, useDispatch } from "react-redux";
import {
  upload_edit_item_video,
  upload_sell_item_photo,
} from "../../reduxData/user/userAction";
import {
  create_faq_question,
  get_all_faq_questions,
  upload_cms_photo,
  upload_cms_video,
} from "../../reduxData/cms/cmsAction";
import { useSelector } from "react-redux";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const HomeInsert = ({ insert_content }) => {
  const [formData, setFormData] = useState({
    question: "",
    content: "",
    contentwo: "",
    mediatype: "",
    mediaurl: "",
    status: false,
  });
  const [errors, setErrors] = useState({
    question: "",
    content: "",
    contenttwo: "",
    mediatype: "",
    mediaurl: "",
  });
  const [imagepreview, setImagePreview] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [removePhotos, setRemovePhotos] = useState([]);
  const [removeVideos, setRemoveVideos] = useState([]);
  const dispatch = useDispatch();
  const imageRef = useRef();
  const handleClick = () => {
    imageRef.current.click();
  };
  const urlPattern =
    /^(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+)(?:\/[^\s]*)?$/;
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

  const mediaTypes = [
    { label: "Upload Video", type: ".mp4, .mov" },
    {
      label: "Upload Image",
      type: "image/png, image/jpeg, image/jpg, image/gif",
    },
    { label: "Embedded Url", type: "url-embedded" },
  ];

  const handleChange = (value, label) => {
    switch (label) {
      case "question":
        setErrors({
          ...errors,
          question: !value ? "Question is required" : null,
        });
        setFormData({ ...formData, question: value });
        break;
      case "content":
        setErrors({
          ...errors,
          content:
            !value || value === "<p><br></p>" ? "Content is required" : null,
        });
        setFormData({ ...formData, content: value });
        break;
      case "mediaurl":
        setErrors({
          ...errors,
          mediaurl:
            value === ""
              ? "Media url is required"
              : !urlPattern.test(value)
              ? "Invalid Url"
              : null,
        });
        setFormData({ ...formData, mediaurl: value });
      default:
        setFormData({ ...formData, [label]: value });
        break;
    }
  };

  const handleImageChange = async (e) => {
    const fileUpload = [e.target.files[0]];
    let pathurl = "";
    if (formData?.mediatype === "image/png, image/jpeg, image/jpg, image/gif") {
      const photoData = await upload_cms_photo(
        fileUpload,
        localStorage.getItem("token"),
        dispatch
      );
      pathurl = photoData?.data?.photos[0];
      setIsEdit(true);
    }

    if (formData?.mediatype === ".mp4, .mov") {
      const videoData = await upload_cms_video(
        fileUpload,
        localStorage.getItem("token"),
        dispatch
      );
      pathurl = videoData?.data?.path[0];
      setIsEdit(true);
    }

    setFormData({ ...formData, mediaurl: pathurl });
    setErrors({ ...errors, mediaurl: null });
    // console.log("PAthththththt----------",pathurl);
    // const photoData = await upload_sell_item_photo(fileUpload, localStorage.getItem("token"));
    // const photosFiles = photoData?.data?.path[0];
    // setFormData({ ...formData, contentwo: photosFiles });
    // setImagePreview(photosFiles);
    // setErrors({ ...errors, contenttwo: null });
  };

  const handleStatus = (e) => {
    const { checked } = e.target;
    if (checked) {
      setFormData({ ...formData, status: true });
    } else {
      setFormData({ ...formData, status: false });
    }
  };

  const handleMedia = (val) => {
    setFormData({ ...formData, mediatype: val, mediaurl: "" });
    setErrors({ ...errors, mediatype: null });
    setIsEdit(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { question, content, contentwo, mediaurl, mediatype } = formData;
    let newerrors = {
      question: !question || question === "" ? "Question is required" : null,
      content:
        !content || content === "<p><br></p>" ? "Content is required" : null,
      contenttwo: !contentwo || contentwo === "" ? "Image is required" : null,
      mediatype:
        !mediatype || mediatype === "" ? "Select the Media Type" : null,
      mediaurl:
        mediatype !== "" && mediaurl === ""
          ? "Media is required"
          : mediatype === "url-embedded" && !urlPattern.test(mediaurl)
          ? "Invalid url"
          : null,
    };

    setErrors(newerrors);

    if (mediatype === "url-embedded" && !urlPattern.test(mediaurl)) return;

    if (question && content && mediatype) {
      const quest_data = {
        name: "InsertBid_content",
        type: "InsertBid_content",
        status: formData.status,
        content: {
          question: formData?.question,
          content1: formData?.content,
          imgPath: formData?.contentwo,
          mediatype: formData?.mediatype,
          mediaurl: formData?.mediaurl,
        },
        removeVideos:
          isEdit === true && removeVideos?.length > 0 ? removeVideos : [],
        removePhotos:
          isEdit === true && removePhotos?.length > 0 ? removePhotos : [],
      };

      await create_faq_question(
        localStorage.getItem("token"),
        quest_data,
        insert_content[0]?._id,
        dispatch
      );
      await get_all_faq_questions(
        localStorage.getItem("token"),
        "InsertBid_content",
        dispatch
      );
      setIsEdit(false);
    }
  };

  useEffect(() => {
    const handleQuest = async () => {
      await get_all_faq_questions(
        localStorage.getItem("token"),
        "InsertBid_content",
        dispatch
      );
    };
    handleQuest();
  }, []);

  useEffect(() => {
    if (insert_content?.length > 0) {
      setFormData({
        ...formData,
        question: insert_content[0]?.content?.question,
        content: insert_content[0]?.content?.content1,
        contentwo: insert_content[0]?.content?.imgPath,
        status: insert_content[0]?.status,
        mediatype: insert_content[0]?.content?.mediatype,
        mediaurl: insert_content[0]?.content?.mediaurl,
      });

      if (insert_content[0]?.content?.mediatype === ".mp4, .mov") {
        setRemoveVideos([insert_content[0]?.content?.mediaurl]);
      }

      if (
        insert_content[0]?.content?.mediatype ===
        "image/png, image/jpeg, image/jpg, image/gif"
      ) {
        setRemovePhotos([insert_content[0]?.content?.mediaurl]);
      }
    }
  }, [insert_content]);

  return (
    <div className="container">
      <Accordion defaultActiveKey={["0"]} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            {/* <h4 className="mb-0 fw-bold">About Bid4 Style</h4> */}
          </Accordion.Header>
          <Accordion.Body>
            <div>
              <Form onSubmit={handleSubmit}>
                <FormControl className="mt-1 mb-2">
                  <FormLabel className="fw-600">Question</FormLabel>
                  <Input
                    type="text"
                    name="question"
                    placeholder="Enter question"
                    value={formData?.question}
                    disabled={!isPermission}
                    onChange={(e) => handleChange(e.target.value, "question")}
                  />
                  {errors?.question && (
                    <div className="error_msg">{errors?.question}</div>
                  )}
                </FormControl>
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
                  <FormLabel className="fw-600">Media</FormLabel>
                  {/* <div className="d-flex"> */}
                  <FormLabel className="text-dark fw-600 mb-2">
                    Select the Media Type
                  </FormLabel>
                  <div className="password position-relative col-lg-3 col-md-3 mb-2">
                    <select
                      name="condition"
                      type="select"
                      className="form-control"
                      style={{ appearance: "menulist" }}
                      value={formData?.mediatype}
                      disabled={!isPermission}
                      onChange={(e) => handleMedia(e.target.value)}
                    >
                      <option value="select" disabled>
                        Select
                      </option>
                      {mediaTypes?.map((item, index) => (
                        <option key={index} value={item?.type}>
                          {item?.label}
                        </option>
                      ))}
                    </select>
                    {errors?.mediatype && (
                      <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                        {errors?.mediatype}
                      </p>
                    )}
                  </div>
                  {/* {errors?.condition && <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">{errors?.condition}</p>} */}
                  {/* </div> */}

                  {formData?.mediatype !== "" &&
                    (formData?.mediatype ===
                      "image/png, image/jpeg, image/jpg, image/gif" ||
                      formData?.mediatype === ".mp4, .mov") && (
                      <div>
                        {formData?.mediaurl && (
                          <div className="position-relative pb-3 d-flex h-100">
                            {formData?.mediaurl
                              ?.split(".")
                              .pop()
                              .toLowerCase() === "mp4" ||
                            formData?.mediaurl
                              ?.split(".")
                              .pop()
                              .toLowerCase() === "mov" ? (
                              <video
                                src={`${formData?.mediaurl}`}
                                style={{
                                  height: "400px",
                                  width: "100%",
                                }}
                                controls
                              />
                            ) : (
                              <img
                                src={`${formData?.mediaurl}`}
                                style={{
                                  height: "400px",
                                  width: "100%",
                                }}
                              />
                            )}

                            {isPermissionDelete && (
                              <div className="position-relative upload-file-close">
                                <button
                                  type="button"
                                  className="btn btn-sm rounded-circle"
                                  onClick={() => {
                                    setFormData({ ...formData, mediaurl: "" });
                                    setErrors({
                                      ...errors,
                                      mediaurl: "Media is required",
                                    });
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
                          accept={formData?.mediatype}
                          ref={imageRef}
                          disabled={!isPermission}
                          onChange={handleImageChange}
                        />
                        <div className="col-md-4 col-lg-4">
                          <Button
                            className="btn upload-button"
                            disabled={!isPermission}
                            onClick={handleClick}
                          >
                            Upload
                          </Button>
                        </div>
                      </div>
                    )}
                  {formData?.mediatype === "url-embedded" && (
                    <FormControl className="mt-1 mb-2">
                      <Input
                        type="text"
                        name="mediaurl"
                        placeholder="Enter the url"
                        value={formData?.mediaurl}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleChange(e.target.value, "mediaurl")
                        }
                      />
                    </FormControl>
                  )}
                  {errors?.mediaurl && (
                    <div className="error_msg">{errors?.mediaurl}</div>
                  )}

                  {/* {formData?.contentwo &&
                                        <div className="position-relative pb-3 d-flex h-100" >
                                            <img
                                                src={`${formData?.contentwo}`}
                                                style={{
                                                    height: '200px',
                                                    width: '40%'
                                                }}
                                            />
                                            <div className="position-absolute upload-file-close">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm rounded-circle"
                                                    onClick={() => { setFormData({ ...formData, contentwo: '' }) }}>
                                                    <i class="fa-solid fa-xmark color-white"></i>
                                                </button>
                                            </div>
                                        </div>
                                    }
                                    <input type="file" className="d-none" accept="image/png, image/jpg, image/jpeg, image/gif" ref={imageRef} onChange={handleImageChange} />
                                    <Button className="btn upload-button" onClick={handleClick}>Upload</Button>
                                    {errors?.contenttwo && <div className="error_msg">{errors?.contenttwo}</div>} */}
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    insert_content: state.cms.insertbid_content,
  };
};
export default connect(mapStateToProps)(HomeInsert);
