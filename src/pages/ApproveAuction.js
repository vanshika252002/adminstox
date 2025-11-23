import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import moment from "moment-timezone";
import { approve_auction, auction_details } from '../reduxData/user/userAction';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { MultiSelect } from 'react-multi-select-component';
import { ref, set } from "firebase/database"
import { realdb } from '../firebase';
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import { Box } from "@mui/joy";


const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const ApproveAuction = () => {
    const { user } = useSelector((state) => state.auth);
    const [itemData, setItemData] = useState(null);
    const [reasonModal, setReasonModal] = useState(false);
    const [reason, setReason] = useState("");
    const [formdata, setFormData] = useState({
        bidstart: "",
        bidend: "",
    });
    const [errors, setErrors] = useState({
        bidstart: "",
        bidend: "",
    });
    const [updatedVariants, setUpdatedVariants] = useState([]);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const getMinDate = () => {
        const currentDate = moment().tz(userTimeZone);
        return currentDate.format("YYYY-MM-DDTHH:mm");
    };

    const getMinEndDate = (startDate) => {
        if (!startDate) return "";
        const startDateTime = moment(startDate).tz(userTimeZone);
        return startDateTime.format("YYYY-MM-DDTHH:mm");
    };

    const validateEndDate = (startdate, enddate) => {
        const startdte = new Date(startdate);
        const enddte = new Date(enddate);
        const currentdte = new Date();
        return enddte < startdte ? false : true;
    };

    const checkSameDate = (startdate, enddate) => {
        const startdte = new Date(startdate);
        const enddte = new Date(enddate);

        return startdte.getTime() === enddte.getTime();
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case "bidstart":
                setErrors({
                    ...errors,
                    bidstart:
                        // !validateStartDate(value) ? "Start Date should add prior 1 hour"
                        // : !validStartDate(value, formdata.bidend) ? "Start Date cannot be after the End date"
                        // :
                        null,
                });
                setFormData({ ...formdata, [name]: value });
                break;
            case "bidend":
                setErrors((prev) => ({ ...prev, bidend: !value ? "End Date is required" : checkSameDate(formdata?.bidstart, value) ? "Start Date and End Date cannot be same" : null, }));
                setErrors((prev) => ({ ...prev, bidstart: validateEndDate(formdata?.bidstart, value) ? null : "Start Date cannot be after the End date", }));
                setFormData({ ...formdata, [name]: value });
                break;

            default:
                setFormData({ ...formdata, [name]: value });
                setErrors({ ...errors, [name]: "" });
                break;
        }
    };

    const validForm = (errordata) => {
        let checkdata = Object.entries(errordata);
        let err = true;
        checkdata.forEach(([key, value]) => {
            if (value) {
                err = false;
            }
        });
        return err;
    };

    const formatDate = (date) => {
        const newDateTime = moment(date).tz(userTimeZone);
        return newDateTime.format("YYYY-MM-DDTHH:mm");
    };

    // const now = new Date();
    // const auction_start = formatDate(now);

    // const endDate = new Date(now);
    // endDate.setDate(endDate.getDate() + 2);
    // const auction_end = formatDate(endDate);

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 20, 0, 0); // 1st of next month, 8:00 PM
    const auction_start = formatDate(nextMonth); // or use your formatDate(nextMonth)

    const endDate = new Date(nextMonth);
    endDate.setDate(4); // 4th of next month
    endDate.setHours(20, 0, 0, 0); // 8:00 PM
    const auction_end = formatDate(endDate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const { bidstart, bidend } = formdata;
        // let newErrors = {
        //     bidstart: !bidstart || bidstart === "" ? "Start date is required"
        //         : !validateEndDate(formdata?.bidstart, formdata?.bidend) ? "Start Date cannot be after the End date" : null,
        //     bidend: !bidend || bidend === "" ? "End date is required"
        //         : checkSameDate(bidstart, bidend) ? "Start Date and End Date cannot be same"
        //             : !validateEndDate(bidstart, bidend) ? "End date cannot be before the start date." : null,
        // };
        // setErrors(newErrors);

        // if (validForm(newErrors)) {
        const data = {
            id: itemData?.id,
            auction_start: auction_start,
            auction_end: auction_end,
            status: 'approved'
        };
        let resdata = await approve_auction(data, navigate, localStorage.getItem('token'), dispatch, "approved");
        if (resdata?.status === true) {
            const productRef = ref(realdb, `products/${resdata?.data?.id}`);
            const detail = itemData;
            detail.status = "approved";
            await set(productRef, detail);
            navigate("/item-listing");
        }
        // }
    };



    useEffect(() => {
        if (!id) return;

        const handleFetch = async () => {
            const data = await auction_details(id, localStorage.getItem('token'), dispatch);
            setItemData(data);
            setFormData({
                bidstart: data?.auction_start ?? '',
                bidend: data?.auction_end ?? '',
            });
        };
        handleFetch();
    }, []);

    useEffect(() => {
        if (!itemData) return;
        // console.log(itemData.variants);
        const transformed = itemData?.variant_auction?.map(item => ({
            sizes: item?.sizes.map((itm) => ({
                label: itm?.size_name,
                value: itm?.size_name
            })),
            colors: item?.colors?.map((itm) => ({
                label: itm?.color_name,
                value: itm?.color_code
            })),
            ...item
        }));
        // console.log('transformaed', transformed, itemData?.variant_auction);

        setUpdatedVariants(transformed);
    }, [itemData]);

    // console.log(updatedVariants);

    // const deleteNewsletter = async () => {
    //     let isDeleted = await delete_newsletter_email(dispatch, accessToken, data?.id);
    //     if (isDeleted) {
    //         await get_newsletter_lists(accessToken, dispatch, 1, 10);
    //         setData(null);

    //     }
    // };

    //     const handleReject = (reason) => {
    //   console.log("Rejection reason:", reason);
    //   // Send to API here
    // };

    const handleRejectReason = async () => {
        if (!reason.trim()) {
            alert("Please enter a reason for rejection.");
            return;
        }
        // handleReject(reason);
        const data = {
            id: itemData?.id,
            status: 'cancelled',
            reason: reason
        };
        let resdata = await approve_auction(data, navigate, localStorage.getItem('token'), dispatch, "cancelled");
        if (resdata?.status === true) {
            setReason("");
            setReasonModal(false);
            navigate("/item-listing");
        }
        console.log("data", data)
    };


    return (
        <div>
            <div>
                <div className="profile-deatils bg-white mt-4">
                    <div className="detail-heading px-3 py-3">
                        <div className="d-flex gap-2 text-dark fw-600 h5 mb-0">
                            <span className="cursor-pointer" onClick={() => navigate('/item-listing')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                                </svg>
                            </span>
                            <h4 className="text-black mb-3 fw-600 fw-600">
                                Auction Details
                            </h4>
                        </div>{" "}
                    </div>
                    <div className="p-4">
                        <div className="row">
                            <form className='auction-detail' onSubmit={handleSubmit} noValidate>
                                <div className="mt-4">
                                    <div className="mb-3">
                                        <div className="row">
                                            <div className="col-md-6 col-lg-6">
                                                <label className="mb-2">
                                                    Seller Name
                                                </label>
                                                <div className="password position-relative">
                                                    <input
                                                        type="text"
                                                        name="itemname"
                                                        className="form-control"
                                                        disabled
                                                        placeholder="Item Name"
                                                        value={itemData?.seller?.user_name ?? ''}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-6">
                                                <label className="mb-2">
                                                    Seller Email
                                                </label>
                                                <div className="password position-relative">
                                                    <input
                                                        type="text"
                                                        name="itemname"
                                                        className="form-control"
                                                        disabled
                                                        placeholder="Item Name"
                                                        value={itemData?.seller?.email ?? ''}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="row">
                                            <div className="col-md-6 col-lg-6">
                                                <label className="mb-2">
                                                    Brand Name
                                                </label>
                                                <div className="password position-relative">
                                                    <input
                                                        type="text"
                                                        name="itemname"
                                                        className="form-control"
                                                        disabled
                                                        placeholder="Item Name"
                                                        value={itemData?.brand_name ?? ''}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-6">
                                                <label className="mb-2">
                                                    Title
                                                </label>
                                                <div className="password position-relative">
                                                    <input
                                                        type="text"
                                                        name="itemname"
                                                        className="form-control"
                                                        disabled
                                                        placeholder="Item Name"
                                                        value={itemData?.title ?? ''}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="row">
                                            <div className="col-md-6 col-lg-6">
                                                <label className="mb-2">
                                                    Article Number
                                                </label>
                                                <div className="password position-relative">
                                                    <input
                                                        type="text"
                                                        name="article_number"
                                                        className="form-control"
                                                        disabled
                                                        placeholder="Item Name"
                                                        value={itemData?.article_number ?? ''}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-lg-6">
                                                <label className="mb-2">
                                                    Condition
                                                </label>
                                                <div className="password position-relative">
                                                    <input
                                                        type="text"
                                                        name="condition"
                                                        className="form-control"
                                                        disabled
                                                        placeholder="Item Name"
                                                        value={itemData?.condition ?? ''}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="row">
                                            <div className="col-md-3 col-lg-3">
                                                <label className="mb-2">
                                                    Original Retail Price (€)
                                                </label>
                                                <div className="password position-relative">
                                                    <input
                                                        type="number"
                                                        name="reserveprice"
                                                        className="form-control"
                                                        disabled
                                                        placeholder=""
                                                        value={itemData?.original_retail_price ? Number(itemData?.original_retail_price) : 0}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* <div className="row mt-3">
                                        <h4 className="text-black mb-3 fw-600 fw-600">
                                            Images
                                        </h4>
                                        {itemData?.variants[0]?.images?.map((item, index) => (
                                            <div key={index} className="col-md-2">
                                                <div className=" position-relative pb-3 d-flex media-data-img-wrap">
                                                    <img
                                                        src={`${REACT_APP_IMAGE_URL}${item}` || "-"}
                                                        className="img-fluid object-fit-cover rounded"
                                                        height={50}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div> */}

                                    {updatedVariants?.length > 0 && <div className="mb-3">
                                        <h4 className="text-black mb-3 fw-600 fw-600">
                                            Variants
                                        </h4>
                                        {updatedVariants?.map((item, index) => (
                                            <>
                                                <div className="divided mb-3"></div>
                                                < div className="row" key={index} >
                                                    <div className='variant-box'>Variant {index + 1}</div>
                                                    <div className="col-md-12 col-lg-12 mb-3">
                                                        <label className="mb-2">
                                                            Color
                                                        </label>
                                                        <div className="d-flex gap-3 align-items-center">
                                                            {item?.colors?.map((itm) => (
                                                                <div>
                                                                    <div className='color-codebox' style={{ background: `${itm?.color_code}` }}></div>
                                                                    <p className='color-name'>{itm?.color_name}</p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                    <div className="col-md-12 col-lg-12 mb-3">
                                                        <label className="mb-2">
                                                            Sizes
                                                        </label>
                                                        {/* <div className="d-flex gap-3 align-items-center">
                                                            {item?.sizes.map((size, index) => (
                                                                <div className='size-codebox' key={index}>{size?.size_name}</div>
                                                            ))}
                                                        </div> */}

                                                        <div>
                                                            <div className="row g-3">
                                                                {item?.sizes?.map((sizeObj, i) => (
                                                                    <div className="col-6 col-md-4 col-lg-2" key={i}>
                                                                        <div
                                                                            className="card text-center shadow-sm border-0 h-100 size-card"
                                                                            style={{
                                                                                borderRadius: "10px",
                                                                                backgroundColor: "#f8f9fa",
                                                                            }}
                                                                        >
                                                                            <div className="card-body py-3">
                                                                                <h5 className="card-title mb-2 fw-semibold" style={{ color: "#333" }}>
                                                                                    {sizeObj?.size_name}
                                                                                </h5>
                                                                                <span
                                                                                    className={`badge ${sizeObj?.quantity > 5
                                                                                        ? "bg-success"
                                                                                        : sizeObj?.quantity > 0
                                                                                            ? "bg-warning text-dark"
                                                                                            : "bg-danger"
                                                                                        }`}
                                                                                >
                                                                                    {sizeObj?.quantity} in stock
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {item?.specific_color &&
                                                            <div className="col-md-12 mt-3">
                                                                <label className="mb-2">Specific Color</label>
                                                                <div className="inputfield">
                                                                    <span>{item?.specific_color}</span>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className='row mt-3'>
                                                            {item?.pattern &&
                                                                <div className="col-md-6">
                                                                    <label className="mb-2">Pattern</label>
                                                                    <div className="inputfield">
                                                                        <span>{item?.pattern}</span>
                                                                    </div>
                                                                </div>
                                                            }
                                                            {item?.finish &&
                                                                <div className="col-md-6">
                                                                    <label className="mb-2">Finish</label>
                                                                    <div className="inputfield">
                                                                        <span>{item?.finish}</span>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    {item?.thumbnail &&
                                                        <div className="col-md-12 col-lg-12">
                                                            <label className="mb-2">Thumbnail Image</label>
                                                            <div className="thumbnail-box">
                                                                <img
                                                                    src={`${REACT_APP_IMAGE_URL}${item?.thumbnail}`}
                                                                    className="thumbnail-img"
                                                                />
                                                            </div>
                                                        </div>}
                                                    <div className="col-md-12 col-lg-12">
                                                        <label className="mb-2 mt-3">Variant Images</label>
                                                        <div className="d-flex flex-row flex-wrap gap-3">
                                                            {item?.images?.map((item, index) => (
                                                                <div key={index} className="">
                                                                    <div className=" position-relative pb-3 d-flex media-data-img-wrap">
                                                                        <img
                                                                            src={`${REACT_APP_IMAGE_URL}${item}`}
                                                                            className="item-img"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div >
                                            </>
                                        ))}
                                    </div>}
                                </div>

                                <div>
                                    <span className='fw-bold text-danger'>Note : The auction will start on the 1st of every month at 8:00 PM and will end on the 4th at 8:00 PM.</span>
                                </div>

                                {/* <div className="mt-4">
                                    <h4 className="text-black mb-2 fw-600">Media Data</h4>
                                    <div className="mb-4">
                                        <div className="row">
                                            <div className="col-md-12 col-lg-12">
                                                <label className="text-dark fw-600 mb-2">Image</label>
                                                <div className="row mt-3">
                                                    {itemData?.image_urls?.map((item, index) => (
                                                        <div key={index} className="col-md-2">
                                                            <div className=" position-relative pb-3 d-flex media-data-img-wrap">
                                                                <img
                                                                    src={`${REACT_APP_IMAGE_URL}${item}`}
                                                                    className="img-fluid object-fit-cover rounded"
                                                                    height={50}
                                                                // width={'100%'}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {/* {itemData?.status === "pending" && itemData?.auction_start == null &&
                                    itemData?.auction_end == null && ( */}
                                {/* <div>
                                    <h4 className="text-black mb-3 fw-600">Bid Timing</h4>
                                    <div className="mb-3">
                                        <div className="row">
                                            <div className="col-md-4 col-lg-4">
                                                <div className="password position-relative">
                                                    <label className="text-dark fw-600 mb-1">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        name="bidstart"
                                                        className="form-control "
                                                        value={
                                                            itemData?.status !== "pending" ?
                                                                (itemData?.auction_start ? new Date(itemData?.auction_start).toISOString().slice(0, 16) : "")
                                                                :
                                                                formdata?.bidstart
                                                        }
                                                        min={getMinDate()}
                                                        onChange={handleDateChange}
                                                        disabled={itemData?.status !== "pending"}
                                                    />
                                                </div>
                                                {errors?.bidstart && (
                                                    <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                                                        {errors?.bidstart}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-md-4 col-lg-4">
                                                <div className="password position-relative">
                                                    <label className="text-dark fw-600 mb-1">
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        name="bidend"
                                                        className="form-control "
                                                        value={
                                                            itemData?.status !== "pending" ?
                                                                (itemData?.auction_end ? new Date(itemData?.auction_end).toISOString().slice(0, 16) : "")
                                                                :
                                                                formdata?.bidend
                                                        }
                                                        min={getMinEndDate(formdata?.bidstart)}
                                                        onChange={handleDateChange}
                                                        disabled={itemData?.status !== "pending"}
                                                    />
                                                </div>
                                                {errors?.bidend && (
                                                    <p className="d-flex flex-start text-danger error_msg mb-1 mb-md-0">
                                                        {errors?.bidend}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {/* )} */}
                                {itemData?.status === "pending" &&
                                    <div className="col-md-12 col-lg-12">
                                        <div className="d-flex gap-3 pt-4">
                                            <button
                                                className="btn common-button"
                                                type="submit"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                type='button'
                                                className="reject-btn"
                                                // onClick={handleCancel} 
                                                onClick={() => { setReasonModal(true); }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                }
                            </form>
                        </div>
                    </div>
                </div >
            </div >

            <Modal open={reasonModal} onClose={() => setReasonModal(false)}>
                <ModalDialog>
                    <DialogTitle>Reject Auction</DialogTitle>
                    <DialogContent>
                        <div className="reject-reason-container">
                            <label htmlFor="reason" className="reject-reason-label">
                                Reason for Rejection *
                            </label>
                            <textarea
                                name="reason"
                                id="reason"
                                className="reject-reason-textarea"
                                placeholder="Please explain your reason..."
                                rows="5"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                            </textarea>
                        </div>


                    </DialogContent>
                    <Box>
                        <div className='d-flex gap-2'>
                            <button className='model-no-btn' onClick={() => { setReasonModal(false); }}>Cancel</button>
                            <button
                                className={`model-yes-btn ${!reason.trim() && 'modal-yes-btn-disable'}`}
                                type="submit"
                                onClick={handleRejectReason}
                                disabled={!reason.trim()}
                            >
                                Reject
                            </button>

                        </div>
                    </Box>
                </ModalDialog>
            </Modal>

        </div >
    );
};

export default ApproveAuction;