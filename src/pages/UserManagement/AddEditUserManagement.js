import React, { useEffect, useRef, useState } from "react";
import {
  get_particular_user,
  update_user,
  upload_image,
  upload_sell_item_logal_docs,
} from "../../reduxData/user/userAction";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import PhoneNo from "../../Shared/PhoneNo";
import { useDispatch } from "react-redux";
import StorePhoneno from "../../Shared/StorePhoneno";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import { FormHelperText } from "@mui/joy";
import PdfImg from "../../images/pdficon.png";
import DocImg from "../../images/DocxIcon.png";
import { toast } from "react-toastify";
import DefaultImg from "../../images/no_profile.png";
const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const AddEditUserManagement = () => {
  const emailRegex =
    /^(?!.*\.\.)(?!.*-@)(?!.*#)([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})$/i;
  const dispatch = useDispatch();
  const [imgPreview, setimgPreview] = useState("");
  const imageRef = useRef();
  const [isStore, setIsStore] = useState(false);
  const [storeCountry, setStoreCountry] = useState("NL");
  const [ownerCountry, setOwnerCountry] = useState("NL");
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);
  const [isData, setIsData] = useState(false);
  const [documentUpload, setDocumentUpload] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [docLoad, setDocLoad] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dateOfJoining: "",
    email: "",
    phone_number: "",
    isDeactive: "Deactivate",
    user_name: "",
    kyc_no: "",
    location: "",
    store_name: "",
  });
  const [sellItem, setSellItem] = useState({
    owner_full_name: "",
    owner_phone_number: "",
    owner_email: "",
    additional_fees: "",
    store_name: "",
    store_website: "",
    store_email: "",
    store_phone_number: "",
    range: "",
    legal_doc: "",
    owner_country: "United States",
    owner_state: "Alabama",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone_number: "",
    owner_email: "",
    additional_fees: "",
    store_name: "",
    store_website: "",
    store_email: "",
    store_phone_number: "",
    range: "",
    legal_doc: "",
    owner_full_name: "",
    owner_phone_number: "",
    kyc_no: "",
    location: "",
    user_name: "",
  });
  const [country, setCountry] = useState("NL");
  const step_one = {
    owner_full_name: sellItem?.owner_full_name, // Store
    owner_phone_number: sellItem?.owner_phone_number,
    owner_email: sellItem?.owner_email,
    additional_fees: sellItem?.additional_fees,
    store_name: sellItem?.store_name,
    store_website: sellItem?.store_website,
    range: sellItem?.range,
    legal_doc: sellItem?.legal_doc,
    store_email: sellItem?.store_email,
    store_phone_number: sellItem?.store_phone_number,
  };
  const [isImgEdit, setIsImgEdit] = useState(false);
  const [removePhotos, setRemovePhotos] = useState([]);
  const [removeFiles, setRemoveFiles] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  let maxSize = 40 * 1024 * 1024;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get_particular_user(id, localStorage.getItem("token"), dispatch);
        setUserDetails(data);
        setFormData({
          dateOfJoining: data.created_at || "",
          email: data.email || "",
          phone_number: data.phone_no || "",
          user_name: data?.user_name || "",
          isDeactive: data.isDeactive ? "Deactivate" : "Active",
          profile_pic: data?.profile_pic || null,
          kyc_no: data?.kyc_no || "",
          location: data?.location || "",
          store_name: data?.store_name || "",
        });
        setCountry(data?.country_code_name ? data?.country_code_name : "NL");
        setSellItem(data?.store_info ? data?.store_info : sellItem);
        setIsStore(data?.store_info_status ? true : false);
        setOwnerCountry(
          data?.store_info && data?.store_info?.owner_number_name
            ? data?.store_info?.owner_number_name
            : "NL"
        );
        setStoreCountry(
          data?.store_info && data?.store_info?.store_number_name
            ? data?.store_info?.store_number_name
            : "NL"
        );
        setDocumentUpload(data?.store_info ? data?.store_info?.legal_doc : []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [id]);

  //console.log(userDetails);


  const handleChange = async (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    // Validation for each field
    switch (name) {
      case "user_name":
        errorMessage = !value.trim() ? "User Name is required" : "";
        break;
      case "kyc_no":
        errorMessage = !value.trim() ? "KVK Number is required" : "";
        break;
      case "location":
        errorMessage = !value.trim() ? "Location is required" : "";
        break;
      case "store_name":
        errorMessage = !value.trim() ? "Store Name is required" : "";
        break;
      default:
        errorMessage = "";
        break;
    }

    setErrors({ ...errors, [name]: errorMessage });
    setFormData({ ...formData, [name]: name === "kyc_no" ? value.toUpperCase() : value });
  };

  const handleImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(`photos`, e.target.files[0]);
    formData.append("type", "profile_pic");
    const res = await upload_image(
      dispatch,
      localStorage.getItem("token"),
      formData
    );
    if (res) {
      setFormData({
        ...formData,
        profile_pic: res?.path[0],
      });
      setimgPreview(URL.createObjectURL(e.target.files[0]));
      setIsImgEdit(true);
    }
  };

  const handlePhone = (value, fieldName) => {
    switch (fieldName) {
      case "phone_number":
        let countrycode = getCountryCallingCode(country);
        let checkvalue = `+${countrycode}${value}`;
        setErrors({
          ...errors,
          phone_number:
            value === ""
              ? "Phone Number is required"
              : !isValidPhoneNumber(checkvalue)
                ? "Invalid Phone Number"
                : "",
        });
        setFormData({ ...formData, phone_number: value });
        break;
      default:
        break;
    }
  };

  const handleElementChange = async (value, label) => {
    setIsSubmitDisable(false);
    setIsData(true);
    let ownercountrycode = getCountryCallingCode(ownerCountry);
    let storecountrycode = getCountryCallingCode(storeCountry);
    const exptest =
      /^(?!.*\.\.)(?!.*-@)(?!.*#)([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})$/i;
    const invalidPatterns = /http|www|co|in/i;

    if (label === "legal_doc") {
      const newDocs = Array.from(value);
      if (handleFileValidator(newDocs)) return;

      setDocLoad(true);
      const docsData = await upload_sell_item_logal_docs(
        newDocs,
        localStorage.getItem("token"),
        dispatch
      );
      setDocumentUpload((prev) => [...prev, ...docsData?.data?.path]);
      setSellItem((prev) => ({ ...prev, [label]: docsData?.data?.path }));
      setDocLoad(false);
    } else {
      setSellItem((prev) => ({ ...prev, [label]: value }));
    }

    setErrors((prev) => ({
      ...prev,
      [label]:
        label === "owner_phone_number" && !value
          ? "Phone number is required"
          : label === "owner_phone_number" &&
            !isValidPhoneNumber(`+${ownercountrycode}${value}`)
            ? "Invalid phone number"
            : label === "store_phone_number" && !value
              ? "Phone number is required"
              : label === "store_phone_number" &&
                !isValidPhoneNumber(`+${storecountrycode}${value}`)
                ? "Invalid phone number"
                : label === "store_website" && value === ""
                  ? "Store Website is required"
                  : label === "store_website" && !invalidPatterns.test(value)
                    ? "Store Website url is invalid"
                    : label === "store_email" && value === ""
                      ? "Store Email is required"
                      : label === "store_email" && !exptest.test(value)
                        ? "Store Email is invalid"
                        : label === "owner_email" && value === ""
                          ? "Owner Email is required"
                          : label === "owner_email" && !exptest.test(value)
                            ? "Owner Email is invalid"
                            : value === "" &&
                              [
                                "additional_fees",
                                "range",
                                "store_name",
                                "owner_full_name",
                              ].includes(label)
                              ? "Required"
                              : "",
    }));
  };

  const handleRemoveDoc = (item) => {
    setRemoveFiles((prev) => [...prev, item]);
    let Docs = documentUpload.filter((itm) => itm !== item);
    setDocumentUpload([...Docs]);
    setSellItem((prev) => ({ ...prev, legal_doc: Docs }));
  };

  const handleFileValidator = (fileArray) => {
    let maxFileSize = fileArray?.filter((item) => item?.size > maxSize);
    if (maxFileSize?.length > 0) {
      toast.error("Uploaded File should not exceed size of 40mb!", {
        toastId: "uploafileeeeerrr",
        autoClose: 2000,
      });
      return true;
    } else {
      return false;
    }
  };

  const checkAllErrors = (data) => {
    let err = false;
    let checkErrorData = data;
    let ownercountrycode = getCountryCallingCode(ownerCountry);
    let storecountrycode = getCountryCallingCode(storeCountry);
    let invalidPatterns = /http|www|co|in/i;

    let output = Object.entries(checkErrorData);
    output.forEach(async ([key, value]) => {
      if (
        typeof value === "string" &&
        !value?.trim() &&
        ["additional_fees", "range", "store_name", "owner_full_name"].includes(
          key
        )
      ) {
        err = true;
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "Required" }));
      }
      if (key === "phone_number" && value === "") {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Phone number is required",
        }));
      }
      if (key === "owner_email" && value === "") {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Owner Email is required",
        }));
      }
      if (key === "store_email" && value === "") {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Store Email is required",
        }));
      }
      if (key === "store_phone_number" && value === "") {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Store Phone number is required",
        }));
      }
      if (key === "store_email" && value && !emailRegex.test(value)) {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Store Email is invalid",
        }));
      }
      if (key === "store_website" && value === "") {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Store website is required",
        }));
      }
      if (key === "store_website" && value && !invalidPatterns.test(value)) {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Store website url is invalid",
        }));
      }
      if (key === "owner_email" && value && !emailRegex.test(value)) {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Owner Email is invalid",
        }));
      }
      if (key === "owner_phone_number" && value === "") {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Owner Phone number is required",
        }));
      }
      if (key === "legal_doc" && value?.length === 0) {
        err = true;
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "Required" }));
      }
      if (
        value &&
        key === "store_phone_number" &&
        !isValidPhoneNumber(`+${storecountrycode}${value}`)
      ) {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Invalid phone number",
        }));
      }
      if (value && key === "owner_email" && !emailRegex.test(value)) {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Owner Email is invalid",
        }));
      }
      if (
        value &&
        key === "owner_phone_number" &&
        !isValidPhoneNumber(`+${ownercountrycode}${value}`)
      ) {
        err = true;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: "Invalid phone number",
        }));
      }
    });

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate formData fields
    let countrycode = getCountryCallingCode(country);
    let checkvalue = `+${countrycode}${formData.phone_number}`;
    const validationErrors = {
      user_name: !formData.user_name.trim() ? "User Name is required" : "",
      phone_number: formData.phone_number === "" ? "Phone Number is required" : !isValidPhoneNumber(checkvalue) ? "Invalid Phone Number" : "",
    };

    if (userDetails?.role === 'seller') {
      validationErrors.kyc_no = !formData.kyc_no.trim() ? "KYC number is required" : "";
      validationErrors.location = !formData.location.trim() ? "Location is required" : "";
      validationErrors.store_name = !formData.store_name.trim() ? "Store Name is required" : "";
    }

    setErrors((prev) => ({ ...prev, ...validationErrors }));

    // Check if there are any errors in formData
    const hasFormErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );

    // Validate store-related fields if isStore is true
    let hasStoreErrors = false;
    if (isStore) {
      hasStoreErrors = checkAllErrors(step_one);
    }

    // Prevent submission if there are errors
    if (hasFormErrors || hasStoreErrors) {
      return;
    }

    let ownercountrycode = getCountryCallingCode(ownerCountry);
    let storecountrycode = getCountryCallingCode(storeCountry);

    const userdata = {
      user_name: formData?.user_name,
      email: formData?.email,
      phone_no: formData?.phone_number,
      country_code: `+${countrycode}`,
      country_code_name: country,
      store_name: formData?.store_name,
      kyc_no: formData?.kyc_no,
      location: formData?.location,
      is_deactive: userDetails?.is_deactive
    };

    try {
      const isEdit = await update_user(
        id,
        userdata,
        navigate,
        localStorage.getItem("token"),
        dispatch
      );
      if (isEdit) {
        // toast.success("User updated successfully!", {
        //   toastId: "updateSuccess",
        //   autoClose: 2000,
        // });
        setFormData({
          dateOfJoining: "",
          email: "",
          phone_number: "",
          user_name: "",
          store_name: "",
          kyc_no: "",
          location: "",
        });
        setErrors({
          name: "",
          phone_number: "",
          owner_email: "",
          additional_fees: "",
          store_name: "",
          store_website: "",
          store_email: "",
          store_phone_number: "",
          range: "",
          legal_doc: "",
          owner_full_name: "",
          owner_phone_number: "",
          kyc_no: "",
          location: "",
          user_name: "",
        });
      }
    } catch (error) {
      toast.error("Failed to update user. Please try again.", {
        toastId: "updateError",
        autoClose: 2000,
      });
    }
  };

  const changeDateFormat = (data) => {
    const dateObject = new Date(data);
    const year = dateObject.getFullYear();
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObject.getDate()).slice(-2);
    const formattedDate = `${year}-${day}-${month}`;
    return formattedDate;
  };

  const docref = useRef();
  const handleDoc = () => {
    docref.current.click();
  };

  return (
    <div className="container profile-deatils">
      <h3 className="mt-3 mb-1 fw-600">{id ? "Edit" : "Add"} User</h3>
      <form onSubmit={handleSubmit} className="row mt-4">
        <div className="col-12 mb-3">
          <input
            type="file"
            name="profile_pic"
            className="d-none"
            accept="image/png, image/jpeg, image/jpg, image/gif"
            ref={imageRef}
            onChange={(e) => handleImage(e)}
          />
          {imgPreview ? (
            <img
              src={imgPreview}
              style={{ width: 70, height: 70, borderRadius: 75 }}
              className="object-fit-cover"
            />
          ) : (
            <img
              src={
                formData?.profile_pic ? `${REACT_APP_IMAGE_URL}${formData?.profile_pic}` : DefaultImg
              }
              style={{ width: 100, height: 100, borderRadius: 75, border: '2px solid #ddd' }}
              className="object-fit-cover "
            />
          )}
          {/* <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              imageRef.current.click();
            }}
            className="btn common-button back-btn ms-3"
          >
            Change Image
          </button> */}
        </div>
        {/* <div className="mb-3 col-md-6">
          <label htmlFor="name" className="form-label fw-600">
            Name of User
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <div className="error_msg">{errors?.name && errors.name}</div>
        </div> */}
        <div className="mb-3 col-md-6">
          <label className="form-label fw-600">User Name</label>
          <input
            type="text"
            className="form-control"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
          />
          {errors?.user_name && (
            <div className="error_msg">{errors.user_name}</div>
          )}
        </div>
        <div className="mb-3 col-md-6">
          <label htmlFor="email" className="form-label fw-600">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            disabled
            onChange={handleChange}
          />
        </div>
        <div className="mb-3 col-md-6">
          <label htmlFor="dateOfJoining" className="form-label fw-600">
            Date of Joining
          </label>
          <input
            type="text"
            className="form-control"
            id="dateOfJoining"
            name="dateOfJoining"
            value={changeDateFormat(formData.dateOfJoining)}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="mb-3 col-md-6">
          <label htmlFor="phone_number" className="form-label fw-600">
            Phone Number
          </label>
          <PhoneNo
            sellItem={formData?.phone_number}
            setSellItem={() => setFormData({ ...formData, phone_number: "" })}
            handlePhone={handlePhone}
            country={country}
            setCountry={(value) => setCountry(value)}
          />
          {errors?.phone_number && (
            <div className="error_msg">{errors.phone_number}</div>
          )}
        </div>
        {(userDetails && userDetails?.role === 'seller') && <div className="mb-3 col-md-6">
          <label className="form-label fw-600">Store Name</label>
          <input
            type="text"
            className="form-control"
            name="store_name"
            value={formData.store_name}
            onChange={handleChange}
          />
          {errors?.store_name && (
            <div className="error_msg">{errors.store_name}</div>
          )}
        </div>}
        {(userDetails && userDetails?.role === 'seller') && <div className="mb-3 col-md-6">
          <label className="form-label fw-600">KVK Number</label>
          <input
            type="text"
            className="form-control"
            name="kyc_no"
            value={formData.kyc_no}
            onChange={handleChange}
          />
          {errors?.kyc_no && (
            <div className="error_msg">{errors.kyc_no}</div>
          )}
        </div>}
        {(userDetails && userDetails?.role === 'seller') && <div className="mb-3 col-md-6">
          <label className="form-label fw-600">Location</label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          {errors?.location && (
            <div className="error_msg">{errors?.location}</div>
          )}
        </div>}
        {(userDetails && userDetails?.role === 'seller') && <div className="mb-3 col-md-6">
          <label className="form-label fw-600">Sale Type(%)</label>
          <input
            type="text"
            className="form-control"
            name="promoted"
            value={!userDetails?.promoted ? '7% Anonymous Sale' : '10% Promoted Sale'}
            disabled
          />
        </div>}
        {(userDetails && userDetails?.role === 'seller' && userDetails?.promoted) &&
          <><div className="mb-3 col-md-12 d-flex flex-column">
            <label className="form-label fw-600">Company Logo</label>
            <img
              src={
                userDetails?.company_logo ? `${REACT_APP_IMAGE_URL}${userDetails?.company_logo}` : DefaultImg
              }
              style={{ width: 100, height: 100, borderRadius: 75, border: '2px solid #ddd' }}
              className="object-fit-cover "
            />
          </div>
            <div className="mb-3 col-md-12">
              <label className="form-label fw-600">Bio</label>
              <div className="password position-relative">
                <textarea
                  name="notes"
                  cols="4"
                  rows="4"
                  class="form-control b-0 text-area-height"
                  placeholder="bio"
                  style={{ height: '120px' }}
                  value={userDetails?.bio}
                ></textarea>
              </div>
            </div>
          </>
        }

        {/* <div className="mb-3 col-md-6">
          <label htmlFor="isDeactive" className="form-label fw-600">
            Status
          </label>
          <select
            className="form-select"
            id="isDeactive"
            name="isDeactive"
            value={formData.isDeactive}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Deactivate">Inactive</option>
          </select>
        </div> */}
        {/* <div className="row mt-5 mb-4">
          <div className="col-md-4">
            <p className="medium-gray fw-600 mb-0">
              {" "}
              <span> Is user own store? </span>{" "}
            </p>
          </div>
          <div className="col-md-8">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked={isStore}
                onChange={() => setIsStore(!isStore)}
              />
            </div>
          </div>
        </div> */}

        {/* store name */}
        {/* {isStore && (
          <div className="col-md-12 col-lg-12">
            <div className="row mt-2">
              <div className="col-md-6 col-lg-6">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">
                    Store Additional Fees:
                  </label>
                  <input
                    className="form-control"
                    id="additional_fees"
                    placeholder="Enter additional fee"
                    type="number"
                    min={0}
                    value={sellItem?.additional_fees}
                    onChange={(e) =>
                      handleElementChange(e.target.value, "additional_fees")
                    }
                    onWheel={(e) => {
                      e.currentTarget.blur();
                    }}
                    onKeyDown={(e) => {
                      (e.key === " " || e.key === "-") && e.preventDefault();
                    }}
                  />
                  {errors.additional_fees && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      Store fees is required
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-md-6 col-lg-6">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">Store Name:</label>
                  <Input
                    className="form-control"
                    id="store_name"
                    placeholder="Enter store name"
                    type="text"
                    value={sellItem?.store_name}
                    onChange={(e) =>
                      handleElementChange(e.target.value, "store_name")
                    }
                  />
                  {errors.store_name && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      Store Name is required
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-md-6 col-lg-6">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">Store Website:</label>
                  <Input
                    className="form-control"
                    id="store_website"
                    placeholder="Enter website"
                    type="text"
                    value={sellItem?.store_website}
                    onChange={(e) =>
                      handleElementChange(e.target.value, "store_website")
                    }
                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  />
                  {errors.store_website && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      {errors.store_website}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-md-6 col-lg-6">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">Store Email:</label>
                  <Input
                    className="form-control"
                    id="store_email"
                    placeholder="Enter store email"
                    type="email"
                    value={sellItem?.store_email}
                    onChange={(e) =>
                      handleElementChange(e.target.value, "store_email")
                    }
                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  />
                  {errors.store_email && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      {errors.store_email}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-md-6 col-lg-6">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">
                    Store Phone number:
                  </label>
                  <div className="phone-input position-relative">
                    <StorePhoneno
                      sellItem={sellItem?.store_phone_number}
                      setSellItem={() =>
                        setSellItem({ ...sellItem, store_phone_number: "" })
                      }
                      handlePhone={handleElementChange}
                      country={storeCountry}
                      setCountry={(value) => setStoreCountry(value)}
                    />
                  </div>
                  {errors.store_phone_number && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      {errors.store_phone_number}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-md-6 col-lg-6">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">Range:</label>
                  <input
                    className="form-control position-static"
                    id="range"
                    placeholder="Enter range"
                    type="number"
                    min={0}
                    value={sellItem?.range}
                    onChange={(e) =>
                      handleElementChange(e.target.value, "range")
                    }
                    onWheel={(e) => {
                      e.currentTarget.blur();
                    }}
                    onKeyDown={(e) => {
                      (e.key === " " || e.key === "-") && e.preventDefault();
                    }}
                  />
                  {errors.range && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      Price range is required
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-md-6 col-lg-6">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">Owner Name:</label>
                  <Input
                    className="form-control position-static"
                    id="owner_full_name"
                    placeholder="Enter owner name"
                    type="text"
                    value={sellItem?.owner_full_name}
                    onChange={(e) =>
                      handleElementChange(e.target.value, "owner_full_name")
                    }
                  />
                  {errors.owner_full_name && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      Owner name is required
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-md-6 col-lg-6">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">Owner Email:</label>
                  <Input
                    className="form-control"
                    id="owner_email"
                    placeholder="Enter owner email"
                    type="email"
                    value={sellItem?.owner_email}
                    onChange={(e) =>
                      handleElementChange(e.target.value, "owner_email")
                    }
                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  />
                  {errors.owner_email && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      {errors.owner_email}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-md-6 col-lg-6">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">
                    Owner Phone number:
                  </label>
                  <div className="phone-input position-relative">
                    <PhoneNo
                      sellItem={sellItem?.owner_phone_number}
                      setSellItem={() =>
                        setSellItem({ ...sellItem, owner_phone_number: "" })
                      }
                      handlePhone={handleElementChange}
                      country={ownerCountry}
                      setCountry={(value) => setOwnerCountry(value)}
                      isOwner={true}
                    />
                  </div>
                  {errors.owner_phone_number && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      {errors.owner_phone_number}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="col-md-12 col-lg-12">
                <FormControl className="mb-3">
                  <label className="form-label fw-600">Store Documents:</label>
                  <div className="upload-file">
                    {documentUpload?.length === 0 && (
                      <label className="form-control">
                        +
                        <span className="d-block">
                          (Click to Upload Store Legal Document)
                        </span>
                        {docLoad === true && (
                          <span className="d-block">Uploading...</span>
                        )}
                        <input
                          className="form-control d-none"
                          id="legal_doc"
                          type="file"
                          accept=".pdf, .doc, .docx"
                          onChange={(e) => {
                            handleElementChange(e.target.files, "legal_doc");
                            e.target.value = "";
                          }}
                          multiple
                        />
                      </label>
                    )}

                    {documentUpload?.length > 0 && (
                      <div className="sell-item-video">
                        <div className="sell-inner-video">
                          {docLoad === true && (
                            <span className="d-block">Uploading...</span>
                          )}
                          <input
                            className="form-control d-none"
                            id="legal_doc"
                            type="file"
                            ref={docref}
                            accept=".pdf, .doc, .docx"
                            multiple
                            onChange={(e) => {
                              handleElementChange(e.target.files, "legal_doc");
                              e.target.value = "";
                            }}
                          />

                          <div
                            className={`d-flex ${
                              documentUpload?.length === 1
                                ? "justify-content-center video-thumbnail"
                                : documentUpload?.length === 2
                                ? "justify-content-start video-thumbnail"
                                : "video-thumbnail flex-wrap"
                            }`}
                          >
                            {documentUpload?.map((item) => (
                              <div className="position-relative mb-2">
                                <img
                                  src={
                                    item?.split(".").pop().toLowerCase() ===
                                    "pdf"
                                      ? PdfImg
                                      : DocImg
                                  }
                                  style={{
                                    height:
                                      documentUpload.length <= 2
                                        ? "75%"
                                        : "6.5rem",
                                    width:
                                      documentUpload.length <= 2
                                        ? "75%"
                                        : "10rem",
                                    marginLeft:
                                      documentUpload.length <= 2
                                        ? "0.2rem"
                                        : "0.5rem",
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm rounded-circle position-absolute"
                                  onClick={() => handleRemoveDoc(item)}
                                >
                                  <i class="fa-solid fa-xmark color-white"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                          <div
                            className="cursor-pointer fw-bold"
                            onClick={handleDoc}
                          >
                            + Add More Documents
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.legal_doc && (
                    <FormHelperText className="error-msg text-danger mt-0">
                      Store Documents is required
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>
          </div>
        )} */}

        <div className="d-flex gap-3 mb-3 col-md-12">
          <button type="submit" className="btn common-button">
            Submit
          </button>
          <button
            className="btn common-button back-btn"
            onClick={() => navigate("/users")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditUserManagement;