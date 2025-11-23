import React, { useEffect, useRef, useState } from "react";
import { GetCountries, GetState } from "react-country-state-city";
import { Country, State } from "country-state-city";
import { connect, useDispatch } from "react-redux";
import {
  get_category,
  sell_video_game,
  upload_edit_item_video,
  upload_sell_item_logal_docs,
  upload_sell_item_photo,
} from "../reduxData/user/userAction";
import { get_single_sell_Item } from "../reduxData/user/userAction";
import { Link, useNavigate, useParams } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { FormLabel, Button, Collapse } from "react-bootstrap";

import PhoneNo from "../Shared/PhoneNo";
import {
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { usePlacesWidget } from "react-google-autocomplete";
import AutoInput from "../Shared/AutoInput";
import { saveAs } from "file-saver";
import moment from "moment-timezone";
import StorePhoneno from "../Shared/StorePhoneno";
import axios from "axios";
import { toast } from "react-toastify";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import ReactQuill from "react-quill";
import { ThreeDot } from "react-loading-indicators";
import AttributeSelector from "./AttributeSelector";
import TagSelector from "./TagSelector";
import PdfImage1 from '../images/pdficon.png';
import DocxImage2 from '../images/DocxIcon.png'

const { REACT_APP_BASE_URL, REACT_APP_GOOGLE_API_KEY, REACT_APP_IMAGE_URL } = process.env;

const EditListItem = ({ user, categories   }) => {
  const [formdata, setFormData] = useState({
    fullname: "",
    phone_number: "",
    owner_email: "",
    category: "",
    additional_fees: null,
    store_name: "",
    store_website: "",
    store_email: "",
    store_phone_number: "",
    range: "",
    legal_doc: null,
    itemname: "",
    iteminfo: "",
    versiontype: "",
    condition: "",
    knowsflaws: "",
    higlights: null,
    modificationinfo: null,
    servicehistory: null,
    sellernotes: null,
    notes: "",
    reserveprice: "",
    shipmentType: "",
    mediaimage: [],
    mediavideo: [],
    bidstart: "",
    bidend: "",
  });
  const [errors, setErrors] = useState({
    fullname: "",
    phone_number: "",
    owner_email: "",
    additional_fees: "",
    store_name: "",
    store_website: "",
    store_email: "",
    store_phone_number: "",
    range: "",
    itemname: "",
    iteminfo: "",
    versiontype: "",
    condition: "",
    // knowsflaws: '',
    zipcode: "",
    // higlights: '',
    // modificationinfo: '',
    // servicehistory: '',
    // sellernotes: '',
    reserveprice: "",
    shipmentType: "",
    mediaimage: "",
    // mediavideo: '',
    bidstart: "",
    bidend: "",
  });
  const [subCategory, setSubCategory] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const [removePhotos, setRemovePhotos] = useState([]);
  const [removeVideos, setRemoveVideos] = useState([]);
  const [edititem, setEditItem] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [isExtraInfoOpen, setIsExtraInfoOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [country, setCountry] = useState("US");
  const [storeCountry, setStoreCountry] = useState("US");
  const [photos, setPhotos] = useState([]);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
  const [isDoug, setIsDoug] = useState(false);
  const [optionalData, setOptionalData] = useState({
    doug_take: "",
  });
  const handleText = (value) => {
    setOptionalData({ doug_take: value });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

 
useEffect(() => {
        const token = localStorage.getItem("token"); 
        
        get_category(dispatch, token, 1, 100);
        
    }, [dispatch]);

  // ************
  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const edit = await get_single_sell_Item(params?.id, dispatch);
      console.log('edit', edit)
      if (edit && isChange === false) {
        setEditItem(edit);
        // console.log('editItem', edit)
        setStoreInfo(edit?.created_by ? edit?.created_by : null);
        setSubCategory(edit?.sub_category ? edit?.sub_category?._id : null);
        setFormData((prev) => {
          return {
            ...prev,
            fullname: edit?.created_by?.user_name
              ? edit?.created_by?.user_name
              : edit?.created_by?.store_info
              ? edit?.created_by?.store_info?.owner_full_name
              : "",
            // fullname: edit?.owner?.full_name ? edit?.owner?.full_name : edit?.created_by?.store_info ? edit?.created_by?.store_info?.owner_full_name : "",
            phone_number:
  edit?.owner?.phone_number ||
  edit?.created_by?.store_info?.owner_phone_number ||
  edit?.created_by?.phoneNumber ||
  "",
            category: edit?.category ? edit?.category?._id : "",
            owner_email: edit?.owner?.owner_email
              ? edit?.owner?.owner_email
              : null,
            additional_fees: edit?.owner?.additional_fees
              ? edit?.owner?.additional_fees
              : null,
            store_name: edit?.owner?.store_name
              ? edit?.owner?.store_name
              : null,
            store_website: edit?.owner?.store_website
              ? edit?.owner?.store_website
              : null,
            store_email: edit?.store_email ? edit?.store_email : null,
            store_phone_number: edit?.store_phone_number
              ? edit?.store_phone_number
              : null,
            range: edit?.owner?.range ? edit?.owner?.range : null,
            legal_doc:
              edit?.owner?.store_legal_docs &&
              edit?.owner?.store_legal_docs?.length > 0
                ? edit?.owner?.store_legal_docs
                : null,
            itemname: edit?.item_name !== "null" ? edit?.item_name : "",
            iteminfo: edit?.game_info !== "null" ? edit?.game_info : "",
            versiontype:
              edit?.version_type !== "null" ? edit?.version_type : "",
            condition: edit?.condition !== "null" ? edit?.condition : "",
            knowsflaws: edit?.known_flaws !== "null" ? edit?.known_flaws : "",
            higlights:
              edit?.highlights_info !== "null" ? edit?.highlights_info : "",
            modificationinfo:
              edit?.modifications_info !== "null"
                ? edit?.modifications_info
                : "",
            servicehistory:
              edit?.service_history !== "null" ? edit?.service_history : "",
            sellernotes: edit?.seller_note !== "null" ? edit?.seller_note : "",
            notes:
              edit?.notes !== "null" &&
              edit?.notes !== null &&
              edit?.notes !== ""
                ? edit?.notes
                : "",
            shipmentType: edit?.shipmentType ? edit?.shipmentType : "",
            reserveprice:
              edit?.reserver_price !== "null" && edit?.reserver_price !== "NaN"
                ? handleprice(edit?.reserver_price)
                : "",
            bidstart:
              edit?.start_date !== null
                ? formatDateTimeLocal(edit?.start_date)
                : "",
            bidend:
              edit?.end_date !== null
                ? formatDateTimeLocal(edit?.end_date)
                : "",
          };
        });
        if (edit.photos?.length > 0 && edit.thumbnails?.length > 0) {
          const photoObjects = edit.photos.map((originalUrl, i) => ({
            original: originalUrl,
            thumbnail: edit.thumbnails[i] || originalUrl,
          }));
          setPhotos(photoObjects);
        } else if (edit.photos?.length > 0) {
          const photoObjects = edit.photos.map((url) => ({
            original: url,
            thumbnail: url,
          }));
          setPhotos(photoObjects);
        }

         if (edit?.attributes && edit?.attributes.length > 0) {
            setAttributes(edit?.attributes);
            setIsExtraInfoOpen(true);
          }

          if (edit?.tags && edit?.tags.length > 0) {
            setSelectedTags(edit?.tags);
            setIsExtraInfoOpen(true);
          }

      } else {
        setEditItem(null);
      }
      // setSellItem({
      //   game_info: edit?.game_info,
      //   seller_type: edit?.owner?.store_name ? "store" : "privateOwner",
      //   full_name: edit?.owner?.full_name,
      //   phone_number: edit?.owner?.phone_number,
      //   additional_fees: edit?.owner?.additional_fees,
      //   store_name: edit?.owner?.store_name,
      //   store_website: edit?.owner?.store_website,
      //   range: edit?.owner?.range,
      //   item_name: edit?.item_name,
      //   category: edit?.category,
      //   version_type: edit?.version_type,
      //   condition: edit?.condition,
      //   known_flaws: edit?.known_flaws,
      //   location: edit?.location,
      //   highlights_info: edit?.highlights_info,
      //   modifications_info: edit?.modifications_info,
      //   service_history: edit?.service_history,
      //   owner_country: edit?.owner_country,
      //   owner_state: edit?.owner_state,
      //   seller_note: edit?.seller_note,
      //   reserver_price: edit?.reserver_price,
      //   notes: edit?.notes,
      //   start_date: edit?.start_date,
      //   end_date: edit?.end_date,
      //   type: "new",
      // });
      // setEditItem(data?.data?.data);
    };

    fetchData();
  }, [params?.id]);

  // **********************?//

  const [countriesList, setCountriesList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const imageref = useRef();
  const videoref = useRef();
  const documentref = useRef();

  useEffect(() => {
    const countryData = Country.getAllCountries();
    setCountriesList(countryData);
  }, []);
  // console.log("countries", countriesList);
  // console.log("states", stateList);

  const versiontypes = [
    { id: 1, name: "Countertop", value: "Countertop" },
    { id: 2, name: "Full size", value: "Full_size" },
    { id: 3, name: "Non Applicable", value: "Non_Applicable" },
  ];
  const conditions = [
    // { id: 1, name: 'Original', value: 'Original' },
    // { id: 2, name: 'Restored', value: 'Restored' }
    { id: 1, name: "New", value: "New" },
    { id: 2, name: "Like New", value: "Like New" },
    { id: 3, name: "Good", value: "Good" },
    { id: 4, name: "Average", value: "Average" },
    { id: 5, name: "Poor", value: "Poor" },
    { id: 6, name: "For parts", value: "For parts" },
    { id: 7, name: "Parts only", value: "Parts only" },
  ];
  const shipping = [
    { id: 1, name: "Pick Up", value: "pickup" },
    { id: 2, name: "Shipping", value: "parsal" },
  ];
  const [isReserve, setIsReserve] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [videoFile, setVideoFile] = useState([]);
  const [docFile, setDocFile] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);

  const handleImage = () => {
    imageref.current.click();
  };
  const handleVideo = () => {
    videoref.current.click();
  };
  const handleDoc = () => {
    documentref.current.click();
  };

  const validateStartDate = (dateString) => {
    // console.log("Stated Date ====>", dateString);
    const providedDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = providedDate.getTime() - currentDate.getTime();
    const hoursDifference = timeDifference / (1000 * 3600);
    return hoursDifference > 1;
  };
  const validStartDate = (start, end) => {
    const startDate = moment.tz(start, userTimeZone);
    const endDate = moment.tz(end, userTimeZone);
    return startDate < endDate;
  };

  const validateEndDate = (startdate, enddate) => {
    const startdte = new Date(startdate);
    const enddte = new Date(enddate);
    const currentdte = new Date();
    return enddte < startdte ? false : true;
  };

  const checkSameDate = (startdate, enddate) => {
    const startdte = new Date(startdate);
    const enddte = new Date(enddate);

    return startdte.getTime() === enddte.getTime();
  };

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

  const handleReserve = (event) => {
    const { value, checked } = event.target;
    setIsSubmit(false);
    if (checked) {
      setIsReserve(true);
    } else {
      setIsReserve(false);
      setErrors((prevErrors) => ({ ...prevErrors, reserver_price: null }));
      // setFormData({ ...formdata,reserveprice: ''});
    }
  };

  const [location, setLocation] = useState("");
  const [zipCode, setZipCode] = useState("");
  const handleLocation = async (value, label) => {
    setIsSubmit(false);
    switch (label) {
      case "zipcode":
        setZipCode(value);
        setErrors({
          ...errors,
          zipcode:
            value === ""
              ? "Zip Code is required"
              : "",
        });
        break;
      default:
        break;
    }
  };

  const handleprice = (price) => {
    const formatddprice = parseInt(price);
    const formatter = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currency: "USD",
    });
    return `$${formatter.format(formatddprice)}`;
  };

  const handle_zipcodeValid = async (country, state, val) => {
    //const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&components=postal_code:${val}&key=${REACT_APP_GOOGLE_API_KEY}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?components=country:${country}|administrative_area:${state}|postal_code:${val}&key=${REACT_APP_GOOGLE_API_KEY}`;
    const res = await axios.get(url);
    // console.log("Location response ====>", res.data);
    if (res?.data?.results?.length > 0 && res?.data?.status === "OK") {
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (value, name) => {
    // const { name, value, files } = e.target;
    const exptest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsSubmit(false);
    setIsChange(true);

    switch (name) {
      case "fullname":
        // setErrors({ ...errors, fullname: value === "" ? "Full name is required" : "" });
        setFormData((prev) => ({ ...prev, fullname: value }));
        break;
      case "owner_email":
        setErrors({
          ...errors,
          owner_email:
            value === ""
              ? "Email is required"
              : !exptest.test(value)
              ? "Email is Invalid"
              : "",
        });
        setFormData((prev) => ({ ...prev, owner_email: value }));
        break;
      case "store_email":
        setErrors({
          ...errors,
          store_email:
            value === ""
              ? "Email is required"
              : !exptest.test(value)
              ? "Email is Invalid"
              : "",
        });
        setFormData((prev) => ({ ...prev, store_email: value }));
        break;
      case "additional_fees":
        setErrors({
          ...errors,
          additional_fees: value === "" ? "Store Fees is required" : "",
        });
        setFormData((prev) => ({ ...prev, additional_fees: value }));
        break;
      case "store_name":
        setErrors({
          ...errors,
          store_name: value === "" ? "Store Name is required" : "",
        });
        setFormData((prev) => ({ ...prev, store_name: value }));
        break;
      case "store_website":
        const invalidPatterns = /http|www|co|in/i;
        setErrors({
          ...errors,
          store_website:
            value === ""
              ? "Store Website is required"
              : !invalidPatterns.test(value)
              ? "Website url is not valid"
              : "",
        });
        setFormData((prev) => ({ ...prev, store_website: value }));
        break;
      case "range":
        setErrors({
          ...errors,
          range: value === "" ? "Price Range is required" : "",
        });
        setFormData((prev) => ({ ...prev, range: value }));
        break;
      case "itemname":
        setErrors({
          ...errors,
          itemname: value === "" ? "Item name is required" : "",
        });
        setFormData((prev) => ({ ...prev, itemname: value }));
        // setFormData({ ...formdata, itemname: value });
        break;
      case "iteminfo":
        setErrors({
          ...errors,
          iteminfo:
            value === ""
              ? "Item info is required"
              : value === "<p><br></p>"
              ? "Item info is required"
              : "",
        });
        //setFormData({ ...formdata, iteminfo: value });
        setFormData((prev) => ({ ...prev, iteminfo: value }));
        break;
      case "versiontype":
        setErrors({
          ...errors,
          versiontype:
            value === "" || value === "<p><br></p>" ? "Rarity is required" : "",
        });
        setFormData((prev) => ({ ...prev, versiontype: value }));
        // setFormData({ ...formdata, versiontype: value });
        break;
      case "condition":
        setErrors({
          ...errors,
          condition: value === "" ? "Condition is required" : "",
        });
        setFormData((prev) => ({ ...prev, condition: value }));
        //setFormData({ ...formdata, condition: value });
        break;
      case "knowsflaws":
        setErrors({
          ...errors,
          knowsflaws:
            value === ""
              ? "Flaws is required"
              : value === "<p><br></p>"
              ? "Flaws is required"
              : "",
        });
        setFormData((prev) => ({ ...prev, knowsflaws: value }));
        //setFormData({ ...formdata, knowsflaws: value });
        break;
      case "higlights":
        setErrors({
          ...errors,
          higlights:
            value === ""
              ? "Highlights is required"
              : value === "<p><br></p>"
              ? "Highlights is required"
              : "",
        });
        setFormData((prev) => ({ ...prev, higlights: value }));
        //setFormData({ ...formdata, higlights: value });
        break;
      case "modificationinfo":
        setErrors({
          ...errors,
          modificationinfo:
            value === ""
              ? "Modifications is required"
              : value === "<p><br></p>"
              ? "Modifications is required"
              : "",
        });
        setFormData((prev) => ({ ...prev, modificationinfo: value }));
        //setFormData({ ...formdata, modificationinfo: value });
        break;
      case "servicehistory":
        setErrors({
          ...errors,
          servicehistory:
            value === ""
              ? "Service history is required"
              : value === "<p><br></p>"
              ? "Service history is required"
              : "",
        });
        setFormData((prev) => ({ ...prev, servicehistory: value }));
        //setFormData({ ...formdata, servicehistory: value });
        break;
      case "sellernotes":
        setErrors({
          ...errors,
          sellernotes:
            value === ""
              ? "Seller note is required"
              : value === "<p><br></p>"
              ? "Seller note is required"
              : "",
        });
        setFormData((prev) => ({ ...prev, sellernotes: value }));
        //setFormData({ ...formdata, sellernotes: value });
        break;
      case "reserveprice":
        const rawValue = value.replace(/[$,]/g, "");
        setErrors({
          ...errors,
          reserveprice: value === "" ? "Reserve price is required" : "",
        });
        setFormData((prev) => ({
          ...prev,
          reserveprice: rawValue ? handleprice(rawValue) : "$0",
        }));
        //setFormData({ ...formdata, reserveprice: rawValue ? handleprice(rawValue) : "$0" });
        break;
      case "shipmentType":
        setFormData({ ...formdata, shipmentType: value });
        setErrors({
          ...errors,
          shipmentType: value === "" ? "Shipping Method is required" : "",
        });
        break;

      default:
        setFormData((prev) => ({ ...prev, [name]: value }));
        // setFormData({ ...formdata, [name]: value, });
        setErrors({ ...errors, [name]: "" });
        break;
    }

    console.log("nmameee", formdata?.fullname);
  };

  const handlePhone = (value, fieldName) => {
    setIsSubmit(false);
    switch (fieldName) {
      case "phone_number":
        let countrycode = getCountryCallingCode(country);
        let checkvalue = `+${countrycode}` + value;
        setErrors({
          ...errors,
          phone_number:
            value !== "" && !isValidPhoneNumber(checkvalue)
              ? "Invalid phone number"
              : "",
        });
        setFormData((prev) => ({ ...prev, phone_number: value }));
        // setFormData({ ...formdata, phone_number: value });
        break;
      case "store_phone_number":
        let storecountrycode = getCountryCallingCode(storeCountry);
        let storecheckvalue = `+${storecountrycode}` + value;
        setErrors({
          ...errors,
          store_phone_number:
            value === ""
              ? "Phone no. is required"
              : !isValidPhoneNumber(storecheckvalue)
              ? "Invalid phone number"
              : "",
        });
        setFormData((prev) => ({ ...prev, store_phone_number: value }));
        // setFormData({ ...formdata, store_phone_number: value });
        break;
      default:
        break;
    }
  };

  const getMinDate = () => {
    const currentDate = moment().tz(userTimeZone);
    // currentDate.add(24, 'hours');
    return currentDate.format("YYYY-MM-DDTHH:mm");
    // const currentDate = new Date();
    // currentDate.setHours(currentDate.getHours() + 72);
    // return currentDate.toISOString().slice(0, 16);
  };

  const getMinEndDate = (startDate) => {
    if (!startDate) return "";
    const startDateTime = moment(startDate).tz(userTimeZone);
    // startDateTime.add(1, 'day');
    return startDateTime.format("YYYY-MM-DDTHH:mm");

    // if (!startDate) return '';
    // const startDateTime = new Date(startDate);
    // startDateTime.setDate(startDateTime.getDate() + 1);
    // return startDateTime.toISOString().slice(0, 16);
  };

  const handleFeatured = (event) => {
    const { checked } = event.target;
    if (checked) {
      setIsFeatured(true);
    } else {
      setIsFeatured(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setIsSubmit(false);

    switch (name) {
      case "bidstart":
        setErrors({
          ...errors,
          bidstart:
            // !validateStartDate(value) ? "Start Date should add prior 1 hour"
            // : !validStartDate(value, formdata.bidend) ? "Start Date cannot be after the End date"
            // :
            null,
        });
        setFormData({ ...formdata, [name]: value });
        break;
      case "bidend":
        setErrors((prev) => ({
          ...prev,
          bidend: !value
            ? "End Date is required"
            : checkSameDate(formdata?.bidstart, value)
            ? "Start Date and End Date cannot be same"
            : null,
        }));
        setErrors((prev) => ({
          ...prev,
          bidstart: validateEndDate(formdata?.bidstart, value)
            ? null
            : "Start Date cannot be after the End date",
        }));
        // setErrors({ ...errors, bidend: !value ? "End Date is required" : checkSameDate(formdata?.bidstart, value) === true ? "Start Date and End Date cannot be same" : null });
        // setErrors({ ...errors, bidstart: validateEndDate(formdata?.bidstart, value) ? null : "Start Date cannot be after the End date" })
        setFormData({ ...formdata, [name]: value });
        break;

      default:
        setFormData({ ...formdata, [name]: value });
        setErrors({ ...errors, [name]: "" });
        break;
    }
  };

  let maxSize = 40 * 1024 * 1024;

  const handleFileValidator = (fileArray) => {
    let maxFileSize = fileArray?.filter((item) => item?.size > maxSize);
    if (maxFileSize?.length > 0) {
      toast.error("Uploaded File should not exceed size of 40mb!", {
        toastId: "uploafisdsdfsfsleeeeerrr",
        autoClose: 2000,
      });
      return true;
    } else if (maxFileSize?.length === 0) {
      return false;
    }
  };

  const [isUpload, setIsUpload] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const handleFiles = async (e) => {
    const { name, value, files } = e.target;
    setIsSubmit(false);

    switch (name) {
      case "mediaimage": {
        // Added braces for block-scoping
        setIsUpload(true);
        const newImgs = Array.from(files); // Assuming 'files' comes from e.target

        if (handleFileValidator(newImgs)) {
          setIsUpload(false); // Stop if validation fails
          return;
        }

        try {
          const photoData = await upload_sell_item_photo(
            newImgs,
            localStorage.getItem("token"),
            dispatch
          );

          if (photoData?.data?.photos && photoData?.data?.thumbnails) {
            const newImageObjects = photoData.data.photos.map(
              (originalUrl, i) => ({
                original: originalUrl,
                thumbnail: photoData.data.thumbnails[i] || originalUrl, // Fallback
              })
            );
            setPhotos((prev) => [...prev, ...newImageObjects]);
          } else {
            throw new Error("Received invalid data from server.");
          }
        } catch (error) {
          console.error("Failed to upload images:", error);
          const errorMessage =
            error.response?.data?.message ||
            "Image upload failed. Please try again.";
          toast.error(errorMessage);
        } finally {
          setIsUpload(false);
        }
        break;
      }
      case "mediavideo":
        const videoupload = [files[0]];
        if (videoupload && videoupload[0]?.size > maxSize) {
          toast.error("Uploaded File should not exceed size of 40mb!", {
            toastId: "uploavideosleeeeerrr",
            autoClose: 2000,
          });
          return;
        }

        if (videoupload) {
          const newvideos = [];
          for (let i = 0; i < files.length; i++) {
            setIsVideo(true);
            const uploadedvideo = files[i];
            const videoupload = [uploadedvideo];
            const videdata = await upload_edit_item_video(
              videoupload,
              user?.token,
              dispatch
            );
            if (videdata !== undefined) {
              const videofiles = videdata.data.path.map((item) => item);
              if (videofiles) {
                videoFile.push(...videofiles);
                newvideos.push(...videofiles);
                setIsVideo(false);
              }
            }
          }
          setVideos((prevVideos) => [...prevVideos, ...newvideos]);
        }
        break;
      case "store_legal_docs":
        const newDocs = Array.from(files);
        if (handleFileValidator(newDocs)) return;

        const docsData = await upload_sell_item_logal_docs(
          newDocs,
          localStorage.getItem("token"),
          dispatch
        );
        setDocFile((prevDocs) => [...prevDocs, ...docsData?.data?.path]);
        break;
      default:
        setFormData({ ...formdata, [name]: value });
        setErrors({ ...errors, [name]: "" });
        break;
    }
  };


  const handleRemoveDoc = (item) => {
    const totaldocs = docFile.filter((itm) => itm !== item);
    setDocFile([...totaldocs]);
    setIsSubmit(false);

    // setIsEdit(false);
    // setIsEdit(false);
  };

  const handleDeleteImage = (photoObjectToRemove) => {
    setRemovePhotos((prev) => [
      ...prev,
      photoObjectToRemove.original,
      photoObjectToRemove.thumbnail,
    ]);
    setPhotos((prevPhotos) =>
      prevPhotos.filter((p) => p.original !== photoObjectToRemove.original)
    );
  };

  const handleDeleteVideo = (item) => {
    setRemoveVideos((prev) => [...prev, item]);
    let Videos = videos.filter((itm) => itm !== item);
    setVideos([...Videos]);

    let VideoFile = videoFile.filter((itm) => itm !== item);
    setVideoFile([...VideoFile]);
    setIsSubmit(false);
  };

  const validForm = (errordata) => {
    let checkdata = Object.entries(errordata);
    let err = true;
    checkdata.forEach(([key, value]) => {
      if (value) {
        err = false;
      }
    });
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      fullname,
      phone_number,
      store_phone_number,
      additional_fees,
      store_name,
      store_email,
      store_website,
      range,
      itemname,
      iteminfo,
      versiontype,
      condition,
      higlights,
      modificationinfo,
      servicehistory,
      sellernotes,
      reserveprice,
      bidstart,
      bidend,
      shipmentType,
    } = formdata;
    let countrycode = getCountryCallingCode(country);
    let checkvalue = `+${countrycode}${phone_number}`;
    let storecountrycode = getCountryCallingCode(
      storeCountry ? storeCountry : "US"
    );
    let storevalue = `+${storecountrycode}` + store_phone_number;
    const exptest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidPatterns = /http|www|co|in/i;
    

    let newErrors = {
      fullname: null,
      phone_number:
        phone_number !== "" && !isValidPhoneNumber(checkvalue)
          ? "Invalid phone number"
          : null,
      itemname: !itemname ? "Item name is required" : null,
      iteminfo: !iteminfo
        ? "Item info is required"
        : iteminfo === "<p><br></p>"
        ? "Item info is required"
        : null,
      // store_phone_number: store_phone_number == '' ? "Store Phone number is required" : !isValidPhoneNumber(storevalue) ? "Invalid Phone Number" : null,
      versiontype:
        !versiontype || versiontype === "<p><br></p>"
          ? "Rarity is required"
          : null,
      condition: !condition ? "Condition is required" : null,
      zipcode:
        zipCode === ""
          ? "Zip Code is required"
          : null,
      higlights: !higlights
        ? "Highlights is required"
        : higlights === "<p><br></p>"
        ? "Highlights is required"
        : null,
      modificationinfo: !modificationinfo
        ? "Modification info is required"
        : modificationinfo === "<p><br></p>"
        ? "Modification info is required"
        : null,
      servicehistory: !servicehistory
        ? "Service history is required"
        : servicehistory === "<p><br></p>"
        ? "Service history is required"
        : null,
      sellernotes: !sellernotes
        ? "Seller notes is required"
        : sellernotes === "<p><br></p>"
        ? "Seller notes is required"
        : null,
      reserveprice:
        !reserveprice && isReserve ? "Reserve price is required" : null,
      mediaimage:
        imgFile?.length === 0
          ? "Photo is required"
          : imgFile?.length > 0 && imgFile?.length < 10
          ? "Minimum 10 Images are required"
          : null,
      shipmentType: !shipmentType ? "Shipping Method is required" : null,
      bidstart:
        !bidstart || bidstart === ""
          ? "Start date is required"
          : !validateEndDate(formdata?.bidstart, formdata?.bidend)
          ? "Start Date cannot be after the End date"
          : null,
      bidend:
        !bidend || bidend === ""
          ? "End date is required"
          : checkSameDate(bidstart, bidend)
          ? "Start Date and End Date cannot be same"
          : !validateEndDate(bidstart, bidend)
          ? "End date cannot be before the start date."
          : null,
    };

    // setErrors({
    //     fullname: !fullname ? "Full name is required" : "",
    //     phone_number: !phone_number ? "Phone number. is required" : !isValidPhoneNumber(checkvalue) ? "Invalid phone number" : "",
    //     itemname: !itemname ? "Item name is required" : "",
    //     iteminfo: !iteminfo ? "Item info is required" : "",
    //     store_phone_number: store_phone_number == '' ? "Store Phone number is required" : !isValidPhoneNumber(storevalue) ? "Invalid Phone Number" : null,
    //     versiontype: !versiontype ? "Version type is required" : "",
    //     condition: !condition ? "Condition is required" : "",
    //     itemlocation: !location ? "Location is required" : "",
    //     zipcode: zipCode === '' ? "Zip Code is required" : "",
    //     higlights: !higlights ? "Highlights is required" : higlights?.length > 50 ? "Highlights must be between 1 and 50 characters" : "",
    //     modificationinfo: !modificationinfo ? "Modification info is required" : "",
    //     servicehistory: !servicehistory ? "Service history is required" : "",
    //     ownercountry: !ownercountry ? "Owner country is required" : "",
    //     ownerstate: !ownerstate ? "Owner state is required" : "",
    //     sellernotes: !sellernotes ? "Seller notes is required" : "",
    //     reserveprice: !reserveprice && isReserve ? "Reserve price is required" : "",
    //     mediaimage: imgFile?.length === 0 ? "Photo is required" : "",
    //     bidstart: !bidstart || bidstart === '' ? "Start date is required" : "",
    //     bidend: !bidend || bidend === '' ? "End date is required" : !validateEndDate(bidstart, bidend) ? "End date cannot be before the start date." : ""
    // });

    // if (edititem.owner?.range !== null) {
    //     setErrors({
    //         ...errors,
    //         additional_fees: additional_fees == '' ? 'Store Fees is required' : null,
    //         owner_email: formdata.owner_email == '' ? 'Owner Email is required' : null,
    //         store_name: store_name == '' ? 'Store Name is required' : null,
    //         store_website: store_website == '' ? 'Store Website is required' : !invalidPatterns.test(store_website) ? 'Website url is not valid' : null,
    //         store_email: formdata.store_email == '' ? 'Email is required' : null,
    //         store_phone_number: formdata.store_phone_number == '' ? "Store Phone number is required" : !isValidPhoneNumber(storevalue) ? "Invalid Phone Number" : null,
    //         range: range == '' ? 'Price Range is required' : null,
    //     });
    // }

    if (edititem?.owner?.range && edititem?.owner?.range !== null) {
      newErrors = {
        ...newErrors,
        additional_fees:
          additional_fees == "" ? "Store Fees is required" : null,
        owner_email:
          formdata.owner_email == "" ? "Owner Email is required" : null,
        store_name: store_name == "" ? "Store Name is required" : null,
        store_website:
          store_website == ""
            ? "Store Website is required"
            : !invalidPatterns.test(store_website)
            ? "Website url is not valid"
            : null,
        store_email: formdata.store_email == "" ? "Email is required" : null,
        store_phone_number:
          formdata.store_phone_number == ""
            ? "Store Phone number is required"
            : !isValidPhoneNumber(storevalue)
            ? "Invalid Phone Number"
            : null,
        range: range == "" ? "Price Range is required" : null,
        legal_doc: docFile?.length === 0 ? "Store Documents is required" : null,
      };
    }

    setErrors(newErrors);

    // setErrors({
    //     ...errors,
    //     mediaimage: imgFile?.length === 0 ? "Photo is required" : imgFile?.length > 0 && imgFile?.length < 9 ? "Minimum 9 Images are required" : "",
    //     bidstart: formdata.bidstart === "" ? 'Start Date is required' : null,
    //     bidend: formdata.bidend === "" ? "End Date is required" : null,
    // });

    // if (fullname && isValidPhoneNumber(checkvalue) && itemname && iteminfo && versiontype && condition && location && zipCode &&
    //     higlights?.length < 50 && modificationinfo && sellernotes && servicehistory && ownercountry && ownerstate && bidstart && bidend
    //     && validateEndDate(bidstart, bidend) && imgFile?.length > 8) {

    // console.log("httt33333333333333", newErrors);

    if (validForm(newErrors)) {
      // console.log("htttt999999999");

      const editData = {
        full_name: formdata?.fullname,
        phone_number: formdata?.phone_number,
        category: formdata?.category,
        sub_category: subCategory,
        item_name: formdata?.itemname,
        game_info: formdata?.iteminfo,
        version_type: formdata?.versiontype,
        condition: formdata?.condition,
        zipcode: zipCode,
        highlights_info: formdata?.higlights ? formdata?.higlights : null,
        modifications_info: formdata?.modificationinfo
          ? formdata?.modificationinfo
          : null,
        service_history: formdata?.servicehistory
          ? formdata?.servicehistory
          : null,
        seller_note: formdata?.sellernotes ? formdata?.sellernotes : null,
        notes: formdata?.notes ? formdata?.notes : null,
        shipmentType: formdata?.shipmentType,
        photos: photos.map((p) => p.original),
        thumbnails: photos.map((p) => p.thumbnail),
         attributes: attributes.map(({ key, value }) => ({ key, value })),
        tags: selectedTags,
        video: videoFile,
        removePhotos: removePhotos,
        removeVideos: removeVideos,
        start_date: new Date(formdata?.bidstart).toISOString(),
        end_date: new Date(formdata?.bidend).toISOString(),
        doug_take:
          optionalData?.doug_take !== "" ? optionalData?.doug_take : null,
        country_code: country,
        owner_number_name: country,
        owner_number_code: `+${countrycode}`,
        is_featured: isFeatured,
        admin_approval: edititem?.admin_approval,
        item_id: edititem?._id,
        type: "edit",
      };
      if (isReserve) {
        editData.reserver_price = parseInt(
          formdata?.reserveprice?.replace(/[$,]/g, "")
        );
      }
      if (formdata?.knowsflaws) {
        editData.known_flaws = formdata?.knowsflaws;
      }

      if (isReserve === true && editData?.reserver_price == 0) {
        setErrors({
          ...errors,
          reserveprice: "Reseve Price should be greater than 0",
        });
        return;
      }

      if (edititem?.owner?.store_legal_docs?.length > 0) {
        editData.additional_fees = formdata.additional_fees;
        editData.owner_email = formdata.owner_email;
        editData.store_name = formdata.store_name;
        editData.store_website = formdata.store_website;
        editData.store_email = formdata.store_email;
        editData.store_phone_number = formdata.store_phone_number;
        editData.range = formdata.range;
        editData.legal_doc = docFile;
        editData.store_country_code = storeCountry;
      }

      // console.log("hititititiittitittttt", errors);
      if (
        edititem?.owner?.store_legal_docs &&
        edititem?.owner?.store_legal_docs?.length > 0 &&
        (formdata.additional_fees == "" ||
          formdata.store_name == "" ||
          formdata.store_website == "" ||
          !invalidPatterns.test(formdata.store_website) ||
          formdata.range == "" ||
          docFile?.length === 0 ||
          formdata?.owner_email == "" ||
          formdata?.store_email == "" ||
          !exptest.test(formdata?.owner_email) ||
          !exptest.test(formdata?.store_email) ||
          !isValidPhoneNumber(storevalue))
      ) {
        return;
      }

      // console.log("Errrrr33333", errors);
      // console.log("date to be change...", editData);
      setIsSubmit(true);
      await sell_video_game(editData, dispatch);
      setIsSubmit(false);
      navigate("/item-listing");

    }
  };

  useEffect(() => {
    if (countriesList?.length > 0) {
      const getcountry = countriesList.find(
        (d) => d.name === edititem?.owner_country
      );
      if (getcountry) {
        const getState = State.getStatesOfCountry(getcountry?.isoCode);
        setStateList(getState);
      }
    }
  }, [countriesList, edititem]);

  useEffect(() => {
    if (edititem !== null) {
      // console.log(edititem);
      // const startdate = new Date(edititem?.start_date);
      // const enddate = new Date(edititem?.end_date);
      // setImages(edititem?.photos?.map((path) => {
      //     return { preview: REACT_APP_BASE_URL + path, imgdata: path, }
      // }));

      setCountry(edititem?.country_code ? edititem?.country_code : "US");
      setStoreCountry(edititem?.store_country_code);
      setDocFile(edititem?.owner?.store_legal_docs);
      setZipCode(edititem?.zipcode !== "null" ? edititem?.zipcode : null);
      if (parseInt(edititem?.reserver_price) > 0) {
        setIsReserve(true);
      } else {
        setIsReserve(false);
      }

      if (edititem?.store_country_code) {
        setStoreCountry(edititem?.store_country_code);
      }

      if (edititem?.is_featured) {
        setIsFeatured(edititem?.is_featured);
      }

      if (edititem?.doug_take && edititem?.doug_take !== "null") {
        setIsDoug(true);
        setOptionalData({ doug_take: edititem?.doug_take });
      }

      setImgFile(edititem?.photos?.map((item) => item));
      setRemoveImages(edititem?.photos?.map((item) => item));
      if (!edititem.video.includes("null")) {
        setVideos(edititem?.video?.map((item) => item));
        setVideoFile(edititem?.video?.map((item) => item));
      } else {
        setVideos([]);
        setVideoFile([]);
      }
    }
  }, [edititem]);

  // console.log("edit item data ----->", edititem);
  // console.log("formdata ----->", formdata);

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

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPhotos(items);
  };

  console.log('formdata', formdata)

  return (
    <div>
      <div className="row align-items-center">
        <div className="col-md-6 col-lg-6">
          <h1 className="fw-bold text-black h3 mb-0">Edit Item</h1>
        </div>
        <div className="col-md-6 col-lg-6 text-end">
          <Link
            href="itemList"
            className="btn common-button back-btn"
            to="/item-listing"
          >
            Back
          </Link>
        </div>
      </div>
      <div className="profile-deatils bg-white mt-4">
        <div className="detail-heading px-4 py-3">
          <div className="text-dark fw-600 h5 mb-0">Item Details</div>{" "}
        </div>
        <div className="p-4">
          <div className="row">
            <form onSubmit={handleSubmit} noValidate>
              <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Owner Details</Accordion.Header>
                  <Accordion.Body>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Username
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="fullname"
                              className="form-control"
                              placeholder="Username"
                              defaultValue={formdata?.fullname}
                              onChange={(e) =>
                                handleChange(e.target.value, "fullname")
                              }
                            />
                          </div>
                          {errors?.fullname && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.fullname}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Phone Number
                          </label>
                          <div className="phone-input password position-relative">
                            <PhoneNo
                              sellItem={formdata?.phone_number}
                              setSellItem={() =>
                                setFormData({ ...formdata, phone_number: "" })
                              }
                              handlePhone={handlePhone}
                              country={country}
                              setCountry={(value) => setCountry(value)}
                            />
                          </div>
                          {errors?.phone_number && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.phone_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {edititem?.owner?.owner_email && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Owner email
                            </label>
                            <div className="password position-relative">
                              <input
                                type="email"
                                name="owner_email"
                                className="form-control"
                                placeholder="Enter owner email"
                                defaultValue={formdata?.owner_email}
                                onChange={(e) =>
                                  handleChange(e.target.value, "owner_email")
                                }
                                onInput={handleChange}
                              />
                            </div>
                            {errors?.owner_email && (
                              <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                                {errors?.owner_email}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {edititem?.owner?.additional_fees && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Additional Fees
                            </label>
                            <div className="password position-relative">
                              <input
                                type="text"
                                name="additional_fees"
                                className="form-control"
                                placeholder="Enter additional fee"
                                defaultValue={formdata?.additional_fees}
                                onChange={(e) =>
                                  handleChange(
                                    e.target.value,
                                    "additional_fees"
                                  )
                                }
                                onInput={handleChange}
                              />
                            </div>
                            {errors?.additional_fees && (
                              <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                                {errors?.additional_fees}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {edititem?.owner?.store_name && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Store Name
                            </label>
                            <div className="password position-relative">
                              <input
                                type="text"
                                name="store_name"
                                className="form-control"
                                placeholder="Enter store name"
                                defaultValue={formdata?.store_name}
                                onChange={(e) =>
                                  handleChange(e.target.value, "store_name")
                                }
                                onInput={handleChange}
                              />
                            </div>
                            {errors?.store_name && (
                              <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                                {errors?.store_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {edititem?.owner?.store_website && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Store Website
                            </label>
                            <div className="password position-relative">
                              <input
                                type="text"
                                name="store_website"
                                className="form-control"
                                placeholder="Enter website"
                                defaultValue={formdata?.store_website}
                                onChange={(e) =>
                                  handleChange(e.target.value, "store_website")
                                }
                                onInput={handleChange}
                              />
                            </div>
                            {errors?.store_website && (
                              <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                                {errors?.store_website}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {edititem?.store_email && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Store email
                            </label>
                            <div className="password position-relative">
                              <input
                                type="email"
                                name="store_email"
                                className="form-control"
                                placeholder="Enter store email"
                                defaultValue={formdata?.store_email}
                                onChange={(e) =>
                                  handleChange(e.target.value, "store_email")
                                }
                                onInput={handleChange}
                              />
                            </div>
                            {errors?.store_email && (
                              <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                                {errors?.store_email}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {edititem?.store_phone_number && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Store Phone Number
                            </label>
                            <div className="phone-input position-relative">
                              <StorePhoneno
                                sellItem={formdata?.store_phone_number}
                                setSellItem={() =>
                                  setFormData({
                                    ...formdata,
                                    store_phone_number: "",
                                  })
                                }
                                handlePhone={handlePhone}
                                country={storeCountry}
                                setCountry={(value) => setStoreCountry(value)}
                              />
                            </div>
                            {errors?.store_phone_number && (
                              <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                                {errors?.store_phone_number}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {edititem?.owner?.range && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Range
                            </label>
                            <div className="password position-relative">
                              <input
                                type="text"
                                name="range"
                                className="form-control"
                                placeholder="Enter range"
                                defaultValue={formdata?.range}
                                onChange={(e) =>
                                  handleChange(e.target.value, "range")
                                }
                                onInput={handleChange}
                              />
                            </div>
                            {errors?.range && (
                              <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                                {errors?.range}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {edititem?.owner?.store_legal_docs?.length > 0 && (
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Store Documents
                            </label>
                            <input
                              className="d-none"
                              type="file"
                              name="store_legal_docs"
                              accept=".pdf, .doc, .docx"
                              ref={documentref}
                              onChange={handleFiles}
                              multiple
                            />
                            <button
                              type="button"
                              className="p-0 bg-transparent border-0 ms-3"
                              onClick={handleDoc}
                            >
                              {" "}
                              <i class="fa-solid fa-upload"></i>
                            </button>
                            <div className="row mt-3">
                              {docFile?.map((item, index) => (
                                <div key={index} className="col-md-4">
                                  <div className=" position-relative pb-3 d-flex h-100">
                                    {item?.split(".").pop().toLowerCase() ===
                                    "pdf" ? (
                                      <img
                                        src={PdfImage1}
                                        alt="Img1"
                                        className="cursor-pointer object-fit-cover"
                                        height={"70%"}
                                        width={"70%"}
                                        onClick={() => handleDownload(item)}
                                      />
                                    ) : (
                                      <img
                                        src={DocxImage2}
                                        alt="Img2"
                                        className="cursor-pointer object-fit-cover"
                                        height={"70%"}
                                        width={"70%"}
                                        onClick={() => handleDownload(item)}
                                      />
                                    )}

                                    <div className="position-absolute upload-file-close">
                                      <button
                                        type="button"
                                        className="btn btn-sm rounded-circle"
                                        onClick={() => handleRemoveDoc(item)}
                                      >
                                        <i class="fa-solid fa-xmark color-white"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {docFile?.length === 0 && (
                              <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                                Store Documents is required
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
<div className="col-md-6 col-lg-6">
            <label className="text-dark fw-600 mb-2">Category</label>
            <div className="password position-relative">
              <select
                name="category"
                className="form-control"
                style={{ appearance: "menulist" }}
                value={formdata?.category}
                onChange={(e) => handleChange(e.target.value, "category")}
              >
                <option value="" disabled>Select a Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* ... error display ... */}
          </div>
                <Accordion.Item eventKey="1" className="mt-0">
                  <Accordion.Header>Item Details</Accordion.Header>
                  <Accordion.Body>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Item Name
                          </label>
                          <div className="password position-relative">
                            <input
                              type="text"
                              name="itemname"
                              className="form-control"
                              placeholder="Item Name"
                              value={formdata?.itemname}
                              onChange={(e) =>
                                handleChange(e.target.value, "itemname")
                              }
                            />
                          </div>
                          {errors?.itemname && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.itemname}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Item Information
                          </label>
                          <ReactQuill
                            name="answer"
                            className="form_control"
                            value={formdata?.iteminfo}
                            modules={modules}
                            placeholder="Enter Your item information"
                            onChange={(value) =>
                              handleChange(value, "iteminfo")
                            }
                          />
                          {/* <div className="password position-relative">
                                                        <textarea
                                                            name="iteminfo"
                                                            cols="4"
                                                            rows="4"
                                                            class="form-control b-0 text-area-height"
                                                            placeholder="Enter Your item information"
                                                            style={{ height: '100px' }}
                                                            value={formdata?.iteminfo}
                                                            onChange={handleChange}
                                                        ></textarea>
                                                    </div> */}
                          {errors?.iteminfo && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.iteminfo}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="row">
                        {/* <div className="col-md-3">
                                                    {isDoug ?
                                                        <button className="btn common-button back-btn" type="button" onClick={() => setIsDoug(!isDoug)}>Remove Bud’s Take</button>
                                                        :
                                                        <button className="btn common-button" type="button" onClick={() => setIsDoug(!isDoug)}>Add Bud’s Take +</button>
                                                    }
                                                </div> */}
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            {/* Bud’s Take */}
                            Brandon’s Bit
                          </label>
                          <ReactQuill
                            name="answer"
                            className="form_control"
                            value={optionalData?.doug_take}
                            modules={modules}
                            placeholder="Enter Your text"
                            onChange={(value) => handleText(value)}
                          />
                          {/* <div className="password position-relative">
                                                        <textarea
                                                            name="doug_take"
                                                            cols="4"
                                                            rows="4"
                                                            class="form-control b-0 text-area-height"
                                                            placeholder="Enter Your text"
                                                            style={{ height: '100px' }}
                                                            value={optionalData?.doug_take}
                                                            onChange={(e) => handleText(e.target.value)}
                                                        ></textarea>
                                                    </div> */}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-1 col-lg-1">
                        <label className="text-dark fw-600 mb-1">
                          Featured
                        </label>
                        <label className="switch m-0">
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckDefault"
                              checked={isFeatured}
                              onChange={handleFeatured}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12 mb-2">
                          <label className="text-dark fw-600 mb-2">
                            Rarity
                          </label>
                          <div className="password position-relative">
                            <ReactQuill
                              name="answer"
                              className="form_control"
                              value={formdata?.versiontype}
                              modules={modules}
                              placeholder="Enter Your rarity"
                              onChange={(value) =>
                                handleChange(value, "versiontype")
                              }
                            />
                            {/* <textarea
                                                            name="versiontype"
                                                            cols="4"
                                                            rows="4"
                                                            class="form-control b-0 text-area-height"
                                                            placeholder="Enter Your rarity"
                                                            style={{ height: '100px' }}
                                                            value={formdata?.versiontype}
                                                            onChange={(e) => handleChange(e.target.value, 'versiontype')}
                                                        ></textarea> */}
                            {/* <select name="versiontype" type="select" className="form-control" value={formdata?.versiontype} onChange={(e) => handleChange(e.target.value, "versiontype")}>
                                                            <option value='' disabled>Select</option>
                                                            {versiontypes?.map((item, index) => (
                                                                <option key={index} value={item?.label}>{item?.name}</option>
                                                            ))}
                                                        </select> */}
                          </div>
                          {errors?.versiontype && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.versiontype}
                            </p>
                          )}
                        </div>
                        <div className="col-md-4 col-lg-4">
                          <label className="text-dark fw-600 mb-2">
                            Condition
                          </label>
                          <div className="password position-relative">
                            <select
                              name="condition"
                              type="select"
                              className="form-control"
                              style={{ appearance: "menulist" }}
                              value={formdata?.condition}
                              onChange={(e) =>
                                handleChange(e.target.value, "condition")
                              }
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
                          {errors?.condition && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.condition}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Known Flaws{" "}
                          </label>
                          <ReactQuill
                            name="answer"
                            className="form_control"
                            value={formdata?.knowsflaws}
                            modules={modules}
                            placeholder="Enter Your flaws"
                            onChange={(value) =>
                              handleChange(value, "knowsflaws")
                            }
                          />
                          {/* <div className="password position-relative">
                                                        <textarea
                                                            name="knowsflaws"
                                                            cols="4"
                                                            rows="4"
                                                            class="form-control b-0 text-area-height"
                                                            placeholder="Enter Your flaws"
                                                            style={{ height: '100px' }}
                                                            value={formdata?.knowsflaws}
                                                            onChange={(e) => handleChange(e.target.value, "knowsflaws")}
                                                        ></textarea>
                                                    </div> */}
                          {errors?.knowsflaws && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.knowsflaws}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                 
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Highlights{" "}
                          </label>
                          <ReactQuill
                            name="answer"
                            className="form_control"
                            value={formdata?.higlights}
                            modules={modules}
                            placeholder="Enter Your highlight info"
                            onChange={(value) =>
                              handleChange(value, "higlights")
                            }
                          />
                          {errors?.higlights && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.higlights}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Modifications Info{" "}
                          </label>
                          <ReactQuill
                            name="answer"
                            className="form_control"
                            value={formdata?.modificationinfo}
                            modules={modules}
                            placeholder="Enter Your modifications info"
                            onChange={(value) =>
                              handleChange(value, "modificationinfo")
                            }
                          />
                          {/* <div className="password position-relative">
                                                        <textarea
                                                            name="modificationinfo"
                                                            cols="4"
                                                            rows="4"
                                                            class="form-control b-0 text-area-height"
                                                            placeholder="Enter Your modifications info"
                                                            style={{ height: '100px' }}
                                                            value={formdata?.modificationinfo}
                                                            onChange={(e) => handleChange(e.target.value, "modificationinfo")}
                                                        ></textarea>
                                                    </div> */}
                          {errors?.modificationinfo && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.modificationinfo}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Service History{" "}
                          </label>
                          <ReactQuill
                            name="answer"
                            className="form_control"
                            value={formdata?.servicehistory}
                            modules={modules}
                            placeholder="Enter Your Service History"
                            onChange={(value) =>
                              handleChange(value, "servicehistory")
                            }
                          />
                          {/* <div className="password position-relative">
                                                        <textarea
                                                            name="servicehistory"
                                                            cols="4"
                                                            rows="4"
                                                            class="form-control b-0 text-area-height"
                                                            placeholder="Enter Your Service History"
                                                            style={{ height: '100px' }}
                                                            value={formdata?.servicehistory}
                                                            onChange={(e) => handleChange(e.target.value, "servicehistory")}
                                                        ></textarea>
                                                    </div> */}
                          {errors?.servicehistory && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.servicehistory}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="mb-3">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <label className="text-dark fw-600 mb-2">
                              Postal Code
                            </label>
                            <div className="password position-relative">
                              <input
                                type="text"
                                name="zipcode"
                                className="form-control"
                                placeholder="zipcode"
                                value={zipCode}
                                onChange={(e) =>
                                  handleLocation(e.target.value, "zipcode")
                                }
                                onInput={(e) =>
                                  handleLocation(e.target.value, "zipcode")
                                }
                                onKeyPress={(event) => {
                                  if (
                                    !/^\d+$/.test(event.key) &&
                                    event.key !== "Backspace"
                                  ) {
                                    event.preventDefault();
                                  }
                                }}
                              />
                            </div>
                            {errors?.zipcode && (
                              <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                                {errors?.zipcode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Seller Notes{" "}
                          </label>
                          <ReactQuill
                            name="answer"
                            className="form_control"
                            value={formdata?.sellernotes}
                            modules={modules}
                            placeholder="Enter Your Seller Notes"
                            onChange={(value) =>
                              handleChange(value, "sellernotes")
                            }
                          />
                          {/* <div className="password position-relative">
                                                        <textarea
                                                            name="sellernotes"
                                                            cols="4"
                                                            rows="4"
                                                            class="form-control b-0 text-area-height"
                                                            placeholder="Enter Your Seller Notes"
                                                            style={{ height: '100px' }}
                                                            value={formdata?.sellernotes}
                                                            onChange={(e) => handleChange(e.target.value, "sellernotes")}
                                                        ></textarea>
                                                    </div> */}
                          {errors?.sellernotes && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.sellernotes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-3 col-lg-3">
                          <label className="text-dark fw-600 mb-2">
                            Reserve Price
                          </label>
                          <div className="password position-relative d-flex gap-2 align-items-center">
                            <div className="check_list">
                              <input
                                type="checkbox"
                                id="reserved_price"
                                style={{ width: "20px", height: "20px" }}
                                onChange={handleReserve}
                                checked={isReserve}
                                disabled={edititem?.admin_approval === true}
                              />
                              <label for="reserved_price"></label>
                            </div>
                            <span
                              style={{ fontSize: "24px", paddingTop: "10px" }}
                            >
                              <i class="bi bi-currency-dollar fw-bold"></i>
                            </span>
                            <input
                              type="text"
                              name="reserveprice"
                              className="form-control"
                              placeholder=""
                              value={formdata?.reserveprice}
                              onChange={(e) =>
                                handleChange(e.target.value, "reserveprice")
                              }
                              disabled={
                                !isReserve || edititem?.admin_approval === true
                              }
                            />
                          </div>
                          {isReserve === true && errors?.reserveprice && (
                            <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                              {errors?.reserveprice}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-3 col-lg-3">
                          <label className="text-dark fw-600 mb-2">
                            Shipping Method:
                          </label>
                          <div className="password position-relative">
                            <select
                              name="condition"
                              type="select"
                              className="form-control"
                              value={formdata?.shipmentType}
                              onChange={(e) =>
                                handleChange(e.target.value, "shipmentType")
                              }
                              style={{ appearance: "menulist" }}
                            >
                              <option value="" disabled>
                                Select
                              </option>
                              {shipping?.map((item, index) => (
                                <option key={index} value={item?.value}>
                                  {item?.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {errors?.shipmentType && (
                            <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                              {errors?.shipmentType}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 mb-3">
                    <div className="card" style={{ padding: "2px" }}> 
                      <div
                        className="card-header bg-light d-flex justify-content-between align-items-center"
                        style={isExtraInfoOpen ? {} : { borderBottom: "none" }}
                      >
                        <FormLabel className="text-dark fw-600 mb-0">
                          Add Tags and Attributes | {selectedTags.length} tags selected | {attributes.length} attributes selected
                        </FormLabel>
                        

                        <Button
                          onClick={() => setIsExtraInfoOpen(!isExtraInfoOpen)}
                          aria-controls="extra-info-collapse"
                          aria-expanded={isExtraInfoOpen}
                          variant="link"
                          className="text-decoration-none text-dark fw-600"
                        >
                          {isExtraInfoOpen ? (
                            <span className="btn fw-600" style={{backgroundColor: 'white', border: '1px solid black',}}>hide</span>
                          ) : (
                            <span className="btn fw-600" style={{backgroundColor: 'white', border: '1px solid black',}}>Edit Attributes and tags</span>
                          )}
                        </Button>
                      </div>
                      <Collapse in={isExtraInfoOpen}>
                        <div id="extra-info-collapse" style={{ padding: 7 }}>
                          <div className="card-body">
                            <AttributeSelector
                              selectedAttributes={attributes}
                              onAttributesChange={setAttributes}
                            />
                            <TagSelector
                              selectedTags={selectedTags}
                              onTagsChange={setSelectedTags}
                            />
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  </div>

                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2" className="mt-4">
                  <Accordion.Header>Media Data</Accordion.Header>
                  <Accordion.Body>
                    <div className="mb-4">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-0">Image</label>
                          <input
                            className="d-none"
                            type="file"
                            name="mediaimage"
                            accept=".png, .jpg, .jpeg, .gif"
                            ref={imageref}
                            onChange={handleFiles}
                            multiple
                          />
                          <button
                            type="button"
                            className="p-0 bg-transparent border-0 ms-3"
                            onClick={handleImage}
                          >
                            {" "}
                            <i class="fa-solid fa-upload"></i>
                          </button>
                          {isUpload === true && (
                            <span className="d-block">
                              <ThreeDot
                                color="#FAB406"
                                size="small"
                                text="Uploading"
                                textColor="#FAB406"
                              />
                            </span>
                          )}
                        
                        <div className="pt-4">
    <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="imagegallaries">
            {(provided) => (
                <table
                    className="table table-hover user-management-table"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    <thead className="border-gray">
                        <th>Order No.</th>
                        <th>Thumbnail</th>
                        <th>Image Link</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {/* CHANGE 1: Map over 'photos' instead of 'imgFile' */}
                        {photos?.length > 0 &&
                            photos?.map((photo, index) => (
                                <Draggable
                                    // CHANGE 2: Use a unique property from the object for keys
                                    key={photo.original}
                                    draggableId={photo.original}
                                    index={index}
                                >
                                    {(provided) => (
                                        <tr
                                            className="cursor-pointer"
                                            key={index}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <td>{index + 1}.</td>
                                            <td>
                                                {/* The 'item' is now 'photo' from the map */}
                                                {photo ? (
                                                    <img
                                                        src={`${photo.thumbnail}`} // CHANGE 3: Use photo.thumbnail for the image
                                                        height={50}
                                                        width={65}
                                                        alt="not found"
                                                        className="object-fit-cover rounded"
                                                    />
                                                ) : (
                                                    <img alt="not found" />
                                                )}
                                            </td>
                                            <td className="cursor-pointer">
                                                <Link
                                                    className="text-decoration-none"
                                                    to={`${photo.original}`} // CHANGE 4: Link to photo.original
                                                    target="_blank"
                                                >
                                                    {`${photo.original}`} {/* Display the original URL */}
                                                </Link>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm rounded-circle"
                                                    onClick={() =>
                                                        handleDeleteImage(photo) // CHANGE 5: Pass the whole photo object
                                                    }
                                                >
                                                    <i className="fa-solid fa-xmark color-white"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </Draggable>
                            ))}
                        {provided.placeholder}
                    </tbody>
                </table>
            )}
        </Droppable>
    </DragDropContext>
</div>
                          {errors.mediaimage && (
                            <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">
                              {errors.mediaimage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* {console.log("draggged images ====>", imgFile)} */}
                    <div className="">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-0">
                            Video (Optional)
                          </label>
                          <input
                            className="d-none"
                            type="file"
                            name="mediavideo"
                            accept="video/*"
                            ref={videoref}
                            onChange={handleFiles}
                            multiple
                          />
                          <button
                            type="button"
                            className="p-0 bg-transparent border-0 ms-3"
                            onClick={handleVideo}
                          >
                            {" "}
                            <i class="fa-solid fa-upload"></i>
                          </button>
                          {isVideo === true && (
                            <span className="d-block">
                              <ThreeDot
                                color="#FAB406"
                                size="small"
                                text="Uploading"
                                textColor="#FAB406"
                              />
                            </span>
                          )}
                          <div className="row mt-3">
                            {videos?.map((item, index) => (
                              <div key={index} className="col-md-3">
                                <div className=" position-relative pb-3">
                                  <video
                                    src={`${item}`}
                                    style={{ height: "100%", width: "100%" }}
                                    controls
                                  />
                                  <div className="position-absolute upload-file-close">
                                    <button
                                      type="button"
                                      className="btn btn-sm rounded-circle"
                                      onClick={() => handleDeleteVideo(item)}
                                    >
                                      <i class="fa-solid fa-xmark color-white"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* {videoFile?.length === 0 &&
                                                        <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">Video is required</p>
                                                    } */}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12 col-lg-12">
                          <label className="text-dark fw-600 mb-2">
                            Notes (Optional)
                          </label>
                          <ReactQuill
                            name="answer"
                            className="form_control"
                            value={formdata?.notes}
                            modules={modules}
                            placeholder="Enter Your Notes"
                            onChange={(value) => handleChange(value, "notes")}
                          />
                          {/* <div className="password position-relative">
                                                        <textarea
                                                            name="notes"
                                                            cols="4"
                                                            rows="4"
                                                            class="form-control b-0 text-area-height"
                                                            placeholder="Enter Your Notes"
                                                            style={{ height: '100px' }}
                                                            value={formdata?.notes}
                                                            onChange={(e) => handleChange(e.target.value, 'notes')}
                                                        ></textarea>
                                                    </div> */}
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <div className="mt-4">
                  <h4 className="text-black mb-3 fw-600">Bid Timing</h4>
                  <div className="mb-3">
                    <div className="row">
                      <div className="col-md-4 col-lg-4">
                        <div className="password position-relative">
                          <label className="text-dark fw-600 mb-2">
                            Start Date
                          </label>
                          <input
                            type="datetime-local"
                            name="bidstart"
                            className="form-control"
                            value={formdata?.bidstart}
                            min={getMinDate()}
                            onChange={handleDateChange}
                            disabled={edititem?.admin_approval === true}
                          />
                        </div>
                        {errors?.bidstart && (
                          <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                            {errors?.bidstart}
                          </p>
                        )}
                      </div>
                      <div className="col-md-4 col-lg-4">
                        <div className="password position-relative">
                          <label className="text-dark fw-600 mb-2">
                            End Date
                          </label>
                          <input
                            type="datetime-local"
                            name="bidend"
                            className="form-control"
                            value={formdata?.bidend}
                            min={getMinEndDate(formdata?.bidstart)}
                            onChange={handleDateChange}
                            disabled={edititem?.admin_approval === true}
                          />
                        </div>
                        {errors?.bidend && (
                          <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                            {errors?.bidend}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-12">
                  <div className="d-flex gap-3 pt-4">
                    <button
                      className="btn common-button"
                      type="submit"
                      disabled={isSubmit || isUpload || isVideo}
                    >
                      Save Changes
                    </button>
                    <button
                      className="btn common-button back-btn"
                      onClick={() => navigate("/item-listing")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Accordion>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    categories: state.user.categoriesList,
  };
};

export default connect(mapStateToProps)(EditListItem);

