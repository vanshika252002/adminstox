import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { get_badge_lists } from "../../reduxData/user/userAction";
import EmptyData from "../../components/EmptyData";
import { Avatar } from "@mui/joy";
import AddBadge from "../../Modals/AddBadge";
import DeleteContent from "../../Modals/DeleteContent";
import { useSelector } from "react-redux";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const PointsSystem = ({ badgeLists }) => {
  const [isShow, setIsShow] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [editData, setEditData] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const FetchData = async () => {
      await get_badge_lists(localStorage.getItem("token"), dispatch);
    };
    FetchData();
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <h3 className="fw-600">Badge System</h3>
        {((user?.role === "staff" && user?.permission?.p_badge_system > 1) ||
          user?.role !== "staff") && (
          <button className="btn common-button" onClick={() => setIsShow(true)}>
            New Badge
          </button>
        )}
      </div>
      <div className="table-responsive mt-3">
        <table className="table table-hover user-management-table auction-category-list">
          <thead className="border-gray">
           <th>Image</th>
            <th>Badge</th>
            <th>Levels</th>
            <th>Minimum Points</th>
            <th>Maximum Points</th>
            {((user?.role === "staff" &&
              user?.permission?.p_badge_system > 1) ||
              user?.role !== "staff") && <th>Action</th>}
          </thead>
          <tbody>
            {badgeLists?.length > 0 ? (
              badgeLists?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Avatar
                      src={`${item.image}`}
                      alt={`Item Thumbnail ${index + 1}`}
                    />
                  </td>
                  <td>
                    <Avatar
                      src={`${item.badge}`}
                      alt={`Badge ${index + 1}`}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.min_point}</td>
                  <td>{item.max_point}</td>
                  {((user?.role === "staff" &&
                    user?.permission?.p_badge_system > 1) ||
                    user?.role !== "staff") && (
                    <td>
                      <i
                        className="cursor-pointer mx-2 far fa-edit edit"
                        onClick={() => {
                          setEditData(item);
                          setIsShow(true);
                        }}
                      />
                      {((user?.role === "staff" &&
                        user?.permission?.p_badge_system > 2) ||
                        user?.role !== "staff") && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          className="cursor-pointer delete-icon bi bi-trash3-fill"
                          onClick={() => {
                            setEditData(item);
                            setIsDelete(true);
                          }}
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : ( 
              <EmptyData />
            )}
          </tbody>
        </table>
      </div>
      <AddBadge
        show={isShow}
        handleClose={() => {
          setEditData(null);
          setIsShow(false);
        }}
        data={editData}
      />
      <DeleteContent
        show={isDelete}
        handleClose={() => {
          setEditData(null);
          setIsDelete(false);
        }}
        data={editData}
        heading={"Badge"}
        otherLine={"badge"}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    badgeLists: state.user.badgeLists,
  };
};
export default connect(mapStateToProps)(PointsSystem);
