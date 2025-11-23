import React, { useEffect } from "react";
import { Avatar } from "@mui/joy";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { get_all_payments } from "../reduxData/user/userAction";
import { formatInTimeZone } from "date-fns-tz";
import EmptyData from "../components/EmptyData";
import DefaultImg from "../images/no_profile.png";
import CustomPagination from "../components/CustomPagination";
import DownloadFile from "./Comman/DownloadFile";

const Payments = () => {
    const { user } = useSelector((state) => state.auth);
    const { paymentLists, totalPayments } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { REACT_APP_IMAGE_URL } = process.env;

    const fetchData = async () => {
        await get_all_payments(localStorage.getItem("token"), dispatch, 1, 10);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="container">
                <h3 className="mb-0 fw-600">Payments</h3>
                <div className="table-responsive mt-4">
                    <table className="table table-hover user-management-table">
                        <thead className="border-gray">
                            <th>Sr. No.</th>
                            <th>Thumbnail</th>
                            <th>Item Name</th>
                            <th>Brand</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Amount</th>
                            <th>Payment Date</th>
                            <th>Status</th>
                            {/* <th>Seller Payment Status</th> */}
                            <th>Action</th>
                        </thead>
                        <tbody>
                            {Array.isArray(paymentLists) && totalPayments > 0 ? (
                                paymentLists?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td>{index + 1}.</td>
                                            <td>
                                                <Avatar variant="soft"
                                                    src={item?.variantdata ? `${REACT_APP_IMAGE_URL}${item?.variantdata?.images ? item?.variantdata?.images[0] : DefaultImg}` : DefaultImg}
                                                    alt={`Item Thumbnail ${index + 1}`}
                                                />
                                            </td>
                                            <td className="cursor-pointer">{item?.itemdata?.title || 'N/A'}</td>
                                            <td className="cursor-pointer">{item?.itemdata?.brand_name || 'N/A'}</td>
                                            <td className="cursor-pointer">{item?.variantdata?.color_name || 'N/A'}</td>
                                            <td className="cursor-pointer">{item?.variantdata?.size_name || 'N/A'}</td>
                                            <td className="">
                                                {item?.paid_amount !== "null" && item?.paid_amount !== "0" ? `€ ${item?.paid_amount}` : "€ 0"}
                                            </td>
                                            <td>
                                                {item?.created_at
                                                    ? formatInTimeZone(
                                                        new Date(item.created_at),
                                                        "UTC",
                                                        "MM/dd/yyyy / hh:mm a"
                                                    )
                                                    : "N/A"}
                                            </td>
                                            <td style={{ color: item?.status === "succeed" ? 'green' : 'red' }}>
                                                {item?.status === "succeed" ? "Succeed" : "Pending"}
                                            </td>
                                            {/* <td style={{ color: item?.seller_payment_status === "succeed" ? 'green' : 'red' }}>
                                                {item?.seller_payment_status === "succeed" ? "Succeed" : "Pending"}
                                            </td> */}
                                            <td> <DownloadFile invoiceUrl={item?.orderdata?.invoice} /> </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (<EmptyData />)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-3">
                {totalPayments > 0 && (
                    <CustomPagination
                        total={totalPayments}
                        onPageChange={(page, perPage) => {
                            get_all_payments(localStorage.getItem("token"), dispatch, page, perPage,);
                        }}
                    />
                )}
            </div>

        </div>
    );
};

export default Payments;