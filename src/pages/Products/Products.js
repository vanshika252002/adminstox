import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  get_master_products,
  delete_product,
  search_products,
} from "../../reduxData/user/userAction";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDebounce } from "./utils";

const Products = () => {
  const token = useSelector((state) => state.auth.accessToken);
  const [adminProducts, setAdminProducts] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);

  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await get_master_products(token);
    setAdminProducts(res?.data?.data);
    // console.log("master products", res?.data?.data);
  };

  const handleDeleteProduct = async (id) => {
    const res = await delete_product(token, id);
    if (res) {
      fetchData();
    }
  };
  const searchedProduct = async () => {
    const res = await search_products(token, debouncedValue);
    if (res) {
      console.log("search data ", res?.data);
      setAdminProducts(res?.data);
    }
  };

  useEffect(() => {
    if(debouncedValue)
    {searchedProduct();}

   else{
     fetchData();

   }
  }, [debouncedValue]);

  // useEffect(() => {
  //   fetchData();
  // }, []);



  return (
    <div className="container">
      <div className="flex-md-row flex-column gap-2 d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-600 col-md-6">Products Management</h3>
        <button
          className="mt-2 btn common-button"
          onClick={() => navigate("/add-product")}
        >
          + Add New product
        </button>
      </div>

      <div className="filters">
        <div className="MuiInput-root MuiInput-variantOutlined MuiInput-colorNeutral MuiInput-sizeMd css-kf85qm-JoyInput-root">
          <input
            className="MuiInput-input css-1gw9vc6-JoyInput-input"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive mt-3"></div>
      <div className="table-responsive">
        {adminProducts.length > 0 ? (
          <table className="table user-management-table table-hover">
            <thead className="border-gray">
              <th scope="col">Sr. No.</th>
              <th scope="col">Article</th>
              <th scope="col">Title</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </thead>
            <tbody>
              {adminProducts?.map((i, idx) => (
                <tr>
                  <td>{idx + 1}</td>
                  <td>{i?.article_number}</td>
                  <td>{i?.title}</td>
                  <td>{i?.status}</td>
                  <td>
                    {" "}
                    <Link
                      className="navbar-brand mx-2"
                      to={`/edit-product/${i.id}`}
                      // to={`/editUser/${data.id}`}
                    >
                      <i className="far fa-edit edit"></i>
                    </Link>
                    <Link
                      className="text-danger"
                      onClick={() => handleDeleteProduct(i.id)}
                    >
                      <i class="bi bi-trash3"></i>
                    </Link>
                    <Link className="ms-2 text-black"  to={`/add-variant/${i?.id}`}>
              <i class="bi bi-plus-circle "  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add variant"></i>
                    </Link>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">No Product</div>
        )}
      </div>
    </div>
  );
};
export default Products;
