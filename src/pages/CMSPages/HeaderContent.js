import { FormControl, FormLabel, Input } from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { connect, useSelector } from "react-redux";
import {
  create_faq_question,
  get_header_content,
  upload_cms_photo,
} from "../../reduxData/cms/cmsAction";
import { useDispatch } from "react-redux";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const HeaderContent = ({ headerContent }) => {
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
    headerLogo: "",
    searchicon: "",
    searchPlaceholder: "",
    webPaths: [],
    mobileuserPaths: [],
    mobileCommanPaths: [],
    notificationLogo: "",
    watchlistLogo: "",
    status: false,
  });

  const [errors, setErrors] = useState({
    headerLogo: "",
    searchicon: "",
    searchPlaceholder: "",
    webPaths: [],
    mobileuserPaths: [],
    mobileCommanPaths: [],
    notificationLogo: "",
    watchlistLogo: "",
  });
  const dispatch = useDispatch();

  const imageRef = useRef();
  const handleClick = () => {
    imageRef.current.click();
  };

  const searchRef = useRef();
  const handleSearch = () => {
    searchRef.current.click();
  };

  const notifyRef = useRef();
  const handleNotify = () => {
    notifyRef.current.click();
  };

  const watchRef = useRef();
  const handleWatch = () => {
    watchRef.current.click();
  };

  const handleImage = async (e, label) => {
    const imageUpload = [e.target.files[0]];
    const photoData = await upload_cms_photo(
      imageUpload,
      localStorage.getItem("token"),
      dispatch
    );


    switch (label) {
      case "headerLogo":
        setErrors({ ...errors, headerLogo: false });
        setFormData({ ...formData, headerLogo: photoData?.data?.photos[0] });
        break;
      case "searchicon":
        setErrors({ ...errors, searchicon: false });
        setFormData({ ...formData, searchicon: photoData?.data?.photos[0] });
        break;
      case "notificationLogo":
        setErrors({ ...errors, notificationLogo: false });
        setFormData({
          ...formData,
          notificationLogo: photoData?.data?.photos[0],
        });
        break;
      case "watchlistLogo":
        setErrors({ ...errors, watchlistLogo: false });
        setFormData({ ...formData, watchlistLogo: photoData?.data?.photos[0] });
        break;
      default:
        setFormData({ ...formData, [label]: photoData?.data?.photos[0] });
        break;
    }
  };

  const handleAdd = (label) => {
    setFormData((prev) => ({
      ...prev,
      [label]: [...prev?.[label], { title: "", path: "" }],
    }));
  };

  const handleRemove = (label, idx) => {
    const filterPaths = formData?.[label]?.filter(
      (item, index) => index !== idx
    );
    setFormData({ ...formData, [label]: [...filterPaths] });
  };

  const handlePathChange = (label, sublabel, val, indx) => {
    const newPaths = [...(formData?.[label] || [])];

    if (!newPaths[indx]) {
      newPaths[indx] = {};
    }

    newPaths[indx][sublabel] = val;

    setFormData((prev) => ({ ...prev, [label]: newPaths }));
  };

  const handleChange = (value, label) => {
    switch (label) {
      case "status":
        setFormData({ ...formData, status: value ? true : false });
        break;
      case "searchPlaceholder":
        setFormData({ ...formData, [label]: value });
        break;
      default:
        setFormData({ ...formData, [label]: value });
        break;
    }
  };

  const handleErrors = () => {
    const {
      headerLogo,
      searchicon,
      searchPlaceholder,
      webPaths,
      mobileuserPaths,
      mobileCommanPaths,
      notificationLogo,
      watchlistLogo,
    } = formData;

    const errors = {};

    if (!headerLogo) errors.headerLogo = "Header logo is required";
    if (!searchicon) errors.searchicon = "Search icon is required";
    if (!searchPlaceholder)
      errors.searchPlaceholder = "Search placeholder is required";
    if (!notificationLogo)
      errors.notificationLogo = "Notification logo is required";
    if (!watchlistLogo) errors.watchlistLogo = "Watchlist logo is required";

    const validatePathArray = (array, fieldName) => {
      if (!Array.isArray(array)) {
        return `${fieldName} must be an array`;
      }
      if (array.length === 0) {
        return `${fieldName} must contain at least one item`;
      }

      const pathErrors = array
        .map((item, index) => {
          const obj = {};
          if (!item.title)
            obj.title = `${fieldName} ${index + 1}: Title is required`;
          if (!item.path)
            obj.path = `${fieldName} ${index + 1}: Path is required`;
          return Object.keys(obj).length ? obj : null;
        })
        .filter(Boolean);

      return pathErrors.length ? pathErrors : null;
    };

    const webPathErrors = validatePathArray(webPaths, "webPaths");
    if (webPathErrors) errors.webPaths = webPathErrors;

    const mobileUserPathErrors = validatePathArray(
      mobileuserPaths,
      "mobileuserPaths"
    );
    if (mobileUserPathErrors) errors.mobileuserPaths = mobileUserPathErrors;

    const mobileCommanPathErrors = validatePathArray(
      mobileCommanPaths,
      "mobileCommanPaths"
    );
    if (mobileCommanPathErrors)
      errors.mobileCommanPaths = mobileCommanPathErrors;

    setErrors(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = handleErrors();
    if (Object.keys(errors).length > 0) return;

    const content_data = {
      name: "header_content",
      type: "header_content",
      status: formData?.status,
      content: {
        ...formData,
      },
    };

    await create_faq_question(
      localStorage.getItem("token"),
      content_data,
      headerContent[0]?._id,
      dispatch
    );
  };

  useEffect(() => {
    const handleQuest = async () => {
      await get_header_content(
        localStorage.getItem("token"),
        "header_content",
        dispatch
      );
    };
    handleQuest();
  }, []);

  useEffect(() => {
    if (headerContent?.length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...headerContent[0]?.content,
      }));
      //setRemovePhotos(prev => [...prev, faqItems[0]?.content?.imagePath]);
    }
  }, [headerContent]);

  return (
    <div className="container">
      <Form onSubmit={handleSubmit}>
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4 className="mb-0 fw-bold">Header Content</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div>
                <FormControl className="mt-2 mb-2 col-md-6">
                  <FormLabel className="fw-600">Header Logo</FormLabel>
                  {formData?.headerLogo && (
                    <div className="position-relative pb-3 d-flex h-100">
                      <img
                        src={`${formData?.headerLogo}`}
                        style={{
                          height: "200px",
                          width: "50%",
                        }}
                        alt="img not found"
                      />
                      {isPermissionDelete && (
                        <div className="position-absolute upload-file-close">
                          <button
                            type="button"
                            className="btn btn-sm rounded-circle"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                headerLogo: "",
                              }));
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
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    ref={imageRef}
                    disabled={!isPermission}
                    onChange={(e) => {
                      handleImage(e, "headerLogo");
                      e.target.value = "";
                    }}
                  />
                  <Button
                    className="btn upload-button"
                    disabled={!isPermission}
                    onClick={handleClick}
                  >
                    Upload
                  </Button>
                  {errors?.headerLogo && (
                    <div className="error_msg">Header Logo is required</div>
                  )}
                </FormControl>

                <FormControl className="mt-2 mb-2 col-md-6">
                  <FormLabel className="fw-600">Search Bar Logo</FormLabel>
                  {formData?.searchicon && (
                    <div className="position-relative pb-3 d-flex h-100">
                      <img
                        src={`${formData?.searchicon}`}
                        style={{
                          height: "200px",
                          width: "50%",
                        }}
                        alt="img not found"
                      />
                      {isPermissionDelete && (
                        <div className="position-absolute upload-file-close">
                          <button
                            type="button"
                            className="btn btn-sm rounded-circle"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                searchicon: "",
                              }));
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
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    ref={searchRef}
                    disabled={!isPermission}
                    onChange={(e) => {
                      handleImage(e, "searchicon");
                      e.target.value = "";
                    }}
                  />
                  <Button
                    className="btn upload-button"
                    disabled={!isPermission}
                    onClick={handleSearch}
                  >
                    Upload
                  </Button>
                  {errors?.searchicon && (
                    <div className="error_msg">Search Bar Logo is required</div>
                  )}
                </FormControl>

                <FormControl className="mt-0 mb-2 col-md-6">
                  <FormLabel className="fw-600">Search Placeholder</FormLabel>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={formData?.searchPlaceholder || ""}
                    onChange={(e) =>
                      handleChange(e.target.value, "searchPlaceholder")
                    }
                  />
                  {errors?.searchPlaceholder && (
                    <div className="error_msg">{errors?.searchPlaceholder}</div>
                  )}
                </FormControl>

                <FormControl className="mt-0 mb-2">
                  <div className="d-flex gap-2">
                    <label className="fw-600 text-dark">Web links</label>
                    <Button
                      type="button"
                      className="btn content-button"
                      onClick={() => {
                        handleAdd("webPaths");
                      }}
                    >
                      Add Link
                    </Button>
                  </div>
                  {!Array.isArray(errors?.webPaths) &&
                    formData?.webPaths?.length === 0 && (
                      <div className="error_msg">Add Atleast One Link</div>
                    )}

                  {formData?.webPaths?.length > 0 &&
                    formData?.webPaths?.map((item, index) => (
                      <div key={index}>
                        <h5>Link {index + 1}</h5>
                        <div className="ms-2 p-2">
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Title</FormLabel>
                            <Input
                              type="text"
                              name="title"
                              placeholder="Enter title"
                              value={item?.title || ""}
                              onChange={(e) =>
                                handlePathChange(
                                  "webPaths",
                                  "title",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.webPaths &&
                              errors?.webPaths[index]?.title && (
                                <div className="error_msg">
                                  {errors?.webPaths[index]?.title}
                                </div>
                              )}
                          </FormControl>
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Path</FormLabel>
                            <Input
                              type="text"
                              name="path"
                              placeholder="Enter path"
                              value={item?.path || ""}
                              onChange={(e) =>
                                handlePathChange(
                                  "webPaths",
                                  "path",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.webPaths &&
                              errors?.webPaths[index]?.path && (
                                <div className="error_msg">
                                  {errors?.webPaths[index]?.path}
                                </div>
                              )}
                          </FormControl>
                        </div>
                        <div className="mb-1 mt-1 ms-2 col-lg-4">
                          <Button
                            type="button"
                            className="btn content-button"
                            onClick={() => handleRemove("webPaths", index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </FormControl>

                <FormControl className="mt-0 mb-2">
                  <div className="d-flex gap-2">
                    <label className="fw-600 text-dark">
                      Mobile User links
                    </label>
                    <Button
                      type="button"
                      className="btn content-button"
                      onClick={() => {
                        handleAdd("mobileuserPaths");
                      }}
                    >
                      Add Link
                    </Button>
                  </div>
                  {!Array.isArray(errors?.mobileuserPaths) &&
                    formData?.mobileuserPaths?.length === 0 && (
                      <div className="error_msg">Add Atleast One Link</div>
                    )}
                  {formData?.mobileuserPaths?.length > 0 &&
                    formData?.mobileuserPaths?.map((item, index) => (
                      <div key={index}>
                        <h5>Link {index + 1}</h5>
                        <div className="ms-2 p-2">
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Title</FormLabel>
                            <Input
                              type="text"
                              name="title"
                              placeholder="Enter title"
                              value={item?.title || ""}
                              onChange={(e) =>
                                handlePathChange(
                                  "mobileuserPaths",
                                  "title",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.mobileuserPaths &&
                              errors?.mobileuserPaths[index]?.title && (
                                <div className="error_msg">
                                  {errors?.mobileuserPaths[index]?.title}
                                </div>
                              )}
                          </FormControl>
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Path</FormLabel>
                            <Input
                              type="text"
                              name="path"
                              placeholder="Enter path"
                              value={item?.path || ""}
                              onChange={(e) =>
                                handlePathChange(
                                  "mobileuserPaths",
                                  "path",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.mobileuserPaths &&
                              errors?.mobileuserPaths[index]?.path && (
                                <div className="error_msg">
                                  {errors?.mobileuserPaths[index]?.path}
                                </div>
                              )}
                          </FormControl>
                        </div>
                        <div className="mb-1 mt-1 ms-2 col-lg-4">
                          <Button
                            type="button"
                            className="btn content-button"
                            onClick={() =>
                              handleRemove("mobileuserPaths", index)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </FormControl>

                <FormControl className="mt-0 mb-2">
                  <div className="d-flex gap-2">
                    <label className="fw-600 text-dark">
                      Mobile Common links
                    </label>
                    <Button
                      type="button"
                      className="btn content-button"
                      onClick={() => {
                        handleAdd("mobileCommanPaths");
                      }}
                    >
                      Add Link
                    </Button>
                  </div>
                  {!Array.isArray(errors?.mobileCommanPaths) &&
                    formData?.mobileCommanPaths?.length === 0 && (
                      <div className="error_msg">Add Atleast One Link</div>
                    )}
                  {formData?.mobileCommanPaths?.length > 0 &&
                    formData?.mobileCommanPaths?.map((item, index) => (
                      <div key={index}>
                        <h5>Link {index + 1}</h5>
                        <div className="ms-2 p-2">
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Title</FormLabel>
                            <Input
                              type="text"
                              name="title"
                              placeholder="Enter title"
                              value={item?.title || ""}
                              onChange={(e) =>
                                handlePathChange(
                                  "mobileCommanPaths",
                                  "title",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.mobileCommanPaths &&
                              errors?.mobileCommanPaths[index]?.title && (
                                <div className="error_msg">
                                  {errors?.mobileCommanPaths[index]?.title}
                                </div>
                              )}
                          </FormControl>
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Path</FormLabel>
                            <Input
                              type="text"
                              name="path"
                              placeholder="Enter path"
                              value={item?.path || ""}
                              onChange={(e) =>
                                handlePathChange(
                                  "mobileCommanPaths",
                                  "path",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.mobileCommanPaths &&
                              errors?.mobileCommanPaths[index]?.path && (
                                <div className="error_msg">
                                  {errors?.mobileCommanPaths[index]?.path}
                                </div>
                              )}
                          </FormControl>
                        </div>
                        <div className="mb-1 mt-1 ms-2 col-lg-4">
                          <Button
                            type="button"
                            className="btn content-button"
                            onClick={() =>
                              handleRemove("mobileCommanPaths", index)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </FormControl>

                <FormControl className="mt-2 mb-2 col-md-6">
                  <FormLabel className="fw-600">
                    Notification Bar Logo
                  </FormLabel>
                  {formData?.notificationLogo && (
                    <div className="position-relative pb-3 d-flex h-100">
                      <img
                        src={`${formData?.notificationLogo}`}
                        style={{
                          height: "200px",
                          width: "50%",
                        }}
                        alt="img not found"
                      />
                      {isPermissionDelete && (
                        <div className="position-absolute upload-file-close">
                          <button
                            type="button"
                            className="btn btn-sm rounded-circle"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                notificationLogo: "",
                              }));
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
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    ref={notifyRef}
                    disabled={!isPermission}
                    onChange={(e) => {
                      handleImage(e, "notificationLogo");
                      e.target.value = "";
                    }}
                  />
                  <Button
                    className="btn upload-button"
                    disabled={!isPermission}
                    onClick={handleNotify}
                  >
                    Upload
                  </Button>
                  {errors?.notificationLogo && (
                    <div className="error_msg">
                      Notification Logo is required
                    </div>
                  )}
                </FormControl>

                <FormControl className="mt-2 mb-2 col-md-6">
                  <FormLabel className="fw-600">Watchlist Logo</FormLabel>
                  {formData?.watchlistLogo && (
                    <div className="position-relative pb-3 d-flex h-100">
                      <img
                        src={`${formData?.watchlistLogo}`}
                        style={{
                          height: "200px",
                          width: "50%",
                        }}
                        alt="img not found"
                      />
                      {isPermissionDelete && (
                        <div className="position-absolute upload-file-close">
                          <button
                            type="button"
                            className="btn btn-sm rounded-circle"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                watchlistLogo: "",
                              }));
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
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    ref={watchRef}
                    disabled={!isPermission}
                    onChange={(e) => {
                      handleImage(e, "watchlistLogo");
                      e.target.value = "";
                    }}
                  />
                  <Button
                    className="btn upload-button"
                    disabled={!isPermission}
                    onClick={handleWatch}
                  >
                    Upload
                  </Button>
                  {errors?.watchlistLogo && (
                    <div className="error_msg">Watchlist Logo is required</div>
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
              onChange={(e) => handleChange(e.target.checked, "status")}
            />
          </div>
        </FormControl>

        <Button type="submit" className="btn common-button">
          Save
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    headerContent: state.cms.headerContent,
  };
};

export default connect(mapStateToProps)(HeaderContent);
