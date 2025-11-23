import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button } from "@mui/joy";
import { get_all_sell_Item, get_category } from "../reduxData/user/userAction";
import { Link, useNavigate } from "react-router-dom";
import ViewDetail from "../Modals/ViewDetail";
import { useDispatch } from "react-redux";
import { VIEW_ITEM_DETAIL } from "../reduxData/user/userTypes";
import AprroveItem from "../Modals/AprroveItem";
import RejectItem from "../Modals/RejectItem";
import { doc, onSnapshot, updateDoc } from "@firebase/firestore";
import { db } from "../firebase";
import CustomPagination from "../components/CustomPagination";
import EmptyData from "../components/EmptyData";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import LiveWatchers from "./LiveWatchers";
import DefaultImg from "../images/no_profile.png";
import { formatInTimeZone } from "date-fns-tz";
import SellerProfile from "../Modals/SellerProfile";
import BidPrice from "./Comman/BidPrice";


const ItemListing = () => {
  const { user } = useSelector((state) => state.auth);
  const { itemdata, itemTotal, pastTotal, runningTotal, categoriesList } = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [sellerData, setSellerData] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("pending");
  const [isPop, setIsPop] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [showAction, setShowAction] = useState(false);
  const [showapprove, setShowapprove] = useState(false);
  const [showreject, setShowreject] = useState(false);
  const [item, setItem] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actionRef = useRef();
  const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;
  const tabs = [
    "pending",
    "draft",
    "approved",
    "rejected",
    // "disapproved",
    "live",
    // "past",
    // "withdraw",
  ];
  useEffect(() => {
    fetchData();
  }, [currentPage, perPage, currentTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setShowAction(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAction]);

  const fetchData = async () => {
    try {
      const queryParams = selectedCategory
        .map((cat, index) => `filter[${index}]=${cat.value}`)
        .join("&");

      const apiTab = currentTab === "rejected" ? "cancelled" : currentTab;

      if (
        apiTab === "pending" ||
        apiTab === "draft" ||
        apiTab === "approved" ||
        apiTab === "cancelled" ||
        apiTab === "live" ||
        apiTab === "withdraw"
      ) {
        const data = await get_all_sell_Item(localStorage.getItem("token"), dispatch, 1, 10, apiTab, queryParams);
        setItemData(data === undefined ? null : data?.data?.data);
      }
      //  else if (currentTab === "actives") {
      //   await get_running_auctions(dispatch, localStorage.getItem("token"), 1, 10, queryParams);
      // } else if (currentTab === "past") {
      //   await get_past_auctions(dispatch, localStorage.getItem("token"), 1, 10, queryParams);
      // }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const changeItemStatus = async (id, status) => {
    if (status === true) {
      setShowapprove(true);
    } else if (status === false) {
      setShowreject(true);
    }
  };

  const changeDOJFormat = (data) => {
    const joinDate = new Date(data);
    const formattedJoinDate = joinDate.toLocaleDateString();
    return formattedJoinDate;
  };

  useEffect(() => {
    const userRef = doc(db, "admin", "ADMIN");
    const getItem = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const newitem = snapshot.data();
        if (newitem.item_created) {
          handleUpdate();
        }
      }
    });
  }, []);

  const handleUpdate = async () => {
    const userRef = doc(db, "admin", "ADMIN");
    await get_all_sell_Item(
      localStorage.getItem("token"),
      dispatch,
      1,
      10,
      currentTab
    );
    await updateDoc(userRef, { item_created: false });
  };

  useEffect(() => {
    const handleData = async () => {
      const alldata = await get_category(
        dispatch,
        localStorage.getItem("token"),
        1,
        10
      );
      setOptions(
        alldata?.data?.data?.map((item) => {
          return {
            label: item?.name,
            value: item?._id,
          };
        })
      );
    };
    handleData();
  }, []);

  const handleChange = async (options) => {
    console.log("selectedd..", options);
    setSelectedCategory(options);
    const queryParams = options
      .map((cat, index) => `filter[${index}]=${cat.value}`)
      .join("&");
    // console.log("queryParams", queryParams);

    const apiTab = currentTab === "rejected" ? "cancelled" : currentTab;
    if (apiTab === "pending" || apiTab === "draft" || apiTab === "approved" || apiTab === "cancelled" || apiTab === "withdraw") {
      const data = await get_all_sell_Item(
        localStorage.getItem("token"),
        dispatch,
        1,
        10,
        apiTab,
        queryParams
      );
      setItemData(data?.data?.data);
    }

    // else if (currentTab === "actives") {
    //   await get_running_auctions(
    //     dispatch,
    //     localStorage.getItem("token"),
    //     1,
    //     10,
    //     queryParams
    //   );
    // } else if (currentTab === "past") {
    //   await get_past_auctions(
    //     dispatch,
    //     localStorage.getItem("token"),
    //     1,
    //     10,
    //     queryParams
    //   );
    // }
  };

  const handleprice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const EuroFormat = (num) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(num);
  };

  useEffect(() => {
    let currentpg = JSON.parse(localStorage.getItem("itemPage"));
    if (currentpg) {
      setCurrentTab(currentpg);
    } else {
      setCurrentTab("pending");
      localStorage.setItem("itemPage", JSON.stringify("pending"));
    }
    localStorage.removeItem("currentPage");
  }, []);

  const formatDate = (inputdate) => {
    const date = new Date(inputdate);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = days[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${dayOfMonth} ${month} ${year}`;
  };

  return (
    <div>
      <div className="container">
        <h3 className="mb-0 fw-600">Auction Management</h3>
        <div className="col-lg-8 col-md-8 mt-4">
          <div className="text-md-end">
            <ul className="list-inline mb-0 sorting-list">
              {tabs.map((tab) => (
                <li key={tab} className="list-inline-item mb-2 mb-md-0">
                  <Link
                    className={`text-decoration-none text-capitalize border rounded-pill px-3 py-2 ${currentTab === tab ? "active" : ""
                      }`}
                    onClick={() => {
                      setCurrentTab(tab);
                      setCurrentPage(1);
                      localStorage.setItem("itemPage", JSON.stringify(tab));
                    }}
                  >
                    {tab === "actives" ? "Active" : tab}
                  </Link>
                </li>
              ))}
            </ul>
          </div>{" "}
        </div>
        {/* <div className="col-lg-3 pt-4">
          <ReactSelect
            isMulti={true}
            options={options}
            value={selectedCategory}
            onChange={(selected) => handleChange(selected)}
            placeholder="Select Categories"
          />
        </div> */}
        <div className="col-lg-5">
          <h5 className="mt-4 fw-600 text-capitalize">
            Total
            {` ${currentTab === "pending" ? "Pending"
              : currentTab === "rejected" ? "Rejected"
                : currentTab === "lives" ? "Live"
                  : "Approved"
              } `}

            Auctions (
            {`${(currentTab === "pending" || currentTab === "approved" || currentTab === "rejected" || currentTab === "live") ? itemTotal : 0 }`}
            )
          </h5>
        </div>

        <div className="table-responsive mt-4">
          <table className="table table-hover user-management-table">
            <thead className="border-gray">
              <th>Sr. No.</th>
              <th>Seller Name</th>
              <th>Thumbnail</th>
              <th>Item Name</th>
              <th>Brand Name</th>
              <th>{currentTab === "live" ? "Retail Price" : "Price"}</th>
              {currentTab === "live" && <th>Bid Price</th>}
              <th>Created At</th>
              {(currentTab !== "pending" && currentTab !== "rejected") && <th>Approved Date</th>}
              {/* <th>Owned By</th> */}
              {/* <th>Country & State</th> */}
              {/* <th> Watchers </th> */}
              {/* <th>Type</th> */}
              <th>Status</th>
             {currentTab !== "live" && <th>Action</th>}
              {/* {(currentTab === "pending" || currentTab === "approved") &&
                  ((user?.role === "staff" &&
                    user?.permission?.p_auctions > 1) ||
                    user?.role !== "staff") && (
                    <th className="text-center">Status</th>
                  )} */}
            </thead>
            <tbody>
              {Array.isArray(itemdata) && itemdata?.length > 0 ? (
                itemdata?.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{index + 1}.</td>
                      <td>
                        <div className={item?.usersdata ? 'w-fit-content cursor-pointer hover-underline' : ''}
                          onClick={() => {
                            setSellerData(item?.usersdata);
                            setShow(true);
                          }}>
                          {item?.usersdata ? item?.usersdata?.user_name : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <Avatar
                          variant="soft"
                          src={
                            item?.variants
                              ? `${REACT_APP_IMAGE_URL}${item?.variants[0]?.images ? item?.variants[0]?.images[0] : DefaultImg}`
                              : DefaultImg
                          }
                          alt={`Item Thumbnail ${index + 1}`}
                        />
                      </td>
                      <td className="cursor-pointer">{item?.title}</td>
                      <td className="cursor-pointer">{item?.brand_name}</td>
                      <td className="">
                        {item?.original_retail_price !== "null" &&
                          item?.original_retail_price !== "0"
                          ? EuroFormat(item?.original_retail_price)
                          : "$0"}
                      </td>
                      {currentTab === "live" && <td><BidPrice id={item?.id} /></td>}
                      <td>
                        {item?.created_at
                          ? formatInTimeZone(
                            new Date(item.created_at),
                            "UTC",
                            "MM/dd/yyyy / hh:mm a"
                          )
                          : "N/A"}
                      </td>
                      {(currentTab !== "pending" && currentTab !== "rejected") && <td>
                        {item?.approve_date
                          ? formatInTimeZone(
                            new Date(item.approve_date),
                            "UTC",
                            "MM/dd/yyyy / hh:mm a"
                          )
                          : "N/A"}
                      </td>}
                      {/* <td>
                          {item?.owner?.full_name
                            ? item?.owner?.full_name
                            : item?.created_by?.name_on_card}
                        </td> */}
                      {/* <td className="text-center">
                          <LiveWatchers auctionId={item?._id} user={user} />
                        </td> */}
                      <td style={{ color: item?.status === "pending" ? 'orange' : item?.status === "approved" ? 'green' : 'red' }}>
                        {item?.status === "pending"
                          ? "Pending"
                          : item?.status === "approved"
                            ? "Approved"
                            : "Rejected"}
                      </td>
                      {/* <td className={`${item?.status === "pending" ? 'pending-svg' : 'aprove-svg'} cursor-pointer`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
                          </svg>
                        </td> */}
                     {currentTab !== "live" && <td>
                        <Button
                          className="p-0 text-decoration-underline "
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            // setIsPop(true);
                            // dispatch({
                            //   type: VIEW_ITEM_DETAIL,
                            //   payload: item,
                            // });
                            if (!item?.slug) return;
                            navigate(`/item-details/${item?.slug}`);
                          }}
                          style={{ color: "#0d6efd" }}
                        >
                          View
                        </Button>
                      </td>}

                      {/* {currentTab === "pending" &&
                          ((user?.role === "staff" &&
                            user?.permission?.p_auctions > 1) ||
                            user?.role !== "staff") && (
                            <td className="text-center">
                              <span
                                onClick={() =>
                                  setShowAction(showAction ? null : item?._id)
                                }
                                className="cursor-pointer"
                              >
                                {" "}
                                . . .
                              </span>
                            </td>
                          )} */}
                      {/* {currentTab === "approved" &&
                          ((user?.role === "staff" &&
                            user?.permission?.p_auctions > 1) ||
                            user?.role !== "staff") && (
                            <td className="text-center">
                              <Link
                                className="navbar-brand text-decoration-underline"
                                color="primary"
                                to={`/edit-list/${item?.slug}`}
                              >
                                Edit
                              </Link>
                            </td>
                          )} */}
                    </tr>
                    {/* {showAction === item?._id && (
                        <div ref={actionRef} className="action-container">
                          <div
                            onClick={() => {
                              changeItemStatus(item?._id, true);
                              setItem(item);
                            }}
                            className="cursor-pointer"
                          >
                            Approve
                          </div>
                          <div
                            onClick={() => {
                              changeItemStatus(item?._id, false);
                              setItem(item);
                            }}
                            className="cursor-pointer"
                          >
                            Unapproved
                          </div>
                          <div>
                            {" "}
                            <Link
                              className="navbar-brand"
                              to={`/edit-list/${item?.slug}`}
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      )} */}
                  </React.Fragment>
                ))
              ) : (<EmptyData />)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3">
        {itemTotal > 0 && (
          <CustomPagination
            total={itemTotal}
            onPageChange={(page, perPage) => {
              get_all_sell_Item(
                localStorage.getItem("token"),
                dispatch,
                page,
                perPage,
                currentTab
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
      <AprroveItem
        show={showapprove}
        handleClose={() => setShowapprove(false)}
        itemid={item}
      />
      <RejectItem
        show={showreject}
        handleClose={() => setShowreject(false)}
        itemid={item}
      />
      <SellerProfile
        show={show}
        handleClose={() => {
          setSellerData(null);
          setShow(false);
        }}
        seller={sellerData}
      />
    </div>
  );
};

export default ItemListing;
