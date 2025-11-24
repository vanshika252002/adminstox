import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { handleDate, useVariantsList } from "./utils";

const { REACT_APP_IMAGE_URL } = process.env;

const VariantsList = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.accessToken);
  const { list, handleDeleteVariant } = useVariantsList(token, id);
  const navigate = useNavigate();
  const [attribute, setAttribute] = useState([]);
  const [tableFields, setTableFields] = useState([]);

  useEffect(() => {
    console.log("list is ", list);
    // console.log("attriburte ids", list?.map(i=>i?.attribute))
    if (list && list.length > 0) {
      const attributeMap = new Map();
      list.forEach((variant) => {
        variant?.attribute?.forEach((attr) => {
          if (!attributeMap.has(attr?.attribute_id)) {
            attributeMap.set(attr?.attribute_id, {
              name: attr?.attribute_name,
              id: attr?.attribute_id,
            });
          }
        });
      });

      setTableFields([...attributeMap]);

      console.log("table fields", [...attributeMap]);
    }
  }, [list]);

  return (
    <div className="container">
      <div class="flex-md-row flex-column gap-2 d-flex justify-content-between align-items-center mb-3">
        <h3 class="fw-600 col-md-6">All Variants ({list?.length})</h3>
        <div class="d-flex align-items-center justify-content-between"></div>
        <button
          class="mt-2 btn common-button"
          onClick={() => {
            navigate(`/add-variant/${id}`);
          }}
        >
          + Add New Variants
        </button>
      </div>
      {list?.length > 0 && (
        <div className="table-responsive">
          <table class="table user-management-table table-hover">
            <thead class="border-gray">
              <tr>
                <th scope="col">Sr. No.</th>
                {/* {list?.[0]?.["attribute"].map(i=><th>{i?.attribute_name}</th>)} */}
                {tableFields?.map((i) => (
                  <th>{i[1].name}</th>
                ))}
                <th scope="col">Images</th>
                <th scope="col">Created At</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((i, idx) => (
                <tr>
                  <td>{idx + 1}</td>
                  {tableFields?.map((field) => {
                    const attrId = field[0];
                    const foundAttr = i?.attribute?.find(
                      (attr) => attr?.attribute_id === attrId
                    );
                    return (
                      <td key={attrId} className="text-capitalize">
                        {foundAttr?.value || "-"}
                      </td>
                    );
                  })}
                  <td className="w-25">
                    <img
                      className="container-fluid "
                      src={`${REACT_APP_IMAGE_URL}${i?.images[0]}`}
                    />
                    {/* <div className="row">
                   
{i?.images.map((image) => (
   <div className="col-md-3">
                    <img className="w-75" src={`${REACT_APP_IMAGE_URL}${image}`} />
                      </div>
                  ))}
                  </div> */}
                  </td>
                  <td>{handleDate(i?.created_at)}</td>
                  <td>
                    <i
                      class="far fa-edit edit me-2"
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      onClick={() => handleDeleteVariant(i?.variant_id)}
                      class="bi bi-trash3 text-danger"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VariantsList;
