import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Form, FormLabel } from "react-bootstrap";
import {
  create_faq_question,
  get_photo_guide_content,
  upload_cms_photo,
} from "../../reduxData/cms/cmsAction";
import { FormControl, Input } from "@mui/joy";
import ReactQuill from "react-quill";
import { upload_public_doc } from "../../reduxData/user/userAction";
import { saveAs } from "file-saver";
import { connect, useDispatch } from "react-redux";
import PdfImage1 from '../../images/pdficon.png';
import DocxImage2 from '../../images/DocxIcon.png'

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const PhotoGuide = ({ photoguideCont }) => {
  const [formData, setFormData] = useState({
    heading: "",
    photoimagePath: "",
    photocontent: "",
    offerheading: "",
    offers: [],
    snapprheading: "",
    snapprs: [],
    ownphotocontent: "",
    ownphotodocument: "",
    trickscontent: "",
    mediatype: "",
    mediaurl: "",
    walkaroundcontent: "",
    status: false,
  });

  const [errors, setErrors] = useState({
    heading: "",
    photoimagePath: "",
    photocontent: "",
    offerheading: "",
    offers: [],
    snapprheading: "",
    snapprs: [],
    ownphotocontent: "",
    ownphotodocument: "",
    trickscontent: "",
    mediatype: "",
    mediaurl: "",
    walkaroundcontent: "",
  });
  const dispatch = useDispatch();

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

  const urlPattern =
    /^(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+)(?:\/[^\s]*)?$/;
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

  const handleImageChange = async (e) => {
    const fileUpload = [e.target.files[0]];
    const photoData = await upload_cms_photo(
      fileUpload,
      localStorage.getItem("token"),
      dispatch
    );
    if (photoData !== undefined) {
      setFormData({ ...formData, photoimagePath: photoData?.data?.photos[0] });
      setErrors({ ...errors, photoimagePath: null });
    }
  };

  const handleChange = (value, label) => {
    switch (label) {
      case "heading":
        setErrors({
          ...errors,
          heading: !value ? "Heading is required" : null,
        });
        setFormData({ ...formData, heading: value });
        break;
      case "photocontent":
        setErrors({
          ...errors,
          photocontent:
            !value || value === "<p><br></p>" ? "Content is required" : null,
        });
        setFormData({ ...formData, photocontent: value });
        break;
      case "offerheading":
        setErrors({
          ...errors,
          offerheading: !value ? "Offer heading is required" : null,
        });
        setFormData({ ...formData, offerheading: value });
        break;
      case "snapprheading":
        setErrors({
          ...errors,
          snapprheading: !value ? "Snappr heading is required" : null,
        });
        setFormData({ ...formData, snapprheading: value });
        break;
      case "ownphotocontent":
        setErrors({
          ...errors,
          ownphotocontent:
            !value || value === "<p><br></p>"
              ? "Own photo content is required"
              : null,
        });
        setFormData({ ...formData, ownphotocontent: value });
        break;
      case "ownphotodocument":
        setErrors({
          ...errors,
          ownphotodocument:
            !value || value === "<p><br></p>"
              ? "Own photo document is required"
              : null,
        });
        setFormData({ ...formData, ownphotodocument: value });
        break;
      case "trickscontent":
        setErrors({
          ...errors,
          trickscontent:
            !value || value === "<p><br></p>"
              ? "Tricks content is required"
              : null,
        });
        setFormData({ ...formData, trickscontent: value });
        break;
      case "walkaroundcontent":
        setErrors({
          ...errors,
          walkaroundcontent:
            !value || value === "<p><br></p>"
              ? "Walkaround content is required"
              : null,
        });
        setFormData({ ...formData, walkaroundcontent: value });
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
      case "status":
        setFormData({ ...formData, status: value ? true : false });
        break;
      default:
        setFormData({ ...formData, [label]: value });
        break;
    }
  };

  const handleAdd = () => {
    setFormData({
      ...formData,
      offers: [
        ...formData.offers,
        {
          offerheading: "",
          offersubheading: "",
          offerpoint: "",
          offerpath: "",
        },
      ],
    });
  };

  const handleRemove = (idx) => {
    const filteroffers = formData.offers.filter((item, index) => index !== idx);
    setFormData({ ...formData, offers: [...filteroffers] });
  };

  const handleOfferChange = (label, val, indx) => {
    const newOffers = [...(formData?.offers || [])];

    if (!newOffers[indx]) {
      newOffers[indx] = {};
    }

    newOffers[indx][label] = val;

    setFormData((prev) => ({ ...prev, offers: newOffers }));
  };

  const handleAddSnappr = () => {
    setFormData({
      ...formData,
      snapprs: [...formData.snapprs, { snapprpoint: "", snapprimage: "" }],
    });
  };

  const handleRemoveSnappr = (idx) => {
    const filtersnapprs = formData.snapprs.filter(
      (item, index) => index !== idx
    );
    setFormData({ ...formData, snapprs: [...filtersnapprs] });
  };

  const handleSnapprChange = (label, val, indx) => {
    const newSnapprs = [...formData?.snapprs];
    // const newErrpoint = [...errors.point];

    if (newSnapprs[indx]) {
      newSnapprs[indx][label] = val;
      setFormData((prev) => ({ ...prev, snapprs: newSnapprs }));
    }

    // newErrpoint[indx].pointval = !val || val === "" ? true : false;
    // setErrors({ ...errors, points: newErrpoint });
  };

  const snapprRef = useRef();
  const handleSnapprClick = () => {
    snapprRef.current.click();
  };
  const [snapprlabels, setSnapprlabels] = useState({
    indx: null,
    labl: null,
  });

  const handleSnapprImg = async (e) => {
    const fileUpload = [e.target.files[0]];
    const photoData = await upload_cms_photo(
      fileUpload,
      localStorage.getItem("token"),
      dispatch
    );
    if (photoData !== undefined) {
      const newSnapprs = [...formData?.snapprs];
      if (newSnapprs[snapprlabels?.indx]) {
        newSnapprs[snapprlabels?.indx][snapprlabels?.labl] =
          photoData?.data?.photos[0];
        setFormData((prev) => ({ ...prev, snapprs: newSnapprs }));
      }
    }
  };

  const documentRef = useRef();
  const documentClick = () => {
    documentRef.current.click();
  };
  const handleDocumentChange = async (e) => {
    const fileUpload = [e.target.files[0]];
    const photoData = await upload_public_doc(
      fileUpload,
      localStorage.getItem("token"),
      dispatch
    );
    if (photoData !== undefined) {
      setFormData({ ...formData, ownphotodocument: photoData?.data?.paths[0] });
      setErrors({ ...errors, ownphotodocument: null });
    }
  };

  const mediaRef = useRef();
  const handleMediaClick = () => {
    mediaRef.current.click();
  };

  const handleMedia = (val) => {
    setFormData({ ...formData, mediatype: val, mediaurl: "" });
    setErrors({ ...errors, mediatype: null });
  };

  const handleMediaChange = async (e) => {
    const fileUpload = [e.target.files[0]];
    const photoData = await upload_cms_photo(
      fileUpload,
      localStorage.getItem("token"),
      dispatch
    );
    if (photoData !== undefined) {
      setFormData({ ...formData, mediaurl: photoData?.data?.photos[0] });
      setErrors({ ...errors, mediaurl: null });
    }
  };

  const handleDownload = async (url) => {
    // const filepath = url.includes('+') ? url.replace(/\+/g, '%2B') : url;
    const fileContent = `download?file=${url}`;
    const fileName = url?.substring(url?.lastIndexOf("/") + 1);
    const getMimeType = (ext) => {
      const mimeTypes = {
        txt: "text/plain",
        pdf: "application/pdf",
        zip: "application/zip",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        mp4: "video/mp4",
        mov: "video/quicktime",
      };
      return mimeTypes[ext] || "application/octet-stream";
    };

    const response = await fetch(fileContent);
    const blobFile = await response.blob();
    const fileExtension = fileName?.split(".").pop().toLowerCase();
    const mimeType = getMimeType(fileExtension);
    const blobwithtype = new Blob([blobFile], { type: mimeType });
    saveAs(blobwithtype, fileName);
  };

  const handleErrors = () => {
    const {
      heading,
      photoimagePath,
      photocontent,
      offerheading,
      offers,
      snapprheading,
      snapprs,
      ownphotocontent,
      ownphotodocument,
      trickscontent,
      mediatype,
      mediaurl,
      walkaroundcontent,
    } = formData;

    const errors = {};

    if (!heading) errors.heading = "Heading is required";
    if (!photoimagePath) errors.photoimagePath = "Image is required";
    if (!photocontent || photocontent === "<p><br></p>")
      errors.photocontent = "Photo content is required";
    if (!offerheading) errors.offerheading = "Offer heading is required";

    if (!Array.isArray(offers)) {
      errors.offers = "Offers must be an array";
    } else {
      const offerErrors = offers
        .map((item, i) => {
          const obj = {};
          if (!item.offerheading)
            obj.offerheading = `Offer ${i + 1}: Heading is required`;
          if (!item.offersubheading)
            obj.offersubheading = `Offer ${i + 1}: Subheading is required`;
          if (!item.offerpoint)
            obj.offerpoint = `Offer ${i + 1}: Point is required`;
          if (!item.offerpath)
            obj.offerpath = `Offer ${i + 1}: Path is required`;
          return Object.keys(obj).length ? obj : null;
        })
        .filter(Boolean);
      if (offerErrors.length) errors.offers = offerErrors;
    }

    if (!snapprheading) errors.snapprheading = "Snappr heading is required";

    if (!Array.isArray(snapprs)) {
      errors.snapprs = "Snapprs must be an array";
    } else {
      const snapprErrors = snapprs
        .map((item, i) => {
          const obj = {};
          if (!item.snapprpoint)
            obj.snapprpoint = `Snappr ${i + 1}: Point is required`;
          if (!item.snapprimage)
            obj.snapprimage = `Snappr ${i + 1}: Image is required`;
          return Object.keys(obj).length ? obj : null;
        })
        .filter(Boolean);
      if (snapprErrors.length) errors.snapprs = snapprErrors;
    }

    if (!ownphotocontent || ownphotocontent === "<p><br></p>")
      errors.ownphotocontent = "Own photo content is required";
    if (!ownphotodocument)
      errors.ownphotodocument = "Own photo document is required";
    if (!trickscontent || trickscontent === "<p><br></p>")
      errors.trickscontent = "Tricks content is required";
    if (!mediatype) errors.mediatype = "Media type is required";
    if (!mediaurl) errors.mediaurl = "Media URL is required";
    if (!walkaroundcontent || walkaroundcontent === "<p><br></p>")
      errors.walkaroundcontent = "Walkaround content is required";

    setErrors(errors);

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = handleErrors();
    if (Object.keys(errors).length > 0) return;

    const content_data = {
      name: "photo_guide_content",
      type: "photo_guide_content",
      status: formData?.status,
      content: {
        heading: formData?.heading,
        photoimagePath: formData?.photoimagePath,
        photocontent: formData?.photocontent,
        offerheading: formData?.offerheading,
        offers: formData?.offers,
        snapprheading: formData?.snapprheading,
        snapprs: formData?.snapprs,
        ownphotocontent: formData?.ownphotocontent,
        ownphotodocument: formData?.ownphotodocument,
        trickscontent: formData?.trickscontent,
        mediatype: formData?.mediatype,
        mediaurl: formData?.mediaurl,
        walkaroundcontent: formData?.walkaroundcontent,
      },
    };

    await create_faq_question(
      localStorage.getItem("token"),
      content_data,
      photoguideCont[0]?._id,
      dispatch
    );
  };

  useEffect(() => {
    const handleQuest = async () => {
      await get_photo_guide_content(
        localStorage.getItem("token"),
        "photo_guide_content",
        dispatch
      );
    };
    handleQuest();
  }, [dispatch]);

  useEffect(() => {
    if (photoguideCont?.length > 0) {
      setFormData((prev) => ({
        ...prev,
        heading: photoguideCont[0]?.content?.heading,
        photoimagePath: photoguideCont[0]?.content?.photoimagePath,
        photocontent: photoguideCont[0]?.content?.photocontent,
        offerheading: photoguideCont[0]?.content?.offerheading,
        offers: photoguideCont[0]?.content?.offers,
        snapprheading: photoguideCont[0]?.content?.snapprheading,
        snapprs: photoguideCont[0]?.content?.snapprs,
        ownphotocontent: photoguideCont[0]?.content?.ownphotocontent,
        ownphotodocument: photoguideCont[0]?.content?.ownphotodocument,
        trickscontent: photoguideCont[0]?.content?.trickscontent,
        mediatype: photoguideCont[0]?.content?.mediatype,
        mediaurl: photoguideCont[0]?.content?.mediaurl,
        walkaroundcontent: photoguideCont[0]?.content?.walkaroundcontent,
        status: photoguideCont[0]?.status,
      }));
    }
  }, [photoguideCont]);

  return (
    <div>
      <div className="container">
        <h3 className="mb-2 fw-600">Photo Guide Content</h3>
      </div>
      <Form onSubmit={handleSubmit}>
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4 className="fw-600 ms-2">PhotoGraphy Content</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div className="ms-2 p-2">
                <FormControl className="mt-0 mb-2">
                  <FormLabel className="fw-600">Heading</FormLabel>
                  <Input
                    type="text"
                    name="heading"
                    placeholder="Enter heading"
                    value={formData?.heading}
                    onChange={(e) => handleChange(e.target.value, "heading")}
                  />
                  {errors?.heading && (
                    <div className="error_msg">{errors?.heading}</div>
                  )}
                </FormControl>

                <FormControl className="mt-0 mb-2">
                  <FormLabel className="fw-600">Image</FormLabel>
                  {formData?.photoimagePath && (
                    <div className="position-relative pb-3 d-flex h-100">
                      <img
                        src={`${formData?.photoimagePath}`}
                        style={{
                          height: "500px",
                          width: "90%",
                        }}
                        alt="img not found"
                      />
                      <div className="position-absolute upload-file-close">
                        <button
                          type="button"
                          className="btn btn-sm rounded-circle"
                          onClick={() => {
                            setFormData({ ...formData, photoimagePath: "" });
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
                  {errors?.photoimagePath && (
                    <div className="error_msg">{errors?.photoimagePath}</div>
                  )}
                </FormControl>

                <FormControl className="mt-0 mb-2">
                  <FormLabel className="fw-600">Content</FormLabel>
                  <ReactQuill
                    name="answer"
                    value={formData.photocontent}
                    modules={modules}
                    onChange={(value) => handleChange(value, "photocontent")}
                  />
                  {errors?.photocontent && (
                    <div className="error_msg">{errors?.photocontent}</div>
                  )}
                </FormControl>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4 className="fw-600 ms-2">Offers Content</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div className="ms-2 p-2">
                <FormControl className="mt-0 mb-2">
                  <FormLabel className="fw-600">Heading</FormLabel>
                  <Input
                    type="text"
                    name="heading"
                    placeholder="Enter offer heading"
                    value={formData?.offerheading}
                    onChange={(e) =>
                      handleChange(e.target.value, "offerheading")
                    }
                  />
                  {errors?.offerheading && (
                    <div className="error_msg">{errors?.offerheading}</div>
                  )}
                </FormControl>
                <FormControl className="mt-0 mb-2">
                  <div className="d-flex gap-2">
                    <label className="fw-600 text-dark">Offers</label>
                    <Button
                      type="button"
                      className="btn content-button"
                      onClick={handleAdd}
                    >
                      Add Offer
                    </Button>
                  </div>

                  {formData?.offers?.length > 0 &&
                    formData?.offers?.map((item, index) => (
                      <div key={index}>
                        <h5>Offer{index + 1}</h5>
                        <div className="ms-2 p-2">
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">
                              Offer Heading
                            </FormLabel>
                            <Input
                              type="text"
                              name="offerheading"
                              placeholder="Enter offer heading"
                              value={item?.offerheading || ""}
                              onChange={(e) =>
                                handleOfferChange(
                                  "offerheading",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.offers &&
                              errors?.offers[index]?.offerheading && (
                                <div className="error_msg">
                                  {errors?.offers[index]?.offerheading}
                                </div>
                              )}
                          </FormControl>
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">
                              Offer Sub Heading
                            </FormLabel>
                            <Input
                              type="text"
                              name="offersubheading"
                              placeholder="Enter offer sub heading"
                              value={item?.offersubheading || ""}
                              onChange={(e) =>
                                handleOfferChange(
                                  "offersubheading",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.offers &&
                              errors?.offers[index]?.offersubheading && (
                                <div className="error_msg">
                                  {errors?.offers[index]?.offersubheading}
                                </div>
                              )}
                          </FormControl>
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Point</FormLabel>
                            <Input
                              type="text"
                              name="offerpoint"
                              placeholder="Enter text"
                              value={item?.offerpoint || ""}
                              onChange={(e) =>
                                handleOfferChange(
                                  "offerpoint",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.offers &&
                              errors?.offers[index]?.offerpoint && (
                                <div className="error_msg">
                                  {errors?.offers[index]?.offerpoint}
                                </div>
                              )}
                          </FormControl>
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Path</FormLabel>
                            <Input
                              type="text"
                              name="offerpath"
                              placeholder="Enter path"
                              value={item?.offerpath || ""}
                              onChange={(e) =>
                                handleOfferChange(
                                  "offerpath",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.offers &&
                              errors?.offers[index]?.offerpath && (
                                <div className="error_msg">
                                  {errors?.offers[index]?.offerpath}
                                </div>
                              )}
                          </FormControl>
                        </div>
                        <div className="mb-1 mt-1 ms-2 col-lg-4">
                          <Button
                            type="button"
                            className="btn content-button"
                            onClick={() => handleRemove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </FormControl>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4 className="fw-600 ms-2">Snappr Content</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div className="ms-2 p-2">
                <FormControl className="mt-0 mb-2">
                  <FormLabel className="fw-600">Heading</FormLabel>
                  <Input
                    type="text"
                    name="heading"
                    placeholder="Enter snappr heading"
                    value={formData?.snapprheading}
                    onChange={(e) =>
                      handleChange(e.target.value, "snapprheading")
                    }
                  />
                  {errors?.snapprheading && (
                    <div className="error_msg">{errors?.snapprheading}</div>
                  )}
                </FormControl>
                <FormControl className="mt-0 mb-2">
                  <div className="d-flex gap-2">
                    <label className="fw-600 text-dark">Points</label>
                    <Button
                      type="button"
                      className="btn content-button"
                      onClick={handleAddSnappr}
                    >
                      Add Points
                    </Button>
                  </div>
                  <input
                    type="file"
                    className="d-none"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    ref={snapprRef}
                    onChange={handleSnapprImg}
                  />

                  {formData?.snapprs?.length > 0 &&
                    formData?.snapprs?.map((item, index) => (
                      <div key={index}>
                        <h5>Point{index + 1}</h5>
                        <div className="ms-2 p-2">
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Point</FormLabel>
                            <Input
                              type="text"
                              name="snapprpoint"
                              placeholder="Enter text"
                              value={item?.snapprpoint}
                              onChange={(e) =>
                                handleSnapprChange(
                                  "snapprpoint",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            {errors?.snapprs &&
                              errors?.snapprs[index]?.snapprpoint && (
                                <div className="error_msg">
                                  {errors?.snapprs[index]?.snapprpoint}
                                </div>
                              )}
                          </FormControl>
                          <FormControl className="mt-0 mb-2">
                            <FormLabel className="fw-600">Image</FormLabel>
                            {item?.snapprimage && (
                              <div className="position-relative pb-3 d-flex h-100">
                                <img
                                  src={`${item?.snapprimage}`}
                                  style={{
                                    height: "500px",
                                    width: "90%",
                                  }}
                                  alt="img not found"
                                />
                                {/* <div className="position-absolute upload-file-close">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm rounded-circle"
                                                                    onClick={() => { setFormData({ ...formData, photoimagePath: '' }) }}>
                                                                    <i class="fa-solid fa-xmark color-white"></i>
                                                                </button>
                                                            </div> */}
                              </div>
                            )}
                            <Button
                              className="btn upload-button"
                              onClick={() => {
                                setSnapprlabels({
                                  indx: index,
                                  labl: "snapprimage",
                                });
                                handleSnapprClick();
                              }}
                            >
                              Upload
                            </Button>
                            {errors?.snapprs &&
                              errors?.snapprs[index]?.snapprimage && (
                                <div className="error_msg">
                                  {errors?.snapprs[index]?.snapprimage}
                                </div>
                              )}
                          </FormControl>
                        </div>
                        <div className="mb-1 mt-1 ms-2 col-lg-4">
                          <Button
                            type="button"
                            className="btn content-button"
                            onClick={() => handleRemoveSnappr(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </FormControl>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4 className="fw-600 ms-2">Photos & Videos Content</h4>
            </Accordion.Header>
            <Accordion.Body>
              <div className="ms-2 p-2">
                <FormControl className="mt-0 mb-2">
                  <FormLabel className="fw-600">Own Photo Content</FormLabel>
                  <ReactQuill
                    name="ownphotocontent"
                    value={formData.ownphotocontent}
                    modules={modules}
                    onChange={(value) => handleChange(value, "ownphotocontent")}
                  />
                  {errors?.ownphotocontent && (
                    <div className="error_msg">{errors?.ownphotocontent}</div>
                  )}
                </FormControl>

                <FormControl className="mt-0 mb-2">
                  <FormLabel className="fw-600">Photo Document</FormLabel>
                  {formData?.ownphotodocument && (
                    <div className="position-relative pb-3 d-flex h-100">
                      {formData?.ownphotodocument
                        ?.split(".")
                        .pop()
                        .toLowerCase() === "pdf" ? (
                        <img
                          src={PdfImage1}
                          alt="Img1"
                          className="cursor-pointer object-fit-cover"
                          height={"70%"}
                          width={"70%"}
                          onClick={() =>
                            handleDownload(formData?.ownphotodocument)
                          }
                        />
                      ) : (
                        <img
                          src={DocxImage2}
                          alt="Img2"
                          className="cursor-pointer object-fit-cover"
                          height={"70%"}
                          width={"70%"}
                          onClick={() =>
                            handleDownload(formData?.ownphotodocument)
                          }
                        />
                      )}
                      <div className="position-absolute upload-file-close">
                        <button
                          type="button"
                          className="btn btn-sm rounded-circle"
                          onClick={() => {
                            setFormData({ ...formData, ownphotodocument: "" });
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
                    accept=".pdf, .doc, .docx"
                    ref={documentRef}
                    onChange={handleDocumentChange}
                  />
                  <Button className="btn upload-button" onClick={documentClick}>
                    Upload
                  </Button>
                  {errors?.ownphotodocument && (
                    <div className="error_msg">{errors?.ownphotodocument}</div>
                  )}
                </FormControl>

                <FormControl className="mt-0 mb-2">
                  <FormLabel className="fw-600">Tricks Content</FormLabel>
                  <ReactQuill
                    name="trickscontent"
                    value={formData.trickscontent}
                    modules={modules}
                    onChange={(value) => handleChange(value, "trickscontent")}
                  />
                  {errors?.trickscontent && (
                    <div className="error_msg">{errors?.trickscontent}</div>
                  )}
                </FormControl>

                <FormControl className="mt-2 mb-2">
                  <FormLabel className="fw-600">Media</FormLabel>
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
                    {errors?.mediatype && (
                      <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                        {errors?.mediatype}
                      </p>
                    )}
                  </div>
                  {/* {errors?.condition && <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">{errors?.condition}</p>} */}

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
                                alt="img not found"
                              />
                            )}

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
                          </div>
                        )}
                        <input
                          type="file"
                          className="d-none"
                          accept={formData?.mediatype}
                          ref={mediaRef}
                          onChange={handleMediaChange}
                        />
                        <div className="col-md-4 col-lg-4">
                          <Button
                            className="btn upload-button"
                            onClick={handleMediaClick}
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
                  {formData?.mediatype !== "" && errors?.mediaurl && (
                    <div className="error_msg">{errors?.mediaurl}</div>
                  )}
                </FormControl>

                <FormControl className="mt-0 mb-2">
                  <FormLabel className="fw-600">Walkaround Content</FormLabel>
                  <ReactQuill
                    name="walkaroundcontent"
                    value={formData.walkaroundcontent}
                    modules={modules}
                    onChange={(value) =>
                      handleChange(value, "walkaroundcontent")
                    }
                  />
                  {errors?.walkaroundcontent && (
                    <div className="error_msg">{errors?.walkaroundcontent}</div>
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
    photoguideCont: state.cms.photoguideCont,
  };
};

export default connect(mapStateToProps)(PhotoGuide);
