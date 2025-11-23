import { useEffect, useState } from "react";
import {
  add_brand_name,
  delete_brand_name,
  get_brand_name,
  update_brand_name,
} from "../../reduxData/user/userAction";
import { useSelector } from "react-redux";
import CustomModal from "./CustomModal";

const Brands = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const token = useSelector((state) => state.auth.accessToken);
  const [brandList, setBrandList] = useState([]);

  const handleAddBrand = async () => {
    if (!name) {
      setError("Brand name is required");
      return;
    }
    try {
      const payload = {
        brand_name: name,
      };
      const res= await add_brand_name(token, payload);
      setName("");
      setError("");
      setOpen(false);
      if(res)
      {
        getBrands()
      }
    } catch (error) {
    }
  };

  const handleUpdateBrand = async () => {
    if (!name) {
      setError("Brand name is required");
      return;
    }
    try {
      const payload = {
        brand_name: name,
      };
     const res=  await update_brand_name(token, editingBrandId, payload);
      setName("");
      setError("");
      setOpen(false);
      setIsEditMode(false);
      setEditingBrandId(null);
      if(res)
        {
      getBrands();
    } 
}catch (error) {
    }
  };

  const handleEdit = (brand) => {
    setIsEditMode(true);
    setEditingBrandId(brand.id);
    setName(brand.brand_name);
    setError("");
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    setIsEditMode(false);
    setEditingBrandId(null);
    setName("");
    setError("");
  };

  const getBrands = async () => {
    try {
      const res = await get_brand_name(token);
      if (res?.data) {
        setBrandList(res?.data);
        console.log("brands name =-====> ", res?.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleDate = (i) => {
    const date = new Date(i);
    const formatDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatDate;
  };

  const handleDelete = async (id) => {
    try {
      const res = await delete_brand_name(token, id);
      if (res) {
        getBrands();
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return (
    <>
      <div className="container">
        <div className="flex-md-row flex-column gap-2 d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-600 col-md-6">
            Brand Management ({brandList?.length || 0})
          </h3>
          <div className="d-flex align-items-center justify-content-between"></div>
          <button
            className="mt-2 btn common-button"
            onClick={() => {
              setOpen(true);
              setIsEditMode(false);
              setError("");
              setName("");
            }}
          >
            + Add New Brand
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table user-management-table table-hover">
          <thead className="border-gray">
            <tr>
              <th scope="col">Sr. No.</th>
              <th scope="col">Brand Name</th>
              <th scope="col">Created At</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brandList?.map((i, idx) => (
              <tr key={i?.id}>
                <td>{idx + 1}</td>
                <td>{i?.brand_name}</td>
                <td>{handleDate(i?.created_at)}</td>
                <td>
                  <i
                    className="far fa-edit edit me-2"
                    onClick={() => handleEdit(i)}
                    style={{ cursor: "pointer" }}
                  ></i>
                  <i
                    className="bi bi-trash3 text-danger"
                    onClick={() => handleDelete(i?.id)}
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomModal
        open={open}
        setOpen={handleModalClose}
        inputAttribute={name}
        setInputAttribute={setName}
        handleAddAttribute={isEditMode ? handleUpdateBrand : handleAddBrand}
        title={isEditMode ? "Edit Brand" : "Add New Brand"}
        label="Brand Name"
        placeholder="Enter brand name"
        error={error}
      />
    </>
  );
};

export default Brands;