import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { get_item_bid_detail } from "../reduxData/user/userAction";
import EmptyList from "../Shared/EmptyList";
import { useDispatch } from "react-redux";

const ViewBids = ({ show, handleClose, itemId }) => {
    const usertoken = localStorage.getItem('token');
    const dispatch = useDispatch();
    const [bidData, setBidData] = useState(null);
    useEffect(() => {
        if (show) {
            const fetch_bid_data = async () => {
                try {
                    const data = await get_item_bid_detail(itemId, usertoken, dispatch);
                    // console.log("bid data....", data.data);
                    setBidData(data.data.data);
                } catch (error) {
                    toast.error(error);
                }
            };
            fetch_bid_data();
        }
    }, [show]);

    const formatDate = (inpdate) => {
        const currentdate = new Date();
        const inputdate = new Date(inpdate);
        const onemin = 60 * 1000;
        const onehour = 60 * onemin;
        if (currentdate.toDateString() === inputdate.toDateString()) {
            const timediff = Math.abs(currentdate - inputdate);
            if (timediff < onehour) {
                const diffminutes = Math.floor(timediff / onemin);
                return `${diffminutes === 0 ? 'Just Now' : `${diffminutes} ${diffminutes === 1 ? 'minute ago' : 'minutes ago'}`}`
            }
            const diffhour = Math.floor(timediff / onehour);
            return `${diffhour} ${diffhour === 1 ? 'hour' : 'hours'} ago`;
        }
        const oneday = 24 * onehour;
        const diffTime = Math.abs(currentdate - inputdate);
        const diffDays = Math.ceil(diffTime / oneday);

        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    };

    return (
        <Modal show={show} onHide={handleClose} className="modal-lg">
            <Modal.Body>
                <div>

                    <div className="profile-deatils bg-white mt-4">
                        <div className="detail-heading px-4 py-3"><div className="text-dark fw-600 h5 mb-0">Bid Details</div> </div>
                        <div className="p-4">
                            <div className="row">
                                <div className="table-responsive">
                                    <table className="table mb-0">
                                        <thead>
                                            <th>Item</th>
                                            <th>Bid Time</th>
                                            <th>Amount</th>
                                            <th>Bidder</th>
                                        </thead>
                                        <tbody>
                                            {bidData?.length > 0 ? bidData?.map((item, index) =>
                                                <tr key={index}>
                                                    <td>{item?.product?.item_name}</td>
                                                    <td>{formatDate(item?.product?.bid_date)}</td>
                                                    <td>${item?.amount}</td>
                                                    <td>{item?.userId?.user_name}</td>
                                                </tr>
                                            ) :
                                                <EmptyList name="Bid" />
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ViewBids;
