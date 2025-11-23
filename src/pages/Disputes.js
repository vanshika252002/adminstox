import React, { useEffect, useState } from "react";
import { Box, Input, Option, Select } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmptyData from "../components/EmptyData";
import CustomPagination from "../components/CustomPagination";
import { user_dispute } from "../reduxData/user/userAction";
import DefaultImg from "../images/no_profile.png";
import { VIEW_ITEM_DETAIL } from "../reduxData/user/userTypes";
import ViewDetail from "../Modals/ViewDetail";
const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;
const DisputesList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { disputes, disputesTotal } = useSelector((state) => state.user);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null);
  const [isPop, setIsPop] = useState(false);
  const allStatus = [
    { label: "Open", value: 0 },
    { label: "In Progress", value: 1 },
    { label: "Closed", value: 2 },
  ];
  useEffect(() => {
    user_dispute(
      dispatch,
      localStorage.getItem("token"),
      page,
      pageSize,
      search,
      "get",
      null
    );
  }, [user, dispatch, page, pageSize, search]);
  const statusChange = async (item, value) => {
    await user_dispute(
      dispatch,
      localStorage.getItem("token"),
      page,
      pageSize,
      search,
      "put",
      { id: item?._id, status: value }
    );
  };
  return (
    <div>
      <div className="container">
        <Box className="d-flex mb-4 justify-content-between align-items-center">
          <h3 className="mb-0 fw-600">{`Disputes (${disputesTotal})`}</h3>
          <div className="d-flex justify-content-end align-items-center">
            <Input
              className="form-control"
              id="nameInput"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Box>
        <div className="table-responsive">
          <table className="table user-management-table">
            <thead className="border-gray">
              <tr>
                <th>User</th>
                <th>Item</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {disputesTotal > 0 ? (
                disputes.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div
                        className="d-flex align-items-center justify-content-left cursor-pointer"
                        onClick={() =>
                          navigate(`/editUser/${item?.user_id?._id}`)
                        }
                      >
                        <img
                          src={
                            item?.user_id?.profile_pic
                              ? `${item?.user_id?.profile_pic}`
                              : DefaultImg
                          }
                          style={{ width: 49, height: 49, borderRadius: 75 }}
                          className="object-fit-cover "
                          alt=""
                        />
                        <div className="px-2">
                          <span className="text-capitalize">
                            {item?.user_id?.user_name}
                          </span>
                          <br />
                          {item?.user_id?.email}
                        </div>
                      </div>
                    </td>
                    <td
                      className="text-capitalize d-flex align-items-center justify-content-left cursor-pointer"
                      onClick={() => {
                        setIsPop(true);
                        dispatch({
                          type: VIEW_ITEM_DETAIL,
                          payload: item?.itemId,
                        });
                      }}
                    >
                      {item?.itemId?.photos?.length > 0 ? (
                        <img
                          src={`${item?.itemId?.photos[0]}`}
                          height={50}
                          width={65}
                          alt="not found"
                          className="object-fit-cover rounded"
                        />
                      ) : (
                        <img alt="not found" />
                      )}
                      <div className="px-2">
                        {item?.item_name}
                        <br />
                        <b>Owner: </b>
                        {item?.itemId?.owner?.full_name}
                      </div>
                    </td>
                    <td className="text-capitalize">
                      <b>{item?.reason}</b>
                      <br />
                      {item?.description}
                    </td>
                    <td className="text-capitalize">
                      <Select
                        defaultValue={item?.status}
                        disabled={
                          !(
                            (user?.role === "staff" &&
                              user?.permission?.p_disputes > 0) ||
                            user?.role !== "staff"
                          )
                        }
                      >
                        <Option value={null} disabled>
                          Select Status
                        </Option>
                        {allStatus.map((option) => (
                          <Option
                            key={option.value}
                            value={option.value}
                            onClick={() => statusChange(item, option.value)}
                          >
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyData />
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          {disputesTotal > pageSize && (
            <CustomPagination
              total={disputesTotal}
              onPageChange={(page, perPage) => {
                setPage(page);
                setPageSize(perPage);
              }}
            />
          )}
        </div>
      </div>
      <ViewDetail
        show={isPop}
        handleClose={() => {
          setIsPop(false);
          dispatch({ type: VIEW_ITEM_DETAIL, payload: null });
        }}
      />
    </div>
  );
};

export default DisputesList;
