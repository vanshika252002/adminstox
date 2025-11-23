import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import {
  add_category,
  apply_feature_category,
  delete_category,
  edit_category,
  get_category,
  manage_sub_category,
} from "../reduxData/user/userAction";
import { Avatar, Box, Option, Select, Table } from "@mui/joy";
import EmptyList from "../Shared/EmptyList";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CustomPagination from "../components/CustomPagination";

const Category = ({ categoriesList, totalCategories }) => {
  const [open, setOpen] = React.useState(false);
  const [subCat, setSubCat] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteCategoryID, setDeleteCategoryID] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryList, setCategoryList] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editObj, setEditObj] = useState(null);
  const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [perPage, setPerPage] = useState(10);
  const [resetPage, setResetPage] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    image: "",
  });
  const [subData, setSubData] = useState({
    name: "",
    parentId: "",
    image: "",
  });
  const [subErrors, setSubErrors] = useState({
    name: "",
    parentId: "",
    image: "",
  });
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const imageRef = useRef();
  const [imagePreview, setImagePreview] = useState(null);
  const [total, setTotal] = useState(0);
  // useEffect(() => {
  //   fetchData();
  // }, [currentPage, perPage, statusFilter]);

  // const fetchData = async () => {
  //   try {
  //     const data = await get_category(dispatch, localStorage.getItem("token"), currentPage, perPage, "", statusFilter);
  //     setCategoryList(data?.data); 
  //   } catch (error) {
  //     console.error("Error fetching category data:", error);
  //   }
  // };

  useEffect(() => {
    const fetchData = async (page = currentPage, rows = perPage) => {
      try {
        const data = await get_category(dispatch, localStorage.getItem("token"), page, rows, name, statusFilter);
        setCategoryList(data?.data);
        setTotal(data?.total || 0);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, [currentPage, perPage, name, statusFilter]);




  const addNewCategory = async () => {
    try {
      const isDuplicate = categoryList?.some(
        (cat) => cat.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
      );

      if (isDuplicate) {
        console.error("Category name already exists!");
        alert("Category name already exists!");
        return;
      }
      const formData = new FormData();
      formData.append("name", categoryName);
      // formData.append("image", categoryImage);
      const data = await add_category(
        formData,
        localStorage.getItem("token"),
        dispatch
      );

      if (data?.data?.status) {
        // fetchData();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error adding new category:", error);
    }
  };

  const editCategory = async () => {
    const formData = new FormData();
    if (editObj?.category_image !== categoryImage) {
      formData.append("image", categoryImage);
    }
    formData.append("name", categoryName);
    try {
      const data = await edit_category(
        formData,
        localStorage.getItem("token"),
        editObj?._id,
        dispatch
      );
      if (data?.data?.status) {
        // fetchData();
        setOpen(false);
        setImagePreview("");
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const data = await delete_category(
        id,
        localStorage.getItem("token"),
        dispatch
      );
      if (data?.data?.status) {
        const data = await get_category(
          dispatch,
          localStorage.getItem("token"),
          page,
          perPage
        );
        setCategoryList(data?.data?.data);
        setDeleteModal(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const setEditCategory = (edit) => {
    setCategoryName(edit?.name);
    setCategoryImage(`${edit?.category_image}`);
    setEditId(edit?.id);
    setEditObj(edit);
    setOpen(true);
  };

  const handleImage = (e) => {
    e.preventDefault();
    imageRef.current.click();
  };
  const handleChange = (e, label) => {
    if (label == "name") {
      if (!e.target.value) {
        setErrors({ ...errors, [label]: "Name is required" });
      } else {
        setErrors({ ...errors, [label]: "" });
      }
    }
    if (label == "image") {
      setCategoryImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setErrors({ ...errors, [label]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      name: !categoryName ? "Name is required" : null,
      // image: !categoryImage ? "Image is required" : null,
    });
    // const formData = new FormData();
    if (!categoryName) {
      return;
    }

    if (editId) {
      const formData = { name: categoryName };
      const data = await edit_category(
        formData,
        localStorage.getItem("token"),
        editObj?.id,
        dispatch
      );
      if (data?.data?.status) {
        const data = await get_category(
          dispatch,
          localStorage.getItem("token"),
          page,
          perPage
        );
        setCategoryList(data?.data?.data);
        setOpen(false);
        setImagePreview("");
      }
    } else if (!editId) {
      const formData = { name: categoryName };
      const data = await add_category(
        formData,
        localStorage.getItem("token"),
        dispatch
      );
      if (data?.data?.status) {
        const data = await get_category(
          dispatch,
          localStorage.getItem("token"),
          page,
          perPage
        );
        setCategoryList(data?.data?.data);
        setOpen(false);
        setImagePreview("");
      }
    }
  };

  const handleFeatured = async (item) => {
    const categorydata = {
      name: item?.name.trim(),
      image: item?.category_image,
    };
    if (item?.is_feature === false) {
      categorydata.is_feature = true;
    } else if (item?.is_feature === true) {
      categorydata.is_feature = false;
    }
    await apply_feature_category(
      categorydata,
      localStorage.getItem("token"),
      item?._id,
      dispatch
    );
    await get_category(dispatch, localStorage.getItem("token"), 1, 10);
  };

  // sub category section
  const handleSubChange = (label, value) => {
    switch (label) {
      case "name":
        setSubData((prev) => ({ ...prev, name: value }));
        setSubErrors((prev) => ({
          ...prev,
          name: value === "" ? "Name is required" : null,
        }));
        break;
      case "parentId":
        setSubData((prev) => ({ ...prev, parentId: value }));
        setSubErrors((prev) => ({ ...prev, parentId: null }));
        break;
      default:
        setSubData((prev) => ({ ...prev, [label]: value }));
        break;
    }
  };

  const subRef = useRef();
  const handleSubClick = () => {
    subRef.current.click();
  };

  const handleSubImage = (e) => {
    setSubData((prev) => ({ ...prev, image: e.target.files[0] }));
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setSubErrors((prev) => ({ ...prev, image: null }));
  };

  const handleCategory = async (e) => {
    e.preventDefault();
    const newErr = {
      name: subData?.name === "" ? "Name is required" : null,
      parentId:
        subData?.parentId === "" || subData?.parentId === null
          ? "Select Parent Category"
          : null,
      image: subData?.image === "" ? "Image is required" : null,
    };
    setSubErrors(newErr);

    const hasErrors = Object.values(newErr).some((val) => val !== null);

    if (hasErrors) return;

    const formData = new FormData();
    formData.append("name", subData?.name);
    formData.append("image", subData?.image);
    formData.append("parent_id", subData?.parentId);

    const data = await manage_sub_category(
      formData,
      localStorage.getItem("token"),
      dispatch,
      subCat?.id
    );
    if (data?.data?.status) {
      const data = await get_category(
        dispatch,
        localStorage.getItem("token"),
        currentPage,
        perPage
      );
      setCategoryList(data?.data?.data);
      setSubData({ name: "", image: "", parentId: "" });
      setSubErrors({ name: null, image: null, parentId: null });
      setImagePreview(null);
      setIsOpen(false);
    }
  };

  const handleDelete = async (item) => {
    const message = item?.status
      ? "Category In-Active Successfully"
      : "Category Active Successfully";
    const data = await delete_category(
      item?.id,
      localStorage.getItem("token"),
      dispatch,
      message
    );
    if (data?.data?.status) {
      const data = await get_category(dispatch, localStorage.getItem("token"), currentPage, perPage, "", statusFilter);
      setCategoryList(data?.data?.data);
    }
  };

  useEffect(() => {
    if (subCat) {
      setSubData((prev) => ({
        ...prev,
        name: subCat?.name,
        image: subCat?.category_image,
        parentId: subCat?.parent_id,
      }));
    }
  }, [subCat]);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";



  // console.log("categoriesList",categoriesList?.name)


  return (
    <div className="container">
      <div className="flex-md-row flex-column gap-2 d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-600 col-md-6">Category Management ({totalCategories})</h3>
        <div className="d-flex align-items-center justify-content-between">
        </div>
        {((user?.role === "staff" && user?.permission?.p_categories > 1) ||
          user?.role !== "staff") && (
            <button
              className="mt-2 btn common-button"
              onClick={() => {
                setEditId(null);
                setCategoryName(null);
                setCategoryImage(null);
                setOpen(true);
              }}
            >
              + Add New category
            </button>
          )}
        {/* {((user?.role === "staff" && user?.permission?.p_categories > 1) ||
          user?.role !== "staff") && (
            <button
              className="btn common-button"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              + Add New Sub category
            </button>
          )} */}
      </div>

      {/* Category Modal */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setErrors({ name: "", image: "" });
          setImagePreview(null);
        }}
      >
        <ModalDialog>
          <DialogTitle>{editId ? "Edit" : "Create new"} category</DialogTitle>
          {/* <DialogContent>
            Fill in the information of the Category.
          </DialogContent> */}
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Category Name</FormLabel>
                <Input
                  autoFocus
                  placeholder="Enter name"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                    handleChange(e, "name");
                  }}
                />
                {errors?.name && (
                  <div className="error_msg">{errors?.name}</div>
                )}
              </FormControl>
              {/* console.log (errors) */}
              {/* <FormControl>
                <FormLabel>Category Image</FormLabel>
                <div className="d-flex">
                  {imagePreview ? (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="category"
                        className="preview-image"
                      />
                    </div>
                  ) : !imagePreview && categoryImage ? (
                    <div className="mt-3">
                      <img
                        src={categoryImage}
                        alt="category"
                        className="preview-image"
                      />
                    </div>
                  ) : (
                    <div className="mt-3"></div>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => {
                      handleChange(e, "image");
                    }}
                    className="align-items-center d-none"
                    ref={imageRef}
                  />
                  <button
                    type="button"
                    onClick={handleImage}
                    className="btn btn-warning ms-4 mt-3"
                    style={{ height: "40px" }}
                  >
                    {editId ? "Edit" : "Upload"} Image
                  </button>
                </div>
                {errors?.image && (
                  <div className="error_msg">{errors?.image}</div>
                )}
              </FormControl> */}

              <button type="submit" className="btn common-button">
                Submit
              </button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* sub category modal */}
      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSubData({ name: "", image: "", parentId: "" });
          setSubErrors({ name: null, image: null, parentId: null });
          setImagePreview(null);
          setSubCat(null);
        }}
      >
        <ModalDialog sx={{ width: "600px" }}>
          <DialogTitle>{subCat ? "Edit" : "ADD New"} Sub-Category</DialogTitle>
          <form
            onSubmit={(e) => {
              handleCategory(e);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  autoFocus
                  placeholder="Enter name"
                  value={subData?.name}
                  onChange={(e) => {
                    handleSubChange("name", e.target.value);
                  }}
                />
                {subErrors?.name && (
                  <div className="error_msg">{subErrors?.name}</div>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Parent Category</FormLabel>
                <Select
                  placeholder="Select parent category"
                  value={subData?.parentId || ""}
                  onChange={(e, value) => handleSubChange("parentId", value)}
                >
                  {categoriesList?.map((cat, index) => (
                    <Option key={index} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
                {subErrors?.parentId && (
                  <div className="error_msg">{subErrors?.parentId}</div>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Image</FormLabel>
                <div className="d-flex">
                  {imagePreview ? (
                    <div className="mt-3">
                      <img
                        src={imagePreview}
                        alt="category"
                        className="preview-image"
                      />
                    </div>
                  ) : !imagePreview && subData?.image ? (
                    <div className="mt-3">
                      <img
                        src={`${subData?.image}`}
                        alt="category"
                        className="preview-image"
                      />
                    </div>
                  ) : (
                    <div className="mt-3"></div>
                  )}
                  {/* {categoryImage && <div className="mt-3"><img src={categoryImage} alt="category" className="preview-image" /></div>} */}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => {
                      handleSubImage(e);
                    }}
                    className="align-items-center d-none"
                    ref={subRef}
                  />
                  <button
                    type="button"
                    onClick={handleSubClick}
                    className="btn btn-warning ms-4 mt-3"
                    style={{ height: "40px" }}
                  >
                    Upload Image
                  </button>
                </div>
                {subErrors?.image && (
                  <div className="error_msg">{subErrors?.image}</div>
                )}
              </FormControl>
              <button type="submit" className="btn common-button">
                Submit
              </button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
        <ModalDialog>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogContent>
            Are you sure you want to delete category.
          </DialogContent>
          <Box>
            <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
            <Button
              className="mx-2"
              color="danger"
              onClick={() => deleteCategory(deleteCategoryID)}
            >
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <div className="filters">
        <Input
          id="nameInput"
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={async (e) => {
            setName(e.target.value);
            const data = await get_category(
              dispatch,
              localStorage.getItem("token"),
              1,
              10,
              e.target.value
            );
            setCategoryList(data?.data?.data);
          }}
        />


        <div className="custom-select">
          <p className="m-0">View By Status</p>
          <div className="select">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // reset to first page on filter change
              }}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="In-active">In-active</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-hover user-management-table auction-category-list">
          <thead className="border-gray">
            <th>Sr. No.</th>
            <th>Category Name</th>
            <th>Status</th>
            <th>Action</th>
          </thead>
          <tbody>
            {totalCategories > 0 ? (
              categoriesList.map((item, index) => (
                <>
                  <tr key={index}>
                    <td>{index + 1}.</td>
                    <td
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedCategoryId(
                          selectedCategoryId === item.id ? null : item.id
                        )
                      }
                    >
                      {capitalize(item.name)}
                    </td>
                    <td>{item.status ? "Active" : "In-Active"}</td>
                    {/* <td>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          disabled={
                            user?.role === "staff" &&
                            user?.permission?.p_categories < 2
                          }
                          role="switch"
                          id="flexSwitchCheckDefault"
                          checked={item?.is_feature}
                          onChange={() => handleFeatured(item)}
                        />
                      </div>
                    </td> */}
                    {((user?.role === "staff" &&
                      user?.permission?.p_categories > 1) ||
                      user?.role !== "staff") && (
                        <td className="d-flex gap-1 align-items-center">
                          <i
                            className="cursor-pointer mx-2 far fa-edit edit"
                            onClick={() => setEditCategory(item)}
                          />

                          <div class="form-check form-switch switch-large">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckDefault"
                              checked={item?.status}
                              onChange={() => handleDelete(item)}
                            />
                          </div>

                          {/* {((user?.role === "staff" &&
                            user?.permission?.p_categories > 2) ||
                            user?.role !== "staff") && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                className="cursor-pointer delete-icon bi bi-trash3-fill"
                                onClick={() => {
                                  setDeleteModal(true);
                                  setDeleteCategoryID(item?.id);
                                }}
                              >
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                              </svg>
                            )} */}
                        </td>
                      )}
                  </tr>
                  {/* {selectedCategoryId === item.id && (
                    <tr>
                      <td colSpan="4">
                        <div className="collapse show transition-height">
                          <div className="table-responsive mt-3">
                            <table className="table table-hover user-management-table auction-category-list">
                              <thead className="border-gray">
                                <tr>
                                  <th>Thumbnail</th>
                                  <th>Name</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item?.subCategory?.length > 0 ? item?.subCategory?.map((itm, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      <Avatar
                                        src={`${itm.category_image}`}
                                        alt={`Item Thumbnail ${idx + 1}`}
                                      />
                                    </td>
                                    <td>{itm?.name}</td>
                                    <td>
                                      <i
                                        className="cursor-pointer mx-2 far fa-edit edit"
                                        onClick={() => {
                                          setSubCat(itm);
                                          setIsOpen(true);
                                        }}
                                      />
                                      {((user?.role === "staff" &&
                                        user?.permission?.p_categories > 2) ||
                                        user?.role !== "staff") && (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            className="cursor-pointer delete-icon bi bi-trash3-fill"
                                            onClick={() => {
                                              setDeleteModal(true);
                                              setDeleteCategoryID(itm?._id);
                                            }}
                                          >
                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                          </svg>
                                        )}
                                    </td>
                                  </tr>
                                ))
                                  :
                                  <EmptyList name="Sub Category" />
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )} */}
                </>
              ))
            ) : (
              <EmptyList name="Category" />
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        {totalCategories > 0 && (
          <CustomPagination
            total={totalCategories}
            onPageChange={(page, perPage) => {
              setCurrentPage(page);
              setPerPage(perPage);
              get_category(dispatch, localStorage.getItem("token"), page, perPage, name, statusFilter);
            }}
            resetPage={resetPage}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    categoriesList: state.user.categoriesList,
    totalCategories: state.user.totalCategories,
  };
};
export default connect(mapStateToProps)(Category);
