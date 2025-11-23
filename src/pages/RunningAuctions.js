import React, { useEffect, useState } from "react";
import { Table, Avatar, Button } from "@mui/joy";
import {
  get_running_auctions,
  withdraw_auction,
} from "../reduxData/user/userAction";
import EmptyList from "../Shared/EmptyList";
import { doc, onSnapshot, updateDoc } from "@firebase/firestore";
import { db } from "../firebase";
import { connect, useDispatch } from "react-redux";
import CustomPagination from "../components/CustomPagination";
import ViewDetail from "../Modals/ViewDetail";
import { VIEW_ITEM_DETAIL } from "../reduxData/user/userTypes";
import moment from "moment";
import { format } from "date-fns";
import EmptyData from "../components/EmptyData";
import BidTimer from "../components/BidTimer";
import { Link } from "react-router-dom";
import { Button as Button1, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import LiveWatchers from "./LiveWatchers";
const RunningAuctions = ({ runningdata, runningTotal, isLoading }) => {
  // Dummy data for item listings
  const [itemData, setItemData] = useState(null);
  const [isPop, setIsPop] = useState(false);
  const [isWithdraw, setIsWithdraw] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;
  const fetchData = async () => {
    try {
      await get_running_auctions(
        dispatch,
        localStorage.getItem("token"),
        1,
        10
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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
    await get_running_auctions(dispatch, localStorage.getItem("token"), 1, 10);
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

  const withdrawAuction = async () => {
    const data = await withdraw_auction(
      dispatch,
      localStorage.getItem("token"),
      isWithdraw?._id
    );
    if (data) {
      toast.success("Auction withdrawn successfully!");
      fetchData();
      const userRef = doc(db, "admin", "ADMIN");
      await updateDoc(userRef, { bid_place: true });
    } else {
      toast.error("Withdraw auction failed!");
    }
    setShow(false);
    setIsWithdraw(null);
  };
  return (
    <div className="container mt-3">
      {/* <h3 className="mb-0 fw-600">Active Auctions</h3> */}
      <div className="table-responsive mt-4">
        <table className="table user-management-table table-hover">
          <thead className="border-gray">
            <th>Thumbnail</th>
            <th>Price</th>
            <th>Item Modal Name</th>
            <th>Owned By Name</th>
            <th>Country & Zip</th>
            <th>Highest Price</th>
            <th>Watchers</th>
            <th>Total Bids</th>
            <th>Bid End Time</th>
            {((user?.role === "staff" && user?.permission?.p_auctions > 1) ||
              user?.role !== "staff") && <th>Action</th>}
          </thead>
          <tbody>
            {
              runningTotal > 0 ? (
                runningdata.map((item, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer"
                    onClick={() => {
                      setIsPop(true);
                      dispatch({ type: VIEW_ITEM_DETAIL, payload: item });
                    }}
                  >
                    <td>
                      <Avatar
                        src={`` + item.photos[0]}
                        alt={`Item Thumbnail ${index + 1}`}
                      />
                    </td>
                    <td>
                      {item.reserver_price !== "null" &&
                      item?.reserve_price !== "0"
                        ? USDFormat(item.reserver_price)
                        : "$0"}
                    </td>
                    <td>{item.item_name}</td>
                    <td>{item.owner.full_name}</td>
                    <td>
                      {item.owner_country}({item?.zipcode})
                    </td>
                    <td>{item.bid_price ? USDFormat(item.bid_price) : "$0"}</td>
                    <td>
                      <LiveWatchers auctionId={item?._id} user={user} />
                    </td>
                    <td>{item.bidCount}</td>
                    {/* <td>
                  <Button variant="contained" color="primary">
                    {item.totalBids}
                  </Button>
                </td> */}
                    <td>
                      <BidTimer start={item?.start_date} end={item?.end_date} />
                      {/* {format(new Date(item?.end_date),'dd/MM/yyyy')} */}
                    </td>
                    {((user?.role === "staff" &&
                      user?.permission?.p_auctions > 1) ||
                      user?.role !== "staff") && (
                      <td className="text-center">
                        <Button
                          className="p-0 text-decoration-underline"
                          variant="contained"
                          color="primary"
                          disabled={isLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsWithdraw(item);
                            setShow(true);
                          }}
                          style={{ color: "#0d6efd" }}
                        >
                          Withdraw
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <EmptyData />
              )
              // <EmptyList name="Active Auctions" />
            }
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        {runningTotal > 0 && (
          <CustomPagination
            total={runningTotal}
            onPageChange={(page, perPage) => {
              get_running_auctions(
                dispatch,
                localStorage.getItem("token"),
                page,
                perPage
              );
            }}
          />
        )}
      </div>
      <ViewDetail
        show={isPop}
        handleClose={() => {
          setIsPop(false);
          dispatch({ type: VIEW_ITEM_DETAIL, payload: null });
        }}
      />
      <Modal show={show} centered>
        <Modal.Body>
          <Modal.Title>Withdraw Auction</Modal.Title>
          <span className="fw-200 mt-1">
            Are you sure you want to withdrawn this auction{" "}
            <b>{isWithdraw?.item_name}</b>.
          </span>
          <div className="d-flex justify-content-space-between gap-2 mt-3">
            <Button
              type="submit"
              className="btn common-button"
              onClick={() => {
                setShow(false);
                setIsWithdraw(null);
              }}
            >
              Cancel
            </Button>
            <Button1
              className="question-button"
              variant="danger"
              onClick={() => withdrawAuction()}
            >
              Withdraw
            </Button1>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    runningdata: state.user.runningdata,
    runningTotal: state.user.runningTotal,
    isLoading: state.loading.isLoading,
  };
};
export default connect(mapStateToProps)(RunningAuctions);
