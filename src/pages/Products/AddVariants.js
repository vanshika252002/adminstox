import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { get_category } from "../../reduxData/user/userAction";
import { upload_multiple_image , add_variant} from "../../reduxData/user/userAction";
import { useNavigate, useParams } from "react-router-dom";


const schema = Yup.object({
//   colors: Yup.array().min(1, "Add at least one color"),
//   sizes: Yup.array().min(1, "Add at least one size"),
color:Yup.string().required("Color is required"),
size:Yup.string().required("Size is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number()
    .typeError("Enter valid price")
    .positive("Price must be positive")
    .required("Price is required"),
  images: Yup.mixed().required("Images are required"),
});

const AddVariants = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.accessToken);
  const categoriesId = useSelector((state) => state.user.categoriesList);
const navigate = useNavigate() ;
const {productId} = useParams() ;

  useEffect(() => {
    get_category(dispatch, token);
  }, []);

  const formik = useFormik({
    initialValues: {
      color: "",
      price:"",
    //   colors: [],

      size: "",
    //   sizes: [],

      category: "",
      images: null,
    },
    validationSchema:schema,
    onSubmit: async(values) => {
      console.log(values);
      const payload = {
        product_id:productId,
        variants:[{
          images:values.images,
          attributes_category_id:values.category,
          color:values.color,
          size_id:values.size,
          price:values.price
        }]
      }
      try{
    await add_variant(token,payload)
      }catch(error)
    {


    }

    },
  });

  const handleAddColor = () => {
    if (formik.values.color.trim() === "") return;
    formik.setFieldValue("colors", [
    //   ...formik.values.colors,
      formik.values.color,
    ]);
    formik.setFieldValue("color", "");
  };

  const handleRemoveColor = (index) => {
    const newColors = formik.values.colors.filter((_, i) => i !== index);
    formik.setFieldValue("colors", newColors);
  };

  const handleAddSize = () => {
    if (formik.values.size.trim() === "") return;
    formik.setFieldValue("sizes", [
        // ...formik.values.sizes,
         formik.values.size]);
    formik.setFieldValue("size", "");
  };

  const handleRemoveSize = (index) => {
    const newSizes = formik.values.sizes.filter((_, i) => i !== index);
    formik.setFieldValue("sizes", newSizes);
  };

  const handleImageUpload = async(e)=>{

    try{
      const files = e.target.files;
    if (!files || files.length == 0) return;

    const len = e.target.files.length;
    const formData = new FormData();
    for (const i of files) {
      formData.append("images", i);
    }
    const res = await upload_multiple_image(formData,token);
    if(res?.data)
    {
      console.log("response of files", res?.data?.data);
      formik.setFieldValue("images",res?.data?.data)
    }

    }catch(error)
    {

    }
  }

  return (<>
 
    <form className="container profile-deatils" onSubmit={formik.handleSubmit}>
   <div className="d-flex justify-content-between">
       <h3 className="mt-3 mb-1 fw-600">Add Variant</h3>
      
   </div>

      <div className="row">
        {/* COLOR INPUT */}
        <div className="mb-3 col-md-12">
          <label>Color</label>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              name="color"
              value={formik.values.color}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {/* <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddColor}
            >
              Add
            </button> */}
          </div>
 {formik.errors.color && <p className="text-danger">{formik.errors.color}</p>}
          {/* SHOW COLORS LIST */}
          {/* <div className="mt-2 d-flex gap-4">
            {formik.values.colors.map((c, index) => (
              <div
                key={index}
                className="d-flex position-relative justify-content-between border rounded mb-1 colorattribute"
              >
                {c}

                <i
                  className="bi bi-x-circle position-absolute"
                  onClick={() => handleRemoveColor(index)}
                ></i>
              </div>
            ))}
          </div> */}
        </div>

        {/* SIZE INPUT */}
        <div className="mb-3 col-md-12">
          <label>Size</label>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              name="size"
              value={formik.values.size}
              onChange={formik.handleChange}
               onBlur={formik.handleBlur}
            />
            {/* <button
              type="button"
              className="btn btn-primary"
          onClick={()=>navigate("/add-size")}
            >
              Add
            </button> */}
          </div>
 {formik.errors.size && <p className="text-danger">{formik.errors.size}</p>}
          {/* SHOW SIZES LIST */}
          {/* <div className="mt-2 d-flex gap-4">
            {formik.values.sizes.map((s, index) => (
              <div
                key={index}
                className="d-flex  position-relative justify-content-between border p-2 rounded mb-1 colorattribute"
              >
                {s}

                <i
                  className="bi bi-x-circle position-absolute"
                  onClick={() => handleRemoveSize(index)}
                ></i>
              </div>
            ))}
            
          </div> */}
        </div>

        {/* CATEGORY SELECT */}
        <div className="my-3 col-md-6">
          <label>Category</label>
          <select
            name="category"
            className="form-control"
            onChange={formik.handleChange}
          >
            <option value="">Select Category</option>
            {categoriesId?.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
           {formik.errors.category && <p className="text-danger">{formik.errors.category}</p>}
        </div>


        {/* PRICE */}
  <div  className="my-3 col-md-6">
  <label htmlFor="price">Price</label>
  <input type="number"  className="form-control" name="price" id="price" min={0}  onBlur={formik.handleBlur} onChange={formik.handleChange}  value={formik.values.price}
  onKeyDown={(e)=>{
       if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
  }} 
  />

  {formik.errors.price && <p className="text-danger">{formik.errors.price}</p>}
  </div>

        {/* IMAGES */}
        <div className="my-3 col-md-12">
          <label htmlFor="images">Images</label>
          <input
            accept="image/*"
            type="file"
            id="images"
            name="images"
            multiple
            onChange={(e) => handleImageUpload(e)}
          />
           {formik.errors.images && <p className="text-danger">{formik.errors.images}</p>}
        </div>
      </div>

      <button className="btn common-button mt-3" type="submit">
        Submit
      </button>
    </form>
  </>
        
  );
};

export default AddVariants;


