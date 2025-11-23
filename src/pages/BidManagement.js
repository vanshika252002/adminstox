import React, { useEffect, useState } from "react";
import { get_all_bid_items } from "../reduxData/user/userAction";
import { Avatar, Box, Input } from "@mui/joy";
import { format } from "date-fns";
import ViewBids from "../Modals/ViewBids";
import { Button } from "react-bootstrap";
import EmptyList from "../Shared/EmptyList";
import { doc, onSnapshot, updateDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { connect, useDispatch } from "react-redux";
import CustomPagination from "../components/CustomPagination";
import EmptyData from "../components/EmptyData";
import LiveWatchers from "./LiveWatchers";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const BidManagement = ({ user, biddata, bidtotal }) => {
  const [bidList, setBidList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPop, setIsPop] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [isShow, setIsShow] = useState(false);
  const [itemID, setItemID] = useState(null);
  const [searchgame, setSearchgame] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get_all_bid_items(
          dispatch,
          localStorage.getItem("token"),
          searchgame,
          1,
          10
        );
        setBidList(data?.data?.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [currentPage, perPage, searchgame]);

  useEffect(() => {
    const userRef = doc(db, "admin", "ADMIN");
    const getItem = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const newitem = snapshot.data();
        if (newitem.bid_place) {
          handleUpdate();
        }
      }
    });
  }, []);

  const handleUpdate = async () => {
    const userRef = doc(db, "admin", "ADMIN");
    await get_all_bid_items(localStorage.getItem("token"), searchgame, 1, 10);
    await updateDoc(userRef, { bid_place: false });
  };

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
    <div>
      <div className="container">
        <Box className="d-flex mb-4 justify-content-between">
          <h3 className="mb-0 fw-600">Bid Management ({bidtotal})</h3>
          <div className="d-flex justify-content-between">
            <div className="mx-3">
              <Input
                id="nameInput"
                type="text"
                placeholder="Search Item"
                value={searchgame}
                onChange={(e) => setSearchgame(e.target.value)}
              />
            </div>
          </div>
        </Box>
        <div className="table-responsive mt-4">
          <table className="table user-management-table table-hover">
            <thead className="border-gray">
              <th>Thumbnail</th>
              <th>Bid Date</th>
              <th>Price</th>
              <th>Bid Price</th>
              <th>Item Model Name</th>
              <th>Watchers</th>
              <th>Owned By Name</th>
              <th>Sold by Name</th>
              <th>Country and Pincode</th>
              {/* <th>Detail</th> */}
            </thead>
            <tbody>
              {
                bidtotal > 0 ? (
                  biddata.map((item, index) => (
                    <tr key={index}>
                      {item?.product?.photos ? (
                        <td>
                          <Avatar
                            src={`${item?.product?.photos[0]}`}
                            alt={`Item Thumbnail ${index + 1}`}
                          />
                        </td>
                      ) : (
                        <td>No Image</td>
                      )}
                      <td>
                        {item?.bid_date
                          ? format(new Date(item?.bid_date), "MM/dd/yyyy")
                          : "-"}
                      </td>
                      <td>
                        {item?.product?.reserver_price !== "null" &&
                        item?.product?.reserver_price !== "0"
                          ? `${USDFormat(
                              parseInt(item?.product?.reserver_price)
                            )}`
                          : "$0"}
                      </td>
                      <td>
                        {item?.product?.bid_price
                          ? `${USDFormat(item?.product?.bid_price)}`
                          : "$0"}
                      </td>
                      <td>
                        {item?.product?.item_name
                          ? item?.product?.item_name
                          : "N/A"}
                      </td>
                      <td className="text-center">
                        <LiveWatchers auctionId={item?._id} user={user} />
                      </td>
                      <td>
                        {item?.product?.latest_bid_by?.name_on_card
                          ? item?.product?.latest_bid_by?.name_on_card
                          : "N/A"}
                      </td>
                      <td>
                        {item?.product?.created_by?.name_on_card
                          ? item?.product?.created_by?.name_on_card
                          : "N/A"}
                      </td>
                      <td>
                        {item?.product?.owner_country}(
                        {item?.product?.zipcode
                          ? parseInt(item?.product?.zipcode)
                          : "N/A"}
                        )
                      </td>
                      {/* <td className="cursor-pointer">
                                            <Button
                                                className="p-0 text-decoration-underline "
                                                variant="contained"
                                                color="primary"
                                                onClick={() => { setIsShow(true); setItemID(item?._id); }}
                                                style={{ color: "#0d6efd" }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </Button>
                                        </td> */}
                    </tr>
                  ))
                ) : (
                  <EmptyData />
                )
                // <EmptyList name="Bid Management" />
              }
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          {bidtotal > 0 && (
            <CustomPagination
              total={bidtotal}
              onPageChange={(page, perPage) => {
                get_all_bid_items(
                  dispatch,
                  localStorage.getItem("token"),
                  searchgame,
                  page,
                  perPage
                );
              }}
            />
          )}
        </div>
        {/* <div className="mt-3">
                    <button
                        className="btn btn-sm me-2"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage}</span>
                    <button
                        className="btn btn-sm ms-2"
                        disabled={!bidList || bidList.length < perPage}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div> */}
      </div>
      <ViewBids
        show={isShow}
        handleClose={() => {
          setIsShow(false);
          setItemID(null);
        }}
        itemId={itemID}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    biddata: state.user.biddata,
    bidtotal: state.user.bidtotal,
  };
};
export default connect(mapStateToProps)(BidManagement);
