import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/joy";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { get_all_orders } from "../reduxData/user/userAction";
import { formatInTimeZone } from "date-fns-tz";
import EmptyData from "../components/EmptyData";
import DefaultImg from "../images/no_profile.png";
import CustomPagination from "../components/CustomPagination";
import DataExport from "./Comman/DataExport";

const Orders = () => {
    const { user } = useSelector((state) => state.auth);
    const { orderLists, totalOrders } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [statusFilter, setStatusFilter] = useState("all");
    const { REACT_APP_IMAGE_URL } = process.env;

    const fetchData = async (filterval) => {
        await get_all_orders(localStorage.getItem("token"), dispatch, filterval, 1, 10);
    };

    useEffect(() => {
        fetchData('all');
    }, []);

    const handleFilterChange = (newFilter) => {
       setStatusFilter(newFilter);
       fetchData(newFilter);
    };

    return (
        <div>
            <div className="container">

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0 fw-600">Orders</h3>
                    {totalOrders > 0 && <DataExport data={orderLists} />}
                </div>

                <div className="filters mb-3">
                    <div className="custom-select">
                        <p className="m-0 fw-bold">View By Status</p>
                        <div className="select">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => {
                                    // setStatusFilter(e.target.value);
                                    // setCurrentPage(1);
                                    handleFilterChange(e.target.value)
                                }}
                            >
                                <option value="all">All</option>
                                <option value="placed">Placed</option>
                                <option value="returned">Returned</option>
                                <option value="delivered">Delivered</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="table-responsive mt-4">
                    <table className="table table-hover user-management-table">
                        <thead className="border-gray">
                            <th>Order ID</th>
                            <th>Date</th>
                            {/* <th>Thumbnail</th>
                            <th>Item Name</th> */}
                            <th>Buyer Name</th>
                            <th>Price (incl. VAT)</th>
                            <th>Commission</th>
                            <th>Net Payout</th>
                            <th>Status</th>
                            {/* <th>Seller Payment Status</th> */}
                        </thead>
                        <tbody>
                            {Array.isArray(orderLists) && totalOrders > 0 ? (
                                orderLists?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td>{item?.id}</td>
                                            <td>
                                                {item?.created_at
                                                    ? formatInTimeZone(
                                                        new Date(item.created_at),
                                                        "UTC",
                                                        "MM/dd/yyyy / hh:mm a"
                                                    )
                                                    : "N/A"}
                                            </td>
                                            {/* <td>
                                                <Avatar variant="soft"
                                                    src={item?.variantdata ? `${REACT_APP_IMAGE_URL}${item?.variantdata?.images ? item?.variantdata?.images[0] : DefaultImg}` : DefaultImg}
                                                    alt={`Item Thumbnail ${index + 1}`}
                                                />
                                            </td>
                                            <td className="cursor-pointer">{item?.itemdata?.title || 'N/A'}</td> */}
                                            <td className="cursor-pointer">{item?.userdata?.user_name || 'N/A'}</td>
                                            <td className="">
                                                {item?.paid_amount !== "null" && item?.paid_amount !== "0" ? `€ ${item?.paid_amount}` : "€ 0"}
                                            </td>
                                            <td>
                                                {item?.paymentdata ? `€ ${item?.paymentdata?.platform_commission}` : 'N/A'}
                                            </td>
                                            <td className="">
                                                {item?.paymentdata ? `€ ${item?.paymentdata?.paid_amount}` : "€ 0"}
                                            </td>
                                            <td style={{ color: item?.order_status === "placed" ? 'green' : item?.order_status === "returned" ? 'orange' : item?.order_status === "delivered" ? '#a3e223;' : 'red' }}>
                                                {item?.order_status ? item.order_status.charAt(0).toUpperCase() + item.order_status.slice(1) : ""}
                                            </td>
                                            {/* <td style={{ color: item?.seller_payment_status === "succeed" ? 'green' : 'red' }}>
                                                {item?.seller_payment_status === "succeed" ? "Succeed" : "Pending"}
                                            </td> */}
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (<EmptyData />)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-3">
                {totalOrders > 0 && (
                    <CustomPagination
                        total={totalOrders}
                        onPageChange={(page, perPage) => {
                            get_all_orders(localStorage.getItem("token"), dispatch, page, perPage,);
                        }}
                    />
                )}
            </div>

        </div>
    );
};

export default Orders;