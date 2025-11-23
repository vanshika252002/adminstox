import React, { useEffect, useRef, useState } from "react";
import { FormControl, FormLabel, Input } from "@mui/joy";
import { Accordion, Button, Form } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import {
  create_faq_question,
  get_all_faq_questions,
  upload_cms_photo,
} from "../../reduxData/cms/cmsAction";
import { upload_sell_item_photo } from "../../reduxData/user/userAction";
import { useSelector } from "react-redux";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const HomeContent = ({ faqItems }) => {
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
    // content: '',
    position: "",
    slide1: {
      // title: "",
      heading: "",
      subheading: "",
      button1title: "",
      button2title: "",
      opacity: 1,
      backgroundImage: "",
      backgroundColor: "",
    },
    // slide2: {
    //   title: "",
    //   heading: "",
    //   subheading: "",
    //   buttontitle: "",
    //   opacity: 1,
    //   backgroundImage: "",
    //   backgroundColor: "",
    // },
    // contentwo: '',
    // imagePath: "",
    status: false,
  });

  const options = [
    { label: "Left", type: "start" },
    { label: "Right", type: "end" },
    { label: "Center", type: "center" },
  ];

  const [errors, setErrors] = useState({
    // content: '',
    position: "",
    imagePath: "",
    // contenttwo: '',
    slide1: {
      // title: false,
      heading: false,
      subheading: false,
      button1title: false,
      button2title: false,
      backgroundImage: false,
    },
    // slide2: {
    //   title: false,
    //   heading: false,
    //   subheading: false,
    //   backgroundImage: false,
    // },
  });
  const [isImgEdit, setIsImgEdit] = useState(false);
  const [removePhotos, setRemovePhotos] = useState([]);

  const dispatch = useDispatch();
  const imageRef = useRef();
  const handleClick = () => {
    imageRef.current.click();
  };

  const slide1ref = useRef();
  const handleSlide1 = () => {
    slide1ref.current.click();
  };

  const slide2ref = useRef();
  const handleSlide2 = () => {
    slide2ref.current.click();
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
      // case 'content':
      //     setErrors({ ...errors, content: !value || value === '' ? "Content is required" : null });
      //     setFormData({ ...formData, content: value });
      //     break;
      case "contentwo":
        setErrors({
          ...errors,
          contenttwo: !value || value === "" ? "Content is required" : null,
        });
        setFormData({ ...formData, contentwo: value });
        break;
      default:
        setFormData({ ...formData, [label]: value });
        break;
    }
  };

  const handleOption = (val) => {
    setFormData({ ...formData, position: val });
    setErrors({ ...errors, position: null });
  };

  const handleSlides = (value, label, sublabel) => {
    setFormData((prev) => ({
      ...prev,
      [label]: { ...prev[label], [sublabel]: value },
    }));
    setErrors((prev) => ({
      ...prev,
      [label]: { ...prev[label], [sublabel]: value === "" ? true : false },
    }));
  };

  const handleImageChange = async (e) => {
    const imageUpload = [e.target.files[0]];
    const photoData = await upload_cms_photo(imageUpload,localStorage.getItem("token"),dispatch);

    if (photoData !== undefined) {
      const photosFiles = photoData?.data?.data[0];
      setFormData({ ...formData, imagePath: photosFiles });
      setErrors({ ...errors, imagePath: null });
      setIsImgEdit(true);
    }
  };

  const handleSlideImage = async (e, label) => {
    const imageUpload = [e.target.files[0]];
    const photoData = await upload_cms_photo(imageUpload,localStorage.getItem("token"),dispatch);

    switch (label) {
      case "slide1":
        setErrors({ ...errors, slide1: { ...errors?.slide1, backgroundImage: false }, });
        setFormData({ ...formData, slide1: { ...formData?.slide1, backgroundImage: photoData?.data?.data[0] }, });
        break;
      // case "slide2":
      //   setErrors({
      //     ...errors,
      //     slide2: { ...errors?.slide2, backgroundImage: false },
      //   });
      //   setFormData({
      //     ...formData,
      //     slide2: {
      //       ...formData?.slide2,
      //       backgroundImage: photoData?.data?.photos[0],
      //     },
      //   });
      //   break;
      default:
        setFormData({ ...formData, [label]: { ...formData?.[label], backgroundImage: photoData?.data[0], }, });
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

  const handleValid = (errdata) => {
    if (!errdata) return false;

    return Object.values(errdata).some((val) =>
      typeof val === "object" && val !== null
        ? Object.values(val).some((nestedVal) => nestedVal === true)
        : val === true
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {
      position: !formData?.position || formData?.position === "" ? true : false,
      // imagePath:formData?.imagePath?.trim() === "" ? "Image is required" : null,
      slide1: {
        // title: !formData?.slide1?.title || formData?.slide1?.title === "" ? true : false,
        heading: !formData?.slide1?.heading || formData?.slide1?.heading === "" ? true : false,
        subheading: !formData?.slide1?.subheading || formData?.slide1?.subheading === "" ? true : false,
        button1title: !formData?.slide1?.button1title || formData?.slide1?.button1title === "" ? true : false,
        button2title: !formData?.slide1?.button2title || formData?.slide1?.button2title === "" ? true : false,
        backgroundImage: !formData?.slide1?.backgroundImage || formData?.slide1?.backgroundImage === "" ? true : false,
      },
      // slide2: {
      //   title:
      //     !formData?.slide2?.title || formData?.slide2?.title === ""
      //       ? true
      //       : false,
      //   heading:
      //     !formData?.slide2?.heading || formData?.slide2?.heading === ""
      //       ? true
      //       : false,
      //   subheading:
      //     !formData?.slide2?.subheading || formData?.slide2?.subheading === ""
      //       ? true
      //       : false,
      //   buttontitle:
      //     !formData?.slide2?.buttontitle || formData?.slide2?.buttontitle === ""
      //       ? true
      //       : false,
      //   backgroundImage:
      //     !formData?.slide2?.backgroundImage ||
      //     formData?.slide2?.backgroundImage === ""
      //       ? true
      //       : false,
      // },
    };

    setErrors(newErrors);
    console.log("errrosss", newErrors);
    console.log(handleValid(newErrors));

    if (handleValid(newErrors)) return;

    const homedata = {
      name: "home_slides_content",
      type: "home_slides_content",
      status: formData?.status,
      content: {
        position: formData?.position,
        slide1: formData?.slide1,
        // slide2: formData?.slide2,
        // imagePath: formData?.imagePath,
      },
      // removePhotos:
      //   isImgEdit === true && removePhotos?.length > 0 ? removePhotos : [],
    };

    //console.log("hoeeeeeee", homedata);

    const contentId = faqItems ? faqItems?.id : null;
    await create_faq_question(localStorage.getItem("token"), homedata, contentId, dispatch);
    await get_all_faq_questions(localStorage.getItem("token"), "home_slides_content", dispatch);
    setIsImgEdit(false);

    // if (contentwo && imagePath) {
    //     const quest_data = {
    //         name: "home_content",
    //         type: "home_content",
    //         status: formData.status,
    //         content: {
    //             // content1: formData?.content,
    //             content: formData?.contentwo,
    //             imagePath: formData?.imagePath,
    //         }
    //     };
    //     await create_faq_question(localStorage.getItem("token"), quest_data, faqItems[0]?._id);
    //     await get_all_faq_questions(localStorage.getItem("token"), "home_content", dispatch);
    // }
  };

  useEffect(() => {
    const handleQuest = async () => {
       await get_all_faq_questions(localStorage.getItem("token"),"home_slides_content",dispatch);
    };
    handleQuest();
  }, []);

  useEffect(() => {
    if (faqItems) {
      setFormData({
        position: faqItems?.content?.position,
        slide1: {
          ...faqItems?.content?.slide1,
          opacity: faqItems?.content?.slide1?.opacity ?? 1,
          backgroundColor: faqItems?.content?.slide1?.backgroundColor ?? "#000000",
        },
        // slide2: {
        //   ...faqItems[0]?.content?.slide2,
        //   opacity: faqItems[0]?.content?.slide2?.opacity ?? 1,
        //   backgroundColor:
        //     faqItems[0]?.content?.slide2?.backgroundColor ?? "#000000",
        // },
        // imagePath: faqItems[0]?.content?.imagePath,
        status: faqItems?.status,
      });
      // setRemovePhotos((prev) => [...prev, faqItems[0]?.content?.imagePath]);
    }
  }, [faqItems]);

  return (
    <div className="container">
      <Accordion defaultActiveKey={["0"]} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h4 className="mb-0 fw-bold">Home Content</h4>
          </Accordion.Header>
          <Accordion.Body>
            <div>
              <Form onSubmit={handleSubmit}>
                <FormControl className="mt-2 mb-2">
                  <FormLabel className="fw-600">Specify the Position</FormLabel>
                  <div className="password position-relative col-lg-3 col-md-3 mb-2">
                    <select
                      name="condition"
                      type="select"
                      className="form-control"
                      style={{ appearance: "menulist" }}
                      value={formData?.position || "select"}
                      onChange={(e) => handleOption(e.target.value)}
                    >
                      <option value="select" disabled>
                        Select
                      </option>
                      {options?.map((item, index) => (
                        <option key={index} value={item?.type}>
                          {item?.label}
                        </option>
                      ))}
                    </select>
                    {errors?.position && (
                      <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                        Position is required
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormControl className="mt-2 mb-2">
                  {/* <FormLabel className="fw-600 fs-5">Slide 1</FormLabel> */}
                  <div className="d-flex flex-wrap gap-2">
                    {/* <FormControl className="mt-2 mb-1 col-md-5">
                      <FormLabel className="fw-600">Slide Title</FormLabel>
                      <Input
                        type="text"
                        name="answer"
                        value={formData?.slide1?.title}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleSlides(e.target.value, "slide1", "title")
                        }
                      />
                      {errors?.slide1?.title && (
                        <div className="error_msg">Slide title is required</div>
                      )}
                    </FormControl> */}

                    <FormControl className="mt-2 mb-1 col-md-5">
                      <FormLabel className="fw-600">Heading</FormLabel>
                      <Input
                        type="text"
                        name="answer"
                        value={formData?.slide1?.heading}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleSlides(e.target.value, "slide1", "heading")
                        }
                      />
                      {errors?.slide1?.heading && (
                        <div className="error_msg">Heading is required</div>
                      )}
                    </FormControl>

                    <FormControl className="mt-2 mb-1 col-md-5">
                      <FormLabel className="fw-600">Sub Heading</FormLabel>
                      <Input
                        type="text"
                        name="answer"
                        value={formData?.slide1?.subheading}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleSlides(e.target.value, "slide1", "subheading")
                        }
                      />
                      {errors?.slide1?.subheading && (
                        <div className="error_msg">Sub Heading is required</div>
                      )}
                    </FormControl>

                    <FormControl className="mt-2 mb-1 col-md-5">
                      <FormLabel className="fw-600">Button 1 Title</FormLabel>
                      <Input
                        type="text"
                        name="answer"
                        value={formData?.slide1?.button1title}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleSlides(e.target.value, "slide1", "button1title")
                        }
                      />
                      {errors?.slide1?.button1title && (
                        <div className="error_msg">
                          Button 1 title is required
                        </div>
                      )}
                    </FormControl>

                    <FormControl className="mt-2 mb-1 col-md-5">
                      <FormLabel className="fw-600">Button 2 Title</FormLabel>
                      <Input
                        type="text"
                        name="answer"
                        value={formData?.slide1?.button2title}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleSlides(e.target.value, "slide1", "button2title")
                        }
                      />
                      {errors?.slide1?.button2title && (
                        <div className="error_msg">
                          Button 2 title is required
                        </div>
                      )}
                    </FormControl>

                    {formData?.slide1?.backgroundImage !== "" && (
                      <FormControl className="mt-2 mb-1 col-md-2">
                        <FormLabel className="fw-600">
                          Background Color
                        </FormLabel>
                        <input
                          type="color"
                          name="answer"
                          value={formData?.slide1?.backgroundColor || "#000000"}
                          disabled={!isPermission}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              slide1: {
                                ...prev?.slide1,
                                backgroundColor: e.target.value,
                              },
                            }));
                          }}
                        />
                      </FormControl>
                    )}

                    {formData?.slide1?.backgroundImage !== "" && (
                      <FormControl className="mt-2 mb-2 col-md-5">
                        <FormLabel className="fw-600">
                          Opacity: {formData?.slide1?.opacity}
                        </FormLabel>
                        <input
                          className="form-range"
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={formData.slide1.opacity}
                          onChange={(e) => {
                            const newOpacity = parseFloat(e.target.value);
                            console.log("new", typeof newOpacity);
                            setFormData((prev) => ({
                              ...prev,
                              slide1: { ...prev.slide1, opacity: newOpacity },
                            }));
                          }}
                        />
                      </FormControl>
                    )}
                    <FormControl className="mt-2 mb-2 col-md-12">
                      <FormLabel className="fw-600">BackGround Image</FormLabel>
                      {formData?.slide1?.backgroundImage && (
                        <div className="position-relative pb-3 d-flex h-100">
                          <img
                            src={`${REACT_APP_IMAGE_URL}${formData?.slide1?.backgroundImage}`}
                            style={{
                              height: "400px",
                              width: "100%",
                            }}
                            alt="img not found"
                          />
                          {isPermissionDelete && (
                            
                              <button
                                type="button"
                                className="position-absolute upload-file-close"
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    slide1: {
                                      ...prev?.slide1,
                                      backgroundImage: "",
                                    },
                                  }));
                                }}
                              >
                                <i class="bi bi-x-circle"></i>
                                
                              </button>
                            
                          )}
                        </div>
                      )}
                      <input
                        type="file"
                        className="d-none"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        ref={slide1ref}
                        disabled={!isPermission}
                        onChange={(e) => {
                          handleSlideImage(e, "slide1");
                          e.target.value = "";
                        }}
                      />
                      <Button
                        className="upload-button"
                        disabled={!isPermission}
                        onClick={handleSlide1}
                      >
                        Upload
                      </Button>
                      {errors?.slide1?.backgroundImage && (
                        <div className="error_msg">
                          Image is required
                        </div>
                      )}
                    </FormControl>
                  </div>
                </FormControl>

                {/* <FormControl className="mt-2 mb-2">
                  <FormLabel className="fw-600 fs-5">Slide 2</FormLabel>

                  <div className="d-flex flex-wrap gap-2">
                    <FormControl className="mt-2 mb-1 col-md-5">
                      <FormLabel className="fw-600">Slide Title</FormLabel>
                      <Input
                        type="text"
                        name="answer"
                        value={formData?.slide2?.title}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleSlides(e.target.value, "slide2", "title")
                        }
                      />
                      {errors?.slide2?.title && (
                        <div className="error_msg">Slide title is required</div>
                      )}
                    </FormControl>
                    <FormControl className="mt-2 mb-1 col-md-5">
                      <FormLabel className="fw-600">Heading</FormLabel>
                      <Input
                        type="text"
                        name="answer"
                        value={formData?.slide2?.heading}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleSlides(e.target.value, "slide2", "heading")
                        }
                      />
                      {errors?.slide2?.heading && (
                        <div className="error_msg">Heading is required</div>
                      )}
                    </FormControl>
                    <FormControl className="mt-2 mb-1 col-md-5">
                      <FormLabel className="fw-600">Sub Heading</FormLabel>
                      <Input
                        type="text"
                        name="answer"
                        value={formData?.slide2?.subheading}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleSlides(e.target.value, "slide2", "subheading")
                        }
                      />
                      {errors?.slide2?.subheading && (
                        <div className="error_msg">Sub Heading is required</div>
                      )}
                    </FormControl>
                    <FormControl className="mt-2 mb-1 col-md-5">
                      <FormLabel className="fw-600">Button Title</FormLabel>
                      <Input
                        type="text"
                        name="answer"
                        value={formData?.slide2?.buttontitle}
                        disabled={!isPermission}
                        onChange={(e) =>
                          handleSlides(e.target.value, "slide2", "buttontitle")
                        }
                      />
                      {errors?.slide2?.buttontitle && (
                        <div className="error_msg">
                          Button title is required
                        </div>
                      )}
                    </FormControl>

                    {formData?.slide2?.backgroundImage !== "" && (
                      <FormControl className="mt-2 mb-1 col-md-2">
                        <FormLabel className="fw-600">
                          Background Color
                        </FormLabel>
                        <input
                          type="color"
                          name="backgroundColor"
                          value={formData?.slide2?.backgroundColor || "#000000"}
                          disabled={!isPermission}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              slide2: {
                                ...prev?.slide2,
                                backgroundColor: e.target.value,
                              },
                            }));
                          }}
                        />
                      </FormControl>
                    )}

                    {formData?.slide2?.backgroundImage !== "" && (
                      <FormControl className="mt-2 mb-2 col-md-5">
                        <FormLabel className="fw-600">
                          Opacity: {formData?.slide2?.opacity}
                        </FormLabel>
                        <input
                          className="form-range"
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={formData.slide2.opacity}
                          onChange={(e) => {
                            const newOpacity = parseFloat(e.target.value);
                            console.log("new", typeof newOpacity);
                            setFormData((prev) => ({
                              ...prev,
                              slide2: { ...prev.slide2, opacity: newOpacity },
                            }));
                          }}
                        />
                      </FormControl>
                    )}
                    <FormControl className="mt-2 mb-2 col-md-12">
                      <FormLabel className="fw-600">BackGround Image</FormLabel>
                      {formData?.slide2?.backgroundImage && (
                        <div className="position-relative pb-3 d-flex h-100">
                          <img
                            src={`${formData?.slide2?.backgroundImage}`}
                            style={{
                              height: "400px",
                              width: "100%",
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
                                    slide2: {
                                      ...prev?.slide2,
                                      backgroundImage: "",
                                    },
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
                        ref={slide2ref}
                        disabled={!isPermission}
                        onChange={(e) => {
                          handleSlideImage(e, "slide2");
                          e.target.value = "";
                        }}
                      />
                      <Button
                        className="btn upload-button"
                        disabled={!isPermission}
                        onClick={handleSlide2}
                      >
                        Upload
                      </Button>
                      {errors?.slide2?.backgroundImage && (
                        <div className="error_msg">
                          Slider 2 Image is required
                        </div>
                      )}
                    </FormControl>
                  </div>
                </FormControl> */}

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
    faqItems: state.cms.faqItems,
  };
};

export default connect(mapStateToProps)(HomeContent);
