import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Stack,
  Grid,
  IconButton,
} from "@mui/joy";
import {
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input";
import PhoneNo from "../../Shared/PhoneNo";
import dayjs from "dayjs";
import moment from "moment";
import { Select, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  DESIGNATION,
  get_staff,
  manage_staff,
  upload_image,
} from "../../reduxData/user/userAction";
import DefaultImg from "../../images/no_profile.png";
import { GET_SINGLE_STAFF } from "../../reduxData/user/userTypes";
import { useSelector } from "react-redux";
const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const AddEditStaff = () => {
  const allkeys = [
    "p_categories",
    "p_users",
    "p_auctions",
    "p_bid_manage",
    "p_reports",
    "p_badge_system",
    "p_staff",
    "p_cms",
    "p_disputes",
    "p_notify_user",
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { singleStaff } = useSelector((state) => state.user);
  const maxDate = moment().format("YYYY-MM-DD");
  const [country, setCountry] = useState("US");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [imgPreview, setimgPreview] = useState("");
  const imageRef = useRef();
  const [showPassword, setShowPassword] = useState(false);

  // **Validation Schema**
  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(/^\d+$/, "Phone number must be numeric")
      .min(10, "Must be at least 10 digits"),
    dob: yup
      .date()
      .required("Date of birth is required")
      .test("is-18+", "You must be at least 18 years old", (value) => {
        if (!value) return false;
        return dayjs().diff(dayjs(value), "year") >= 18;
      }),
    designation: yup.string().required("Designation is required"),
    password: !id
      ? yup.string().min(6, "Password must be at least 6 characters").nullable()
      : yup
          .string()
          .required("Password is required")
          .min(6, "Password must be at least 6 characters"),
    permissions: "",
    isDeactive: "",
  });

  const defaultValues = {
    name: null,
    email: null,
    phoneNumber: null,
    dob: null,
    birth_date: null,
    password: null,
    designation: null,
    permissions: null,
    isDeactive: false,
  };

  const STATUS_OPTIONS = [
    { label: "Active", value: false },
    { label: "Inactive", value: true },
  ];
  const DEFAULT_VALUES = {
    p_categories: 0,
    p_users: 0,
    p_auctions: 0,
    p_bid_manage: 0,
    p_reports: 0,
    p_badge_system: 0,
    p_staff: 0,
    p_cms: 0,
    p_disputes: 0,
    p_flags: 0,
    p_notify_user: 0,
  };
  const [employee, setEmployee] = useState(DEFAULT_VALUES);
  const [stateVal, setStateVal] = useState({
    p_categories: 1,
    p_users: 1,
    p_auctions: 1,
    p_bid_manage: 1,
    p_reports: 1,
    p_badge_system: 1,
    p_staff: 1,
    p_cms: 1,
    p_disputes: 1,
    p_flags: 1,
    p_notify_user: 1,
  });
  const [isImgEdit, setIsImgEdit] = useState(false);
  const [removePhotos, setRemovePhotos] = useState([]);

  const _PERMISSIONS = [
    {
      title: "Categories",
      name: "p_categories",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
    },
    {
      title: "Users",
      name: "p_users",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
    },
    {
      title: "Auctions",
      name: "p_auctions",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
      subPermissions: [
        // {
        //     title: 'cogs',
        //     name: 'p_products_cogs',
        //     value: false,
        //     permission: [
        //         { title: 'read', name: 1, value: true },
        //         { title: 'read_write', name: 2, value: false },
        //         { title: 'full', name: 3, value: false }
        //     ],
        // }
      ],
    },
    {
      title: "Bids Management",
      name: "p_bid_manage",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
      subPermissions: [],
    },
    {
      title: "Disputes",
      name: "p_disputes",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
      subPermissions: [],
    },
    {
      title: "Flag Comments",
      name: "p_flags",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
      subPermissions: [],
    },
    {
      title: "Reports",
      name: "p_reports",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
      subPermissions: [],
    },
    {
      title: "Badge System",
      name: "p_badge_system",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
      subPermissions: [],
    },
    {
      title: "CMS Management",
      name: "p_cms",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
      subPermissions: [],
    },
    {
      title: "Notification Management",
      name: "p_notify_user",
      value: false,
      permission: [
        { title: "read", name: 1, value: true },
        { title: "read_write", name: 2, value: false },
        { title: "full", name: 3, value: false },
      ],
      subPermissions: [],
    },
  ];
  const [permissions, setPermissions] = useState(_PERMISSIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });
  useEffect(() => {
    if (id) {
      get_staff(localStorage.getItem("token"), dispatch, id);
    }
    return () => {
      dispatch({ type: GET_SINGLE_STAFF, payload: null });
    };
  }, [id, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (id && singleStaff) {
      reset({
        name: singleStaff?.name,
        email: singleStaff?.email,
        phoneNumber: singleStaff?.phoneNumber,
        dob: singleStaff?.dob,
        designation: singleStaff?.designation,
        isDeactive: singleStaff?.isDeactive,
      });
      const permisns = {
        p_categories: singleStaff?.permission?.p_categories || 0,
        p_users: singleStaff?.permission?.p_users || 0,
        p_auctions: singleStaff?.permission?.p_auctions || 0,
        p_bid_manage: singleStaff?.permission?.p_bid_manage || 0,
        p_reports: singleStaff?.permission?.p_reports || 0,
        p_badge_system: singleStaff?.permission?.p_badge_system || 0,
        p_staff: singleStaff?.permission?.p_staff || 0,
        p_cms: singleStaff?.permission?.p_cms || 0,
        p_disputes: singleStaff?.permission?.p_disputes || 0,
        p_flags: singleStaff?.permission?.p_flags || 0,
        profile_pic: singleStaff?.profile_pic || 0,
        p_notify_user: singleStaff?.permission?.p_notify_user || 0,
        phoneNumber: singleStaff?.phoneNumber || 0,
      };
      setEmployee({ ...permisns });
      setRemovePhotos((prev) => [...prev, singleStaff?.profile_pic]);
      // Object.keys({...permisns}).forEach(key => {
      //     if (key.includes('p_')) {
      //         let Obj = permissions.find(perm => perm.name === key)
      //         if (Obj) {
      //             const idx = permissions.findIndex(perm => perm.name === Obj.name)
      //             if (permisns[key] === 0) {
      //                 Obj.value = false
      //             } else if (permisns[key] !== 0) {
      //                 Obj.value = true
      //             }
      //             const __permission = [...permissions]
      //             __permission.splice(idx, 1, Obj);
      //             setPermissions(__permission);
      //         } else {
      //             Obj = permissions.find(perm => key.includes(perm.name));
      //             if (Obj) {
      //                 const idx = permissions.findIndex(perm => perm.name === Obj.name);
      //                 Obj = permissions[idx].subPermissions.find(perm => perm.name === key);
      //                 const sidx = permissions[idx].subPermissions.findIndex(perm => perm.name === Obj.name);
      //                 if (permisns[key] === 0) {
      //                     Obj.value = false
      //                 } else if (permisns[key] !== 0) {
      //                     Obj.value = true
      //                 }
      //                 const __permission = [...permissions]
      //                 __permission[idx].subPermissions.splice(sidx, 1, Obj);
      //                 setPermissions(__permission);
      //             }
      //         }

      //     }
      // })
      const updatedPermissions = permissions.map((item) => {
        const newValue = permisns[item.name];
        if (newValue !== undefined) {
          return {
            ...item,
            value: newValue > 0 ? true : false,
            permission: item.permission.map((perm) => ({
              ...perm,
              value: perm.name === newValue,
            })),
          };
        }
        return item;
      });
      setPermissions(updatedPermissions);

      setCountry(singleStaff?.country_code ? singleStaff?.country_code : "US");
    }
  }, [id, singleStaff, reset]);

  //console.log("single staff ===>", singleStaff);
  //console.log("permisssionsss ====>", permissions);

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
      setEmployee({
        ...employee,
        profile_pic: res?.path[0],
      });
      setimgPreview(URL.createObjectURL(e.target.files[0]));
      setIsImgEdit(true);
    }
  };

  const handlePermissionVal = (permName, selectedValue) => {
    const _employee = { ...employee };
    const updatedPermissions = permissions.map((permission) => {
      if (permission.name === permName) {
        return {
          ...permission,
          permission: permission.permission.map((perm) => ({
            ...perm,
            value: perm.name === selectedValue,
          })),
        };
      }
      return permission;
    });

    setPermissions(updatedPermissions);
    _employee[permName] = selectedValue;
    setEmployee(_employee);
  };

  //   const onChange = (event, dateVal) => {
  //     const key = event.target.name;
  //     const value = event.target.value;
  //     //console.log(key, value);
  //     let _employee = {}
  //     if (
  //         allkeys.includes(key)
  //     ) {
  //        [...permissions].forEach((MODS, Idx) => {
  //           if (MODS.name === key) {
  //              if (MODS.permission[0].value === false &&
  //                 MODS.permission[1].value === false &&
  //                 MODS.permission[2].value === false) {
  //                 setError('permission', { type: 'required', message: "Permission is required" });
  //              }
  //              if (MODS.permission[0].value === true ||
  //                 MODS.permission[1].value === true ||
  //                 MODS.permission[2].value === true) {
  //                 clearErrors('permission')
  //                 _employee = { ...employee }
  //                 _employee[key] = +value
  //                 setEmployee(_employee)
  //              }
  //           }
  //        })
  //     }
  //  };

  const onChangeSub = (event, idx) => {
    const key = event.target.name;
    const value = event.target.value;
    let _employee = {};
    if (allkeys.includes(key)) {
      [...permissions[idx].subPermissions].forEach((MODS, Idx) => {
        if (key !== "p_customers_feilds" && MODS.name === key) {
          if (
            MODS.permission[0].value === false &&
            MODS.permission[1].value === false &&
            MODS.permission[2].value === false
          ) {
            setError("permission", {
              type: "required",
              message: "Permission is required",
            });
          }
          if (
            MODS.permission[0].value === true ||
            MODS.permission[1].value === true ||
            MODS.permission[2].value === true
          ) {
            clearErrors("permission");
            _employee = { ...employee };
            _employee[key] = +value;
            setEmployee(_employee);
          }
        }
      });
    }
  };

  // ON PERMISSION CHANGE
  const onPermissionChange = (event) => {
    const name = event?.target?.name;
    const value = event?.target?.checked;

    let _perm = [...permissions];
    let _employee = { ...employee };
    const index = _perm.findIndex((res) => res.name === name);
    if (index >= 0) {
      _perm[index].value = value;
      setPermissions(_perm);
      if (value === true) {
        clearErrors("permission");
        if (stateVal[name] !== 0) {
          _employee[name] = stateVal[name];
        } else {
          _employee[name] = 1;
        }
        setEmployee(_employee);
      } else if (value === false) {
        let _stateVal = { ...stateVal };
        _stateVal[name] = employee[name];
        setStateVal(_stateVal);
        _employee[name] = 0;
        setEmployee(_employee);
      }
    }
    _perm.forEach((perm) => {
      const _name = perm.name;
      const _value = perm.value;
      if (_name === name && _value === false) {
        setError("moduleRequired", {
          type: "required",
          message: "Select atleast one module.",
        });
      } else {
        clearErrors("moduleRequired");
      }
    });
  };

  const onSubPermissionChange = (event, idx) => {
    const name = event?.target?.name;
    const value = event?.target?.checked;
    const _perm = [...permissions];
    const _employee = { ...employee };
    const index = _perm[idx].subPermissions.findIndex(
      (res) => res.name === name
    );
    if (index >= 0) {
      _perm[idx].subPermissions[index].value = value;
      if (value === true) {
        clearErrors("permission");
        if (stateVal[name] !== 0) {
          _employee[name] = stateVal[name];
        } else {
          _employee[name] = 1;
        }
        setEmployee(_employee);
      } else if (value === false) {
        let _stateVal = { ...stateVal };
        _stateVal[name] = employee[name];
        setStateVal(_stateVal);
        _employee[name] = 0;
        setEmployee(_employee);
      }
      setPermissions(_perm);
    }
  };
  const handlePhone = (value, fieldName) => {
    switch (fieldName) {
      case "phone_number":
        let countrycode = getCountryCallingCode(country);
        let checkvalue = `+${countrycode}` + value;
        if (value === "" || !isValidPhoneNumber(checkvalue)) {
          setError("phoneNumber", {
            message:
              value === ""
                ? "Phone number is required"
                : !isValidPhoneNumber(checkvalue)
                ? "Invalid phone number"
                : null,
          });
        } else {
          clearErrors("phoneNumber");
        }
        setValue("phoneNumber", value);
        setEmployee({ ...employee, phoneNumber: value });
        break;
      default:
        break;
    }
  };
  const noPermit = (object) => {
    let newArr = [];
    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const element = object[key];
        newArr.push(element);
      }
    }
    const val = newArr.find((val) => val !== 0);

    return val > 0 ? true : false;
  };
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const _permission = {};
    for (const key in employee) {
      if (Object.hasOwnProperty.call(employee, key)) {
        if (key.includes("p_")) {
          _permission[key] = employee[key];
        }
        if (key === "permission") {
          if (Object.keys(employee.permission).length === 0) {
            setIsSubmitting(false);
            setError("permission", {
              type: "required",
              message: "Permission is required",
            });
          }
        }
      }
    }
    if (
      Object.keys(_permission).length === 0 ||
      noPermit(_permission) === false
    ) {
      setIsSubmitting(false);
      setError("permission", {
        type: "required",
        message: "Permission is required",
      });
    }
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    } else {
      const finalDataToSend = {
        ...data,
        user_name: data?.name,
        birth_date: moment(data?.dob).format("DD MMMM YYYY"),
        profile_pic: employee?.profile_pic,
        permission: {
          ..._permission,
        },
      };
      if (singleStaff) {
        finalDataToSend.removePhotos =
          isImgEdit === true && removePhotos?.length > 0 ? removePhotos : [];
        finalDataToSend.password = data?.password;
      }
      setIsSubmitting(false);
      let res = await manage_staff(
        localStorage.getItem("token"),
        finalDataToSend,
        id,
        dispatch
      );
      if (res) {
        navigate("/staff");
      }
    }
  };

  return (
    <div className="container profile-deatils">
      <h3 className="mb-0 fw-600 mt-3">{id ? "Edit" : "Add"} Staff</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
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
              style={{
                width: 70,
                height: 70,
                borderRadius: 75,
                border: "1px solid grey",
              }}
              className="object-fit-cover"
              alt=""
            />
          ) : (
            <img
              src={
                employee?.profile_pic ? `${employee?.profile_pic}` : DefaultImg
              }
              style={{ width: 70, height: 70, borderRadius: 75 }}
              className="object-fit-cover "
              alt=""
            />
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              imageRef.current.click();
            }}
            className="btn common-button back-btn ms-3"
          >
            {id ? "Change " : "Upload "} Image
          </button>
        </div>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <FormControl error={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Enter name" fullWidth {...field} />
                  )}
                />
                {errors.name && (
                  <FormHelperText>{errors.name.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl error={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Enter email" fullWidth {...field} />
                  )}
                />
                {errors.email && (
                  <FormHelperText>{errors.email.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl error={!!errors.phoneNumber}>
                <FormLabel>Phone Number</FormLabel>
                <PhoneNo
                  sellItem={employee?.phoneNumber}
                  setSellItem={() =>
                    setEmployee({ ...employee, phoneNumber: "" })
                  }
                  handlePhone={handlePhone}
                  country={country}
                  setCountry={(value) => setCountry(value)}
                />
                {errors.phoneNumber && (
                  <FormHelperText>{errors.phoneNumber.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Date of Birth */}
            <Grid xs={12} sm={6}>
              <FormControl error={!!errors.dob}>
                <FormLabel>Date of Birth</FormLabel>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      name="dob"
                      className="form-control"
                      value={
                        field.value
                          ? dayjs(field.value).format("YYYY-MM-DD")
                          : ""
                      }
                      max={maxDate}
                      onChange={(e) => {
                        const selectedDate = e.target.value
                          ? dayjs(e.target.value).toDate()
                          : null;
                        const today = new Date();
                        const minAgeDate = new Date();
                        minAgeDate.setFullYear(today.getFullYear() - 18);

                        setValue("dob", selectedDate);
                        setValue(
                          "birth_date",
                          selectedDate
                            ? dayjs(selectedDate).format("DD MMMM YYYY")
                            : ""
                        );
                        setError("dob", {
                          type: "required",
                          message: !selectedDate
                            ? "Date of birth is required"
                            : selectedDate > minAgeDate
                            ? "You must be at least 18 years old"
                            : "",
                        });
                      }}
                    />
                  )}
                />
                {errors.dob && (
                  <FormHelperText>{errors.dob.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Designation */}
            <Grid xs={12} sm={6}>
              <FormControl error={!!errors.designation}>
                <FormLabel>Designation</FormLabel>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <Select
                      className="form-control"
                      placeholder="Select Designation"
                      {...field}
                      displayEmpty
                    >
                      <MenuItem value={null} disabled>
                        Select Designation
                      </MenuItem>
                      {DESIGNATION.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.designation && (
                  <FormHelperText>{errors.designation.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.isDeactive}>
                <FormLabel>Status</FormLabel>
                <Controller
                  name="isDeactive"
                  control={control}
                  render={({ field }) => (
                    <Select className="form-control" {...field} displayEmpty>
                      <MenuItem value={null} disabled>
                        Select Status
                      </MenuItem>
                      {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.isDeactive && (
                  <FormHelperText>{errors.isDeactive.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {id && (
              <Grid xs={12} sm={6}>
                <FormControl error={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => {
                      // const [showPassword, setShowPassword] = useState(false);

                      return (
                        <div style={{ position: "relative" }}>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            fullWidth
                            {...field}
                          />
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          >
                            {showPassword ? (
                              <i
                                className="fas fa-eye-slash"
                                style={{ color: "grey" }}
                                weight="bold"
                              />
                            ) : (
                              <i
                                className="fas fa-eye"
                                style={{ color: "grey" }}
                                weight="bold"
                              />
                            )}
                          </IconButton>
                        </div>
                      );
                    }}
                  />
                  {errors.password && (
                    <FormHelperText>{errors.password.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}
          </Grid>
          <hr style={{ margin: "16px 0", padding: "0" }} />

          <div className="row mb-0">
            <div className="col-sm-6 mb-3">
              <div className="dropdown-check me-1">
                <label htmlFor="dropdownMenuButton1">Permissions</label>
                <div className="dropdown dropup" ref={dropdownRef}>
                  <button
                    className="btn dropdown-toggle w-100"
                    style={{ width: "41.2rem" }}
                    type="button"
                    id="dropdownMenuButton1"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                  >
                    <i className="fas fa-user-secret"></i> Permissions
                  </button>
                  <ul
                    className={`dropdown-menu overflow-scroll border border-3 shadow bg-body rounded rounded-3 ${
                      isOpen ? "show" : ""
                    }`}
                    style={{
                      height: "230px",
                      width: "31.2rem",
                      bottom: "100%",
                    }}
                  >
                    {permissions.map((MOD, Index) => {
                      return (
                        <li key={`${MOD} + ${Index}`}>
                          <div className="form-check">
                            <label
                              className="form-check-label"
                              htmlFor="noseearthyhome"
                            >
                              <input
                                type="checkbox"
                                name={MOD.name}
                                checked={MOD.value}
                                onChange={onPermissionChange}
                                className="me-3"
                              />
                              <span className="text-capitalize fw-bold">
                                {MOD.title}
                              </span>
                              <div>
                                {MOD?.permission.map((PERM, idx) => (
                                  <label key={idx} className="mt-3">
                                    <input
                                      type="radio"
                                      onChange={() =>
                                        handlePermissionVal(MOD.name, PERM.name)
                                      }
                                      //onChange={(event) => onChange(event)}
                                      name={MOD.name}
                                      defaultChecked={PERM.value}
                                      checked={PERM.value}
                                      disabled={!MOD.value}
                                      value={PERM.name}
                                    />
                                    <span className="text-capitalize mx-3">
                                      {PERM.title}
                                    </span>
                                  </label>
                                ))}
                              </div>
                              {MOD?.value &&
                                MOD?.subPermissions?.length > 0 && (
                                  <div>
                                    <span className="text-capitalize fw-bold px-3">
                                      Sub Permissions
                                    </span>
                                    {MOD?.subPermissions.map((PERM, ssidx) => (
                                      <div key={ssidx} className="form-check">
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            name={PERM.name}
                                            checked={PERM.value}
                                            onChange={(e) =>
                                              onSubPermissionChange(e, Index)
                                            }
                                            className="me-3"
                                          />
                                          {PERM.name ===
                                          "p_customers_feilds" ? (
                                            <span className="fw-bold">
                                              {PERM.title}
                                            </span>
                                          ) : (
                                            <span className="text-capitalize fw-bold">
                                              {PERM.title}
                                            </span>
                                          )}
                                          <div>
                                            {PERM.permission.map(
                                              (subPerm, sidx) => (
                                                <label
                                                  key={sidx}
                                                  className="mt-3"
                                                >
                                                  <input
                                                    type="radio"
                                                    onChange={(event) =>
                                                      onChangeSub(event, Index)
                                                    }
                                                    name={PERM.name}
                                                    defaultChecked={
                                                      subPerm.value
                                                    }
                                                    disabled={!PERM.value}
                                                    value={PERM.name}
                                                  />
                                                  <span className="text-capitalize mx-3">
                                                    {subPerm.title}
                                                  </span>
                                                </label>
                                              )
                                            )}
                                          </div>
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </label>
                          </div>
                          <hr />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              {errors && errors?.permission && (
                <span className="d-flex flex-start text-danger error-msg">
                  {errors?.permission?.message}
                </span>
              )}
              {errors && errors?.moduleRequired && (
                <span className="d-flex flex-start text-danger error-msg">
                  {errors?.moduleRequired?.message}
                </span>
              )}
            </div>
          </div>
          <div className="d-flex gap-3 mb-3 col-md-12">
            <button
              type="submit"
              className="btn common-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : "Submit"}
            </button>
            <button
              className="btn common-button back-btn"
              onClick={() => navigate("/staff")}
            >
              Cancel
            </button>
          </div>
        </Stack>
      </form>
    </div>
  );
};

export default AddEditStaff;
