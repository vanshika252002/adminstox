import { FormControl, FormHelperText, Input } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Form, FormLabel } from "react-bootstrap";
import ReactQuill from "react-quill";
import {
  create_faq_question,
  get_selling_content,
  upload_cms_photo,
} from "../../../reduxData/cms/cmsAction";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const SellingContent = ({ sellingCont }) => {
  const [formdata, setFormdata] = useState({
    heading: "",
    status: false,
  });
  const [contentData, setContentData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isPermission, setIsPermission] = useState(false);

  useEffect(() => {
    setIsPermission(
      (user?.role === "staff" && user?.permission?.p_staff > 1) ||
        user?.role !== "staff"
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

  const handleAdd = () => {
    setContentData([...contentData, { subheading: "", subContent: [] }]);
  };

  const handleRemove = (index) => {
    const updateData = contentData.filter((_, i) => i !== index);
    setContentData(updateData);
  };

  const handleChange = (value) => {
    setFormdata({ ...formdata, heading: value });
  };

  const handleStatus = (e) => {
    setFormdata({ ...formdata, status: e.target.checked });
  };

  const handleSubHeading = (value, index) => {
    const updateContent = [...contentData];
    updateContent[index].subheading = value;
    setContentData(updateContent);
  };

  const handleAddContent = (index) => {
    const updatedData = [...contentData];
    updatedData[index].subContent.push({ type: "content", subCont: "" });
    setContentData(updatedData);
  };

  const handleAddMedia = (index) => {
    const updatedData = [...contentData];
    updatedData[index].subContent.push({
      type: "media",
      mediatype: "select",
      mediaurl: "",
      direction: "left",
    });
    setContentData(updatedData);
  };

  const handleContentChange = (field, value, contentIndex, subIndex) => {
    const updatedData = [...contentData];
    const target = updatedData[contentIndex].subContent[subIndex];

    if (field === "direction" && target.type === "imagePath") {
      updatedData[contentIndex].subContent[subIndex] = {
        type: "media",
        mediatype: "image",
        mediaurl: target.imagePath,
        direction: value,
      };
    } else if (field === "mediatype") {
      target.mediatype = value;
      target.mediaurl = "";
    } else {
      target[field] = value;
    }

    setContentData(updatedData);
  };

  const handleImageUpload = async (file, contentIndex, subIndex) => {
    if (!file) return;
    setIsEdit(true);
    const photoData = await upload_cms_photo(
      [file],
      localStorage.getItem("token"),
      dispatch
    );
    const imageUrl = photoData?.data?.photos[0] || "";

    const updatedData = [...contentData];
    const target = updatedData[contentIndex].subContent[subIndex];

    updatedData[contentIndex].subContent[subIndex] = {
      type: "media",
      mediatype: "image",
      mediaurl: imageUrl,
      direction: target.direction || "left",
    };
    setContentData(updatedData);
  };

  const handleSubRemove = (contIndex, subIdx) => {
    const updatedContent = [...contentData];
    const updateData = updatedContent[contIndex].subContent.filter(
      (_, i) => i !== subIdx
    );
    updatedContent[contIndex].subContent = updateData;
    setContentData(updatedContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: "sell_collectible",
      type: "sell_collectible",
      status: formdata.status,
      content: {
        heading: formdata.heading,
        contentData,
      },
      removePhotos: isEdit
        ? contentData
            .flatMap((c) =>
              c.subContent
                .filter((sc) => sc.mediaurl === "")
                .map((sc) => sc.imagePath || sc.mediaurl)
            )
            .filter(Boolean)
        : [],
    };
    await create_faq_question(
      localStorage.getItem("token"),
      payload,
      sellingCont[0]?._id,
      dispatch
    );
    await get_selling_content(
      localStorage.getItem("token"),
      "sell_collectible",
      dispatch
    );
    setIsEdit(false);
  };

  useEffect(() => {
    const handleContent = async () => {
      const getData = await get_selling_content(
        localStorage.getItem("token"),
        "sell_collectible",
        dispatch
      );
      if (getData?.length > 0 && getData[0]?.content) {
        setFormdata({
          heading: getData[0]?.content?.heading,
          status: getData[0]?.status,
        });
        setContentData(getData[0]?.content?.contentData);
      }
    };
    handleContent();
  }, []);

  return (
    <div className="container mt-3">
      <Form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between">
          <h4 className="mb-2 fw-600 pt-2">Selling a collectible</h4>
          <Button
            type="button"
            className="btn common-button"
            disabled={!isPermission}
            onClick={handleAdd}
          >
            Add Content Section +
          </Button>
        </div>
        <FormControl className="mt-2 mb-2">
          <FormLabel className="fw-600">Heading</FormLabel>
          <Input
            type="text"
            value={formdata?.heading}
            disabled={!isPermission}
            onChange={(e) => handleChange(e.target.value)}
          />
        </FormControl>

        {contentData.map((item, index) => (
          <div key={index} className="border rounded p-3 mb-3">
            <Accordion defaultActiveKey="0" alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <h4 className="mb-0 fw-600">Content Section {index + 1}</h4>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex gap-3 mb-2 align-items-center">
                    <FormLabel className="fw-600 mb-0">Sub-Heading</FormLabel>
                    <Input
                      type="text"
                      value={item?.subheading}
                      disabled={!isPermission}
                      onChange={(e) => handleSubHeading(e.target.value, index)}
                    />
                    <Button
                      type="button"
                      className="btn common-button"
                      onClick={() => handleAddContent(index)}
                    >
                      Add Text +
                    </Button>
                    <Button
                      type="button"
                      className="btn common-button"
                      onClick={() => handleAddMedia(index)}
                    >
                      Add Media +
                    </Button>
                    <Button
                      className="question-button"
                      variant="danger"
                      onClick={() => handleRemove(index)}
                    >
                      Remove Section -
                    </Button>
                  </div>

                  {item?.subContent?.map((i, idx) => {
                    if (i?.type === "content") {
                      return (
                        <div key={idx} className="position-relative my-3">
                          <ReactQuill
                            value={i?.subCont}
                            modules={modules}
                            disabled={!isPermission}
                            onChange={(value) =>
                              handleContentChange("subCont", value, index, idx)
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute"
                            style={{ top: -10, right: -10, zIndex: 10 }}
                            onClick={() => handleSubRemove(index, idx)}
                          >
                            X
                          </button>
                        </div>
                      );
                    }

                    if (i?.type === "imagePath") {
                      const imageUrl = i.imagePath;
                      return (
                        <div
                          key={idx}
                          className="upload-file position-relative border p-3 my-3"
                        >
                          <div className="d-flex col-lg-6 gap-3 mb-2">
                            <span>Image Direction :</span>
                            <select
                              name="direction"
                              value={i.direction || "left"}
                              style={{ appearance: "auto" }}
                              onChange={(e) =>
                                handleContentChange(
                                  "direction",
                                  e.target.value,
                                  index,
                                  idx
                                )
                              }
                            >
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                          {imageUrl && (
                            <div className="position-relative d-inline-block">
                              <img
                                src={imageUrl}
                                style={{
                                  height: "150px",
                                  width: "auto",
                                  display: "block",
                                }}
                                alt="preview"
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute"
                                style={{ top: 0, right: 0 }}
                                onClick={() =>
                                  handleImageUpload(null, index, idx)
                                }
                              >
                                X
                              </button>
                            </div>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute"
                            style={{ top: 5, right: 5 }}
                            onClick={() => handleSubRemove(index, idx)}
                          >
                            X
                          </button>
                        </div>
                      );
                    }

                    if (i?.type === "media") {
                      return (
                        <div
                          key={idx}
                          className="upload-file position-relative border p-3 my-3"
                        >
                          <FormControl className="mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <FormLabel className="text-dark fw-600 mb-0">
                                Select Media Type
                              </FormLabel>
                              <select
                                name="mediatype"
                                className="form-control w-auto"
                                value={i.mediatype}
                                onChange={(e) =>
                                  handleContentChange(
                                    "mediatype",
                                    e.target.value,
                                    index,
                                    idx
                                  )
                                }
                              >
                                <option value="select" disabled>
                                  Select
                                </option>
                                <option value="image">Image</option>
                                <option value="url-embedded">Embed URL</option>
                              </select>
                            </div>

                            {i.mediatype === "image" && (
                              <div className="mt-2">
                                <div className="d-flex col-lg-6 gap-3 mb-2">
                                  <span>Image Direction :</span>
                                  <select
                                    name="direction"
                                    value={i.direction || "left"}
                                    style={{ appearance: "auto" }}
                                    onChange={(e) =>
                                      handleContentChange(
                                        "direction",
                                        e.target.value,
                                        index,
                                        idx
                                      )
                                    }
                                  >
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>
                                {i.mediaurl ? (
                                  <div className="position-relative d-inline-block">
                                    <img
                                      src={i.mediaurl}
                                      style={{
                                        height: "150px",
                                        width: "auto",
                                        display: "block",
                                      }}
                                      alt="preview"
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-danger position-absolute"
                                      style={{ top: 0, right: 0 }}
                                      onClick={() =>
                                        handleContentChange(
                                          "mediaurl",
                                          "",
                                          index,
                                          idx
                                        )
                                      }
                                    >
                                      X
                                    </button>
                                  </div>
                                ) : (
                                  <label
                                    className="form-control text-center"
                                    style={{
                                      cursor: "pointer",
                                      padding: "2rem",
                                    }}
                                  >
                                    + Click to Upload Image
                                    <input
                                      className="d-none"
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleImageUpload(
                                          e.target.files[0],
                                          index,
                                          idx
                                        )
                                      }
                                    />
                                  </label>
                                )}
                              </div>
                            )}

                            {i.mediatype === "url-embedded" && (
                              <FormControl className="mt-2">
                                <FormLabel className="fw-600">
                                  Embed URL
                                </FormLabel>
                                <Input
                                  type="text"
                                  placeholder="Enter YouTube or other embed URL"
                                  value={i.mediaurl}
                                  onChange={(e) =>
                                    handleContentChange(
                                      "mediaurl",
                                      e.target.value,
                                      index,
                                      idx
                                    )
                                  }
                                />
                              </FormControl>
                            )}
                          </FormControl>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute"
                            style={{ top: 5, right: 5 }}
                            onClick={() => handleSubRemove(index, idx)}
                          >
                            X
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        ))}

        <div className="d-flex justify-content-between mt-3">
          <FormControl>
            <FormLabel className="fw-600">Status</FormLabel>
            <div className="form-check form-switch switch-large">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                disabled={!isPermission}
                checked={formdata.status}
                onChange={handleStatus}
              />
            </div>
          </FormControl>
          <Button
            type="submit"
            className="btn common-button align-self-end"
            disabled={!isPermission}
          >
            Save All Changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    sellingCont: state.cms.sellingCont,
  };
};

export default connect(mapStateToProps)(SellingContent);
