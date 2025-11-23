import { Country, State } from "country-state-city";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";
import DOMPurify from "dompurify";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const ViewDetail = ({ show, handleClose, edititem }) => {
  // console.log("view detail =====>", edititem);
  
  const [formdata, setFormData] = useState({
    fullname: "",
    phonenumber: "",
    additionalfees: "",
    storename: "",
    storewebsite: "",
    range: "",
    storelegaldoc: null,
    itemname: "",
    iteminfo: "",
    versiontype: "",
    condition: "",
    knowsflaws: "",
    itemlocation: "",
    zipcode: "",
    higlights: "",
    modificationinfo: "",
    servicehistory: "",
    ownercountry: "",
    ownerstate: "",
    sellernotes: "",
    reserveprice: "",
    mediaimage: [],
    mediavideo: [],
    bidstart: "",
    bidend: "",
  });
  const versiontypes = [
    { id: 1, name: "Countertop", value: "Countertop" },
    { id: 2, name: "Full size", value: "Full_size" },
  ];
  const conditions = [
    { id: 1, name: "Original", value: "Original" },
    { id: 2, name: "Restored", value: "Restored" },
  ];
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Format as YYYY-MM-DDTHH:MM
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (edititem) {
      const startdate = new Date(edititem?.start_date);
      const enddate = new Date(edititem?.end_date);
      setImages(
        edititem?.photos?.map((path) => {
          return { preview: path, imgdata: path };
        })
      );
      setVideos(
        edititem?.video?.find((itm) => itm !== "null")
          ? edititem?.video?.map((item) => item)
          : []
      );
      setSelectedTags(edititem?.tags);
      setAttributes(edititem?.attributes);
      setFormData((prev) => {
        return {
          ...prev,
          fullname: edititem?.owner?.full_name,
          phonenumber: edititem?.owner?.phone_number,
          additionalfees: edititem?.owner?.additional_fees
            ? parseInt(edititem?.owner?.additional_fees)
            : null,
          storename: edititem?.owner?.store_name,
          storewebsite: edititem?.owner?.store_website,
          range: edititem?.owner?.range
            ? parseInt(edititem?.owner?.range)
            : null,
          storelegaldoc:
            edititem?.owner?.store_legal_docs?.length > 0
              ? edititem?.owner?.store_legal_docs
              : null,
          itemname: edititem?.item_name !== "null" ? edititem?.item_name : null,
          iteminfo: edititem?.game_info !== "null" ? edititem?.game_info : null,
          versiontype:
            edititem?.version_type !== "null" ? edititem?.version_type : null,
          condition:
            edititem?.condition !== "null" ? edititem?.condition : null,
          knowsflaws:
            edititem?.known_flaws !== "null" ? edititem?.known_flaws : null,
          itemlocation:
            edititem?.location !== "null" ? edititem?.location : null,
          zipcode: edititem?.zipcode !== "null" ? edititem?.zipcode : null,
          higlights:
            edititem?.highlights_info !== "null"
              ? edititem?.highlights_info
              : null,
          modificationinfo:
            edititem?.modifications_info !== "null"
              ? edititem?.modifications_info
              : null,
          servicehistory:
            edititem?.service_history !== "null"
              ? edititem?.service_history
              : null,
          ownercountry:
            edititem?.owner_country !== "null" ? edititem?.owner_country : null,
          ownerstate:
            edititem?.owner_state !== "null" ? edititem?.owner_state : null,
          sellernotes:
            edititem?.seller_note !== "null" ? edititem?.seller_note : null,
          reserveprice: edititem?.reserver_price
            ? parseInt(edititem?.reserver_price)
            : 0,
          bidstart: edititem?.start_date
            ? formatDateTimeLocal(edititem?.start_date)
            : "",
          bidend: edititem?.end_date
            ? formatDateTimeLocal(edititem?.end_date)
            : "",
        };
      });
    }
  }, [edititem]);

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

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal-lg auction-item-detail-popup"
    >
      <Modal.Body>
        <div>
          <div className="col-md-12 col-lg-12 text-end">
            <i
              class="fa-solid fa-xmark color-white cursor-pointer"
              onClick={handleClose}
            ></i>
          </div>
          <div className="profile-deatils bg-white mt-4">
            <div className="detail-heading px-4 py-3">
              <div className="text-dark fw-600 h5 mb-0">Auction Details</div>{" "}
            </div>
            <div className="p-4">
              <div className="row">
                <form>
                  {formdata?.fullname && (
                    <div>
                      <h4 className="text-black mb-3 fw-600 fw-600">
                        Owner Details
                      </h4>
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="row">
                      {formdata?.fullname && (
                        <div className="col-md-6 col-lg-6">
                          <label className="text-dark fw-600 mb-2">
                            Full Name
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="fullname"
                              className="form-control"
                              disabled
                              placeholder="Full Name"
                              value={formdata?.fullname}
                            />
                          </div>
                        </div>
                      )}
                      {formdata?.phonenumber && (
                        <div className="col-md-6 col-lg-6">
                          <label className="text-dark fw-600 mb-2">
                            Phone Number
                          </label>
                          <div className="password position-relative">
                            <input
                              type="number"
                              name="phonenumber"
                              className="form-control"
                              disabled
                              placeholder="Phone Number"
                              value={formdata?.phonenumber}
                            />
                          </div>
                        </div>
                      )}
                      {formdata?.additionalfees && (
                        <div className="col-md-6 col-lg-6">
                          <label className="text-dark fw-600 mb-2">
                            Additional Fees
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="fullname"
                              className="form-control"
                              disabled
                              placeholder="Full Name"
                              value={formdata?.additionalfees}
                            />
                          </div>
                        </div>
                      )}
                      {formdata?.storename && (
                        <div className="col-md-6 col-lg-6">
                          <label className="text-dark fw-600 mb-2">
                            Store Name
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="fullname"
                              className="form-control"
                              disabled
                              placeholder="Full Name"
                              value={formdata?.storename}
                            />
                          </div>
                        </div>
                      )}
                      {formdata?.storewebsite && (
                        <div className="col-md-6 col-lg-6">
                          <label className="text-dark fw-600 mb-2">
                            Store Website
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="fullname"
                              className="form-control"
                              disabled
                              placeholder="Full Name"
                              value={formdata?.storewebsite}
                            />
                          </div>
                        </div>
                      )}
                      {formdata?.range && (
                        <div className="col-md-6 col-lg-6">
                          <label className="text-dark fw-600 mb-2">
                            Range of Items you deal
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="fullname"
                              className="form-control"
                              disabled
                              placeholder="Full Name"
                              value={formdata?.range}
                            />
                          </div>
                        </div>
                      )}
                      {formdata?.storelegaldoc !== null && (
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Store Legal Document
                          </label>
                          <div className="password position-relative">
                            {formdata?.storelegaldoc?.map((item) => (
                              <Link
                                className="cursor-pointer"
                                href={`${item}`}
                                style={{ color: "#0d6efd" }}
                                onClick={() => handleDownload(item)}
                              >
                                {item} <br />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-black mb-3 fw-600 fw-600">
                      Auction Details
                    </h4>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Brand Name
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="itemname"
                              className="form-control"
                              disabled
                              placeholder="Item Name"
                              value={edititem?.brand_name}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Title
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="itemname"
                              className="form-control"
                              disabled
                              placeholder="Item Name"
                              value={edititem?.title}
                            />
                            {/* <div
                              className={
                                "form-control container ql-editor py-2 px-0"
                              }
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(formdata?.iteminfo),
                              }}
                            /> */}
                            {/* <textarea
                                                            name="iteminfo"
                                                            cols="4"
                                                            rows="4"
                                                            class="form-control b-0 text-area-height"
                                                            placeholder="Enter Your item information"
                                                            style={{ height: '100px' }}
                                                            value={formdata?.iteminfo}
                                                            disabled
                                                        ></textarea> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="mb-3">
                      <div className="row">
                        <div className="col-md-6 col-lg-6">
                          <label className="text-dark fw-600 mb-2">
                            Version Type
                          </label>
                          <div className="password position-relative">
                            <select
                              name="versiontype"
                              type="select"
                              className="form-control"
                              disabled
                              value={formdata?.versiontype}
                            >
                              <option value="" disabled>
                                Select
                              </option>
                              {versiontypes?.map((item, index) => (
                                <option key={index} value={item?.label}>
                                  {item?.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-6">
                          <label className="text-dark fw-600 mb-2">
                            Condition
                          </label>
                          <div className="password position-relative">
                            <select
                              name="condition"
                              type="select"
                              className="form-control"
                              disabled
                              value={formdata?.condition}
                            >
                              <option value="" disabled>
                                Select
                              </option>
                              {conditions?.map((item, index) => (
                                <option key={index} value={item?.label}>
                                  {item?.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Known Flaws (Optional)
                          </label>
                          <div className="password position-relative">
                            <div
                              className={
                                "form-control container ql-editor py-2 px-0"
                              }
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  formdata?.knowsflaws
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Item Location
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="itemlocation"
                              className="form-control"
                              disabled
                              placeholder="location"
                              value={formdata?.itemlocation}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Zip Code
                          </label>
                          <div className="password position-relative">
                            <input
                              type="number"
                              name="itemlocation"
                              className="form-control"
                              disabled
                              placeholder="location"
                              value={formdata?.zipcode}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Highlights Info
                          </label>
                          <div className="password position-relative">
                            <div
                              className={
                                "form-control container ql-editor py-2 px-0"
                              }
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(formdata?.higlights),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Modifications Info
                          </label>
                          <div className="password position-relative">
                            <div
                              className={
                                "form-control container ql-editor py-2 px-0"
                              }
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  formdata?.modificationinfo
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Service History
                          </label>
                          <div className="password position-relative">
                            <div
                              className={
                                "form-control container ql-editor py-2 px-0"
                              }
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  formdata?.servicehistory
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="mb-3">
                      <label className="text-dark fw-600 mb-2">
                        Ownership Info
                      </label>
                      <div className="row">
                        <div className="col-md-6 col-lg-6">
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="ownercountry"
                              className="form-control"
                              disabled
                              placeholder=""
                              value={formdata?.ownercountry}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-6">
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="ownerstate"
                              className="form-control"
                              disabled
                              placeholder=""
                              value={formdata?.ownerstate}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Seller Notes
                          </label>
                          <div className="password position-relative">
                            <div
                              className={
                                "form-control container ql-editor py-2 px-0"
                              }
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  formdata?.sellernotes
                                ),
                              }}
                            />
                            
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-3 col-lg-3">
                          <label className="text-dark fw-600 mb-2">
                            Original Retail Price
                          </label>
                          <div className="password position-relative">
                            <input
                              type="number"
                              name="reserveprice"
                              className="form-control"
                              disabled
                              placeholder=""
                              value={Number(edititem?.original_retail_price)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {attributes && attributes.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-muted">Item Attributes</h6>
                        <ul className="list-group list-group-flush">
                          {attributes.map((attr, index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex justify-content-between align-items-center px-0"
                            >
                              <span>
                                <span className="fw-600">{attr.key}:</span>{" "}
                                <span>{attr.value}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedTags && selectedTags.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-muted">Tags</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedTags.map((tag, index) => (
                            <span
                              key={index}
                              className="badge bg-secondary rounded-pill"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-black mb-2 fw-600">Media Data</h4>
                    <div className="mb-4">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">Image</label>
                          <div className="row mt-3">
                            {edititem?.image_urls?.map((item, index) => (
                              <div key={index} className="col-md-2">
                                <div className=" position-relative pb-3 d-flex media-data-img-wrap">
                                  <img
                                    src={`${REACT_APP_IMAGE_URL}${item}`}
                                    className="img-fluid object-fit-cover rounded"
                                    height={50}
                                    // width={'100%'}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {videos?.length > 0 && (
                      <div className=" mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Video
                            </label>
                            <div className="row mt-3">
                              {videos?.map((item, index) => (
                                <div key={index} className="col-md-2">
                                  <div className=" position-relative pb-3 d-flex">
                                    <video
                                      src={`${item}`}
                                      height={100}
                                      // style={{ height: '100%', width: '100%' }}
                                      controls
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {edititem?.start_date !== null &&
                    edititem?.end_date !== null && (
                      <div>
                        <h4 className="text-black mb-3 fw-600">Bid Timing</h4>
                        <div className="mb-3">
                          <div className="row">
                            <div className="col-md-4 col-lg-4">
                              <div className="password position-relative">
                                <label className="text-dark fw-600 mb-1">
                                  Start Date
                                </label>
                                <input
                                  type="datetime-local"
                                  name="bidstart"
                                  className="form-control "
                                  disabled
                                  value={formdata?.bidstart}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-lg-4">
                              <div className="password position-relative">
                                <label className="text-dark fw-600 mb-1">
                                  End Date
                                </label>
                                <input
                                  type="datetime-local"
                                  name="bidend"
                                  className="form-control "
                                  disabled
                                  value={formdata?.bidend}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    edititem: state.user.itemdetail,
  };
};

export default connect(mapStateToProps)(ViewDetail);
