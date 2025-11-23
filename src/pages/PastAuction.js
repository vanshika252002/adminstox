import React, { useEffect, useState } from "react";
import { Table, Avatar } from "@mui/joy";
import { get_past_auctions } from "../reduxData/user/userAction";

// import {MoreVert} from '@material-ui/icons';
import { format } from "date-fns";
import EmptyList from "../Shared/EmptyList";
import { connect, useDispatch } from "react-redux";
import CustomPagination from "../components/CustomPagination";
import { VIEW_ITEM_DETAIL } from "../reduxData/user/userTypes";
import ViewDetail from "../Modals/ViewDetail";
import EmptyData from "../components/EmptyData";
import LiveWatchers from "./LiveWatchers";

const PastAuction = ({ user, pastdata, pastTotal }) => {
  const [pastOrders, setPastOrders] = useState(null);
  const [isPop, setIsPop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const dispatch = useDispatch();
  const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;
  useEffect(() => {
    const fetchData = async () => {
      try {
        await get_past_auctions(dispatch, localStorage.getItem("token"), 1, 10);
        // setPastOrders(data?.data?.data);
        // console.log(data?.data?.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [currentPage, perPage]);

  const handleprice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const USDFormat = (num) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="container">
      {/* <h3 className="mb-0 fw-600">Past Auctions</h3> */}
      <div className="table-responsive mt-4">
        <table className="table user-management-table table-hover">
          <thead className="border-gray">
            <th>Winner Name</th>
            <th>Pic</th>
            <th>Bid Date</th>
            <th>Price</th>
            <th>Bid Price</th>
            <th>Watchers</th>
            <th>Owned By Name</th>
            <th>Country and Pincode</th>
            <th>Status</th>
          </thead>
          <tbody>
            {
              pastdata?.length > 0 ? (
                pastdata.map((item, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer"
                    onClick={() => {
                      setIsPop(true);
                      dispatch({ type: VIEW_ITEM_DETAIL, payload: item });
                    }}
                  >
                    <td>{item.sold_to ? item.sold_to.user_name : "-"}</td>
                    <td>
                      <Avatar
                        src={`${item.photos[0]}`}
                        alt={`Item Thumbnail ${index + 1}`}
                      />
                    </td>
                    <td>
                      {item.date_of_sale
                        ? format(new Date(item?.date_of_sale), "MM/dd/yyyy")
                        : "-"}
                    </td>
                    <td>
                      {item.reserver_price !== "null" &&
                      item?.reserver_price !== "0"
                        ? USDFormat(item.reserver_price)
                        : "$0"}
                    </td>
                    <td>{item.bid_price ? USDFormat(item.bid_price) : "$0"}</td>
                    <td>
                      <LiveWatchers auctionId={item?._id} user={user} />
                    </td>
                    <td>{item.owner.full_name}</td>
                    <td>
                      {item.owner_country}({item?.zipcode})
                    </td>
                    <td>
                      {item?.sold_to === null &&
                      (item?.bid_price === null ||
                        item?.bid_price < item?.reserver_price)
                        ? "Unsold"
                        : "Sold"}
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyData />
              )
              // <EmptyList name="Past Auctions" />
            }
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        {pastTotal > 0 && (
          <CustomPagination
            total={pastTotal}
            onPageChange={(page, perPage) => {
              get_past_auctions(
                dispatch,
                localStorage.getItem("token"),
                page,
                perPage
              );
            }}
          />
        )}

        {/* <button
          className="btn btn-sm me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          className="btn btn-sm ms-2"
          disabled={!pastdata || pastdata.length < perPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button> */}
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

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    pastdata: state.user.pastdata,
    pastTotal: state.user.pastTotal,
  };
};
export default connect(mapStateToProps)(PastAuction);
