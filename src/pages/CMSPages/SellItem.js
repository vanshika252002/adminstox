import { FormControl, FormHelperText, FormLabel, Input } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import {
  upload_edit_item_video,
  upload_sell_item_photo,
} from "../../reduxData/user/userAction";
import { connect, useDispatch } from "react-redux";
import {
  create_faq_question,
  get_sell_item_content,
  upload_cms_photo,
  upload_cms_video,
} from "../../reduxData/cms/cmsAction";
import { useSelector } from "react-redux";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const SellItem = ({ sellItemCont }) => {
  const [formData, setFormData] = useState({
    heading: "",
    content: "",
    points: [],
    mediatype: "",
    mediaurl: "",
    pageheading: "",
    pagecontent: "",
    status: false,
  });
  const [errors, setErrors] = useState({
    heading: "",
    content: "",
    points: [],
    mediatype: "",
    mediaurl: "",
    pageheading: "",
    pagecontent: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [removePhotos, setRemovePhotos] = useState([]);
  const [removeVideos, setRemoveVideos] = useState([]);
  const dispatch = useDispatch();
  const urlPattern =
    /^(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+)(?:\/[^\s]*)?$/;

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

  const imageRef = useRef();
  const handleClick = () => {
    imageRef.current.click();
  };

  const handleMedia = (val) => {
    setFormData({ ...formData, mediatype: val, mediaurl: "" });
    setErrors({ ...errors, mediatype: null });
    setIsEdit(true);
  };

  const handleChange = (value, label) => {
    const currentData = formData[label];

    if (currentData === value) return;

    switch (label) {
      case "heading":
        setErrors({
          ...errors,
          heading:
            !value || value === "<p><br></p>" ? "Heading is required" : null,
        });
        setFormData({ ...formData, heading: value });
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
        break;
      case "pageheading":
        setErrors({
          ...errors,
          pageheading:
            !value || value === "<p><br></p>"
              ? "Page Heading is required"
              : null,
        });
        setFormData({ ...formData, pageheading: value });
        break;
      case "pagecontent":
        setErrors({
          ...errors,
          pagecontent:
            !value || value === "<p><br></p>"
              ? "Page Content is required"
              : null,
        });
        setFormData({ ...formData, pagecontent: value });
        break;
      case "status":
        setFormData({ ...formData, status: value ? true : false });
        break;
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
      if (photoData !== undefined) {
        // pathurl = photoData?.data?.thumbnails[0];
        pathurl = photoData?.data?.photos[0];
        setIsEdit(true);
      }
    }

    if (formData?.mediatype === ".mp4, .mov") {
      const videoData = await upload_cms_video(
        fileUpload,
        localStorage.getItem("token"),
        dispatch
      );
      if (videoData !== undefined) {
        pathurl = videoData?.data?.path[0];
        setIsEdit(true);
      }
    }

    setFormData({ ...formData, mediaurl: pathurl });
    setErrors({ ...errors, mediaurl: null });
  };

  const handleAdd = () => {
    setFormData({
      ...formData,
      points: [...formData.points, { pointval: "" }],
    });
    setErrors({ ...errors, points: [...errors.points, { pointval: "" }] });
  };

  const handleRemove = (idx) => {
    const filterpoints = formData.points.filter((item, index) => index !== idx);
    setFormData({ ...formData, points: [...filterpoints] });
    const filtererrpoints = errors.points.filter(
      (item, index) => index !== idx
    );
    setErrors({ ...errors, points: [...filtererrpoints] });
  };

  const handlePointChange = (val, indx) => {
    const newPoints = [...formData.points];
    const newErrpoint = [...errors.points];

    newPoints[indx].pointval = val;
    setFormData({ ...formData, points: newPoints });

    newErrpoint[indx].pointval = !val || val === "" ? true : false;
    setErrors({ ...errors, points: newErrpoint });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      heading,
      content,
      mediatype,
      mediaurl,
      pagecontent,
      pageheading,
      points,
    } = formData;
    let newerrors = {
      heading:
        !heading || heading === "<p><br></p>" ? "Heading is required" : null,
      content:
        !content || content === "<p><br></p>" ? "Content is required" : null,
      mediatype:
        !mediatype || mediatype === "" ? "Select the Media Type" : null,
      mediaurl:
        mediatype !== "" && mediaurl === ""
          ? "Media is required"
          : mediatype === "url-embedded" && !urlPattern.test(mediaurl)
          ? "Invalid url"
          : null,
      pagecontent:
        !pagecontent || pagecontent === "<p><br></p>"
          ? "Page Content is required"
          : null,
      pageheading:
        !pageheading || pageheading === "<p><br></p>"
          ? "Page Heading is required"
          : null,
      points: points.map((item) => {
        if (!item.pointval || item.pointval === "") {
          return { ...item, pointval: true };
        }
      }),
    };
    setErrors(newerrors);
    if (
      heading &&
      content &&
      mediatype &&
      mediaurl &&
      pagecontent &&
      pageheading &&
      points?.length > 0
    ) {
      const quest_data = {
        name: "SellItem_content",
        type: "SellItem_content",
        status: formData.status,
        content: {
          heading: formData.heading,
          content: formData.content,
          mediatype: formData.mediatype,
          mediaurl: formData.mediaurl,
          points: formData.points,
          pageheading: formData.pageheading,
          pagecontent: formData.pagecontent,
        },
        removeVideos:
          isEdit === true && removeVideos?.length > 0 ? removeVideos : [],
        removePhotos:
          isEdit === true && removePhotos?.length > 0 ? removePhotos : [],
      };

      if (mediatype === "url-embedded" && !urlPattern.test(mediaurl)) return;

      await create_faq_question(
        localStorage.getItem("token"),
        quest_data,
        sellItemCont[0]?._id,
        dispatch
      );
      await get_sell_item_content(
        localStorage.getItem("token"),
        "SellItem_content",
        dispatch
      );
      setIsEdit(false);
    }
  };

  useEffect(() => {
    const handleData = async () => {
      await get_sell_item_content(
        localStorage.getItem("token"),
        "SellItem_content",
        dispatch
      );
    };
    handleData();
  }, []);

  useEffect(() => {
    if (sellItemCont?.length > 0) {
      setFormData((prevData) => {
        return {
          ...prevData,
          heading: sellItemCont[0]?.content?.heading,
          content: sellItemCont[0]?.content?.content,
          points: sellItemCont[0]?.content?.points,
          mediatype: sellItemCont[0]?.content?.mediatype,
          mediaurl: sellItemCont[0]?.content?.mediaurl,
          pageheading: sellItemCont[0]?.content?.pageheading,
          pagecontent: sellItemCont[0]?.content?.pagecontent,
          status: sellItemCont[0]?.status,
        };
      });

      if (sellItemCont[0]?.content?.mediatype === ".mp4, .mov") {
        setRemoveVideos([sellItemCont[0]?.content?.mediaurl]);
      }

      if (
        sellItemCont[0]?.content?.mediatype ===
        "image/png, image/jpeg, image/jpg, image/gif"
      ) {
        setRemovePhotos([sellItemCont[0]?.content?.mediaurl]);
      }
    }
  }, [sellItemCont]);
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
  return (
    <div>
      <div className="container">
        <h3 className="mb-2 fw-600">Sell an Item Content</h3>
      </div>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4 className="fw-600 ms-2">Home Content</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div className="ms-2">
                <FormControl className="mt-2 mb-2">
                  <label className="fw-600 text-dark">Heading</label>
                  <ReactQuill
                    type="text"
                    name="heading"
                    placeholder="Enter heading...."
                    value={formData.heading}
                    modules={modules}
                    disabled={!isPermission}
                    onChange={(value) => handleChange(value, "heading")}
                  />
                  {errors?.heading && (
                    <div className="error_msg">{errors?.heading}</div>
                  )}
                </FormControl>

                <FormControl className="mt-2 mb-2">
                  <label className="fw-600 text-dark">Content</label>
                  <ReactQuill
                    name="answer"
                    value={formData?.content}
                    placeholder="Enter content...."
                    modules={modules}
                    disabled={!isPermission}
                    onChange={(value) => handleChange(value, "content")}
                  />
                  {errors?.content && (
                    <div className="error_msg">{errors?.content}</div>
                  )}
                </FormControl>

                <FormControl className="mt-2 mb-2">
                  <div className="d-flex">
                    <label className="fw-600 text-dark">
                      Specification Points
                    </label>
                    <Button
                      type="button"
                      className="btn content-button"
                      onClick={handleAdd}
                      disabled={!isPermission}
                    >
                      Add point
                    </Button>
                  </div>

                  {formData?.points.length > 0 &&
                    formData?.points?.map((item, index) => (
                      <div className="" key={index}>
                        <div className="mb-1 mt-1 col-lg-8">
                          <FormControl className="mt-2 mb-2 d-flex">
                            <FormLabel>Point{index + 1}</FormLabel>
                            <Input
                              type="text"
                              value={item?.pointval}
                              disabled={!isPermission}
                              onChange={(e) =>
                                handlePointChange(e.target.value, index)
                              }
                              placeholder="specify the point....."
                            />
                            {errors?.points[index] &&
                              errors?.points[index]?.pointval && (
                                <FormHelperText style={{ color: "red" }}>
                                  Point{index + 1} is required
                                </FormHelperText>
                              )}
                          </FormControl>
                        </div>
                        <div className="mb-1 mt-1 ms-2 col-lg-4">
                          <Button
                            type="button"
                            className="btn content-button"
                            disabled={!isPermission}
                            onClick={() => handleRemove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </FormControl>

                <FormControl className="mt-2 mb-2">
                  <label className="fw-600 text-dark">Media Content</label>
                  <div className="d-flex align-items-center gap-2">
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
                    </div>
                  </div>
                  {errors?.mediatype && (
                    <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                      {errors?.mediatype}
                    </p>
                  )}

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
                          onChange={handleImageChange}
                        />
                        <div className="col-md-4 col-lg-4">
                          <Button
                            className="btn upload-button"
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
                        onChange={(e) =>
                          handleChange(e.target.value, "mediaurl")
                        }
                      />
                    </FormControl>
                  )}
                  {errors?.mediaurl && (
                    <div className="error_msg">{errors?.mediaurl}</div>
                  )}
                </FormControl>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4 className="fw-600 ms-2">Page Content</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div className="ms-2">
                <FormControl className="mt-2 mb-2">
                  <label className="fw-600 text-dark">Page Heading</label>
                  <ReactQuill
                    type="text"
                    name="answer"
                    placeholder="Enter page heading...."
                    value={formData?.pageheading}
                    modules={modules}
                    onChange={(value) => handleChange(value, "pageheading")}
                  />
                  {errors?.pageheading && (
                    <div className="error_msg">{errors?.pageheading}</div>
                  )}
                </FormControl>

                <FormControl className="mt-2 mb-2">
                  <label className="fw-600 text-dark">Page Content</label>
                  <ReactQuill
                    name="answer"
                    value={formData?.pagecontent}
                    placeholder="Enter page content...."
                    modules={modules}
                    onChange={(value) => handleChange(value, "pagecontent")}
                  />
                  {errors?.pagecontent && (
                    <div className="error_msg">{errors?.pagecontent}</div>
                  )}
                </FormControl>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <FormControl className="mt-2 mb-2 ms-2">
          <FormLabel className="fw-600">Status</FormLabel>
          <div class="form-check form-switch switch-large">
            <input
              class="form-check-input"
              type="checkbox"
              name="status"
              role="switch"
              id="flexSwitchCheckDefault"
              checked={formData.status}
              disabled={!isPermission}
              onChange={(e) => handleChange(e.target.checked, "status")}
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
    sellItemCont: state.cms.sellItemCont,
  };
};
export default connect(mapStateToProps)(SellItem);
