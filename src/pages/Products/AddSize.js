import { useSelector } from "react-redux";
import { add_size } from "../../reduxData/user/userAction";
import * as Yup from "yup";
import { useFormik } from "formik";

const schema = Yup.object({
  size: Yup.string().required("Size is required"),
  region: Yup.string().required("Region is required"),
});

const AddSize = () => {
  const token = useSelector((state) => state.auth.accessToken);

  const formik = useFormik({
    initialValues: {
      size: "",
      region: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const data = {
          size_name: values.size,
          region: values.region,
        };
        await add_size(token, data);

        resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="home-page w-100">
      <div className="container">
        <div className="atrribute-border m-auto ">
          <h3 className="mt-3 mb-1 fw-600">Add Size</h3>

          <form onSubmit={formik.handleSubmit}>
            <p>Size Name</p>
            <input
              name="size"
               className="form-control"
              placeholder="Add Size"
              value={formik.values.size}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.size && formik.errors.size && (
              <p className="text-danger">{formik.errors.size}</p>
            )}

            <p className="mt-3">Region</p>
            <input
              name="region"
              className="form-control"
              placeholder="Add Region"
              value={formik.values.region}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.region && formik.errors.region && (
              <p className="text-danger">{formik.errors.region}</p>
            )}

            <button type="submit" className="btn common-button mt-3">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSize;
