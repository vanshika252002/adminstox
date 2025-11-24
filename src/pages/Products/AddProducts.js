import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import {
  add_item,
  upload_multiple_image,
  edit_product,
  get_product_Detail,
  get_category,
  get_brand_name,
} from "../../reduxData/user/userAction";
import { useSelector } from "react-redux";
import { FORMAT_SECONDS_NO_LEADING_ZEROS } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import { initialValues, schema } from "./utils";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const AddProducts = ({ type }) => {
  const token = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const categoriesId = useSelector((state) => state.user.categoriesList);
  const [editData, setEditData] = useState("");
  const { id } = useParams();
  const [brands, setBrand] = useState([]);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: initialValues(type, editData),
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      console.log("values of formic", values);
      if (type == "edit") {
        const res = await edit_product(token, values, id, navigate);
      } else {
        const res = await add_item(token, values);
        if (res) {
          resetForm();
        }
        navigate("/products");
      }
    },
  });

  const handleImageUpload = async (e) => {
    console.log("files", e.target.files);
    const files = e.target.files;
    if (!files || files.length == 0) return;

    const len = e.target.files.length;
    const formData = new FormData();
    for (const i of files) {
      formData.append("images", i);
    }
    try {
      const res = await upload_multiple_image(
        formData,
        localStorage.getItem("token")
      );
      console.log("resposne of the images api", res?.data?.data);
      formik.setFieldValue("images", res?.data?.data);
    } catch (error) {}
  };

  const handleEditProduct = async (id) => {};

  useEffect(() => {
    console.log("categories id are", categoriesId);
  }, [categoriesId]);

  useEffect(() => {
    if (type == "edit") {
      const fetchData = async () => {
        try {
          const res = await get_product_Detail(token, id);
          if (res) {
            console.log("data of edited product ", res?.data);
            setEditData(res?.data);
          }
        } catch (error) {
          // toast.error("Failed")
        }
      };
      fetchData();
    }
  }, [type]);

  useEffect(() => {
    const fetchCategories = async () => {
      await get_category(dispatch, token);
    };
    fetchCategories();
  }, []);

  const getBrands = async () => {
    try {
      const res = await get_brand_name(token);
      if (res?.data) {
        setBrand(res?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getBrands();
  }, []);

  return (
    <form className="container profile-deatils" onSubmit={formik.handleSubmit}>
      <h3 className="mt-3 mb-1 fw-600">
        {type == "edit" ? "Edit Product" : "Add Product"}
      </h3>

      <div className="row">
        {/* Title */}
        <div className="mb-3 col-md-6">
          <label htmlFor="title">Title</label>
          <input
            className="form-control"
            name="title"
            id="title"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
          {formik.errors.title && (
            <p className="text-danger">{formik.errors.title}</p>
          )}
        </div>

        {/* Article Number */}
        <div className="mb-3 col-md-6">
          <label htmlFor="article_number">Article Number</label>
          <input
            className="form-control"
            name="article_number"
            id="article_number"
            value={formik.values.article_number}
            onChange={formik.handleChange}
          />
          {formik.errors.article_number && (
            <p className="text-danger">{formik.errors.article_number}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-3 col-md-6">
          <label htmlFor="description">Description</label>
          <input
            className="form-control"
            name="description"
            id="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
          {formik.errors.description && (
            <p className="text-danger">{formik.errors.description}</p>
          )}
        </div>

        {/* Brand Name */}
        <div className="mb-3 col-md-6">
          <label htmlFor="brand_id">Brand Name</label>
          <select
            name="brand_id"
            id="brand_id"
            value={formik.values.brand_id}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          >
            <option value={""}>Select Brand</option>
            {brands?.map((i) => (
              <option value={i.id}>{i.brand_name}</option>
            ))}
          </select>

          {formik.errors.brand_id && (
            <p className="text-danger">{formik.errors.brand_id}</p>
          )}
        </div>

        {/* Category ID */}
        <div className="mb-3 col-md-6">
          <label htmlFor="category_id">Categories</label>
          <br />
          <select
            name="category_id"
            id="category_id"
            value={formik.values.category_id}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          >
            <option value={""}>Select Category</option>
            {categoriesId?.map((i) => (
              <option value={i.id}>{i.name}</option>
            ))}
          </select>

          {formik.touched.category_id && formik.errors.category_id && (
            <p className="text-danger">{formik.errors.category_id}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-3 col-md-6">
          <label htmlFor="original_retail_price">Price</label>
          <input
            type="number"
            className="form-control"
            name="original_retail_price"
            id="original_retail_price"
            value={formik.values.original_retail_price}
            onChange={formik.handleChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {formik.errors.original_retail_price && (
            <p className="text-danger">{formik.errors.original_retail_price}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-3 col-md-6">
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            className="form-control"
            id="images"
            accept="image/*"
            multiple
            min="0"
            onChange={handleImageUpload}
          />
          {uploading && <p className="text-info">Uploading...</p>}
          {formik.errors.images && (
            <p className="text-danger">{formik.errors.images}</p>
          )}

          {/* Preview Uploaded Images */}
          <div className="mt-2 d-flex flex-wrap gap-2">
            {/* {formik.values.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Uploaded"
                width={80}
                height={80}
                className="rounded border"
              />
            ))} */}
          </div>
        </div>

        {/* Submit Button */}
        <div className="d-flex gap-3 mb-3 col-md-12">
          <button
            className="btn common-button"
            type="submit"
            disabled={uploading}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProducts;
