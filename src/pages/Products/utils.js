import { setSeconds } from "date-fns";
import { useEffect, useState } from "react";
import { upload_multiple_image } from "../../reduxData/user/userAction";
import * as Yup from "yup";

export const initialValues = (type, data) => {
  return {
    title: type == "edit" ? data?.title : "",
    article_number: type == "edit" ? data?.article_number : "",
    description: type == "edit" ? data?.description : "",
    brand_id: type == "edit" ? data?.brand_id : "",
    category_id: type == "edit" ? data?.category_id : "",
    original_retail_price: type == "edit" ? data?.original_retail_price : "",
    images: type === "edit" && Array.isArray(data?.images) ? data.images : [],
  };
};

export const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  article_number: Yup.string().required("Article number is required"),
  description: Yup.string().required("Description is required"),
  brand_id: Yup.number().required("Brand name is required"),
  category_id: Yup.number().required("Category is required"),
  original_retail_price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  images: Yup.array()
    .of(Yup.string())
    .min(1, "Atleast one is required")
    .required("At least one image is required"),
});

export const useDebounce = (value, time) => {
  const [search, setSearch] = useState(value);
  useEffect(() => {
    let timer = setTimeout(() => {
      setSearch(value);
    }, time);
    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  return search;
};

export const handleImageUpload = async (
  e,
  colorId,
  setColorImages,
  colorImages
) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }

  try {
    const res = await upload_multiple_image(
      formData,
      localStorage.getItem("token")
    );
    
    console.log("response of the images api", res?.data?.data);
    
    
    setColorImages((prev) => ({
      ...prev,
      [colorId]: res?.data?.data 
    }));
    
  } catch (error) {
    console.error("Upload error:", error);
  }
};
