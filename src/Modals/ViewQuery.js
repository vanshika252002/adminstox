import React from 'react';
import { Modal } from 'react-bootstrap';

const ViewQuery = ({ show, handleClose, data }) => {
    return (
        <Modal
            show={show}
            // onHide={handleClose}
            className="modal-lg auction-item-detail-popup"
        >
            <Modal.Body>
                <div>
                    <div className="col-md-12 col-lg-12 text-end">
                        <i
                            class="fa-solid fa-xmark color-white cursor-pointer"
                            onClick={handleClose}
                        ></i>
                    </div>
                    <div className="profile-deatils bg-white mt-4">
                        <div className="detail-heading px-4 py-3">
                            <div className="text-dark fw-600 h5 mb-0">Query Details</div>{" "}
                        </div>
                        <div className="p-4">
                            <div className="row">
                                <div className="col-md-6 col-lg-6">
                                    <label className="text-dark fw-600 mb-2">
                                        Name
                                    </label>
                                    <div className="password position-relative">
                                        <input
                                            type="text"
                                            name="itemname"
                                            className="form-control"
                                            disabled
                                            value={data?.name}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6">
                                    <label className="text-dark fw-600 mb-2">
                                        Email
                                    </label>
                                    <div className="password position-relative">
                                        <input
                                            type="email"
                                            name="itemname"
                                            className="form-control"
                                            disabled
                                            value={data?.email}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 col-lg-12 my-2">
                                    <label className="text-dark fw-600 mb-2">
                                        Message
                                    </label>
                                        <div className="message-text-area">{data?.message}</div>
                                </div>
                                <div className="col-md-6 col-lg-6">
                                    <label className="text-dark fw-600 mb-2">
                                        Created At
                                    </label>
                                    <div className="password position-relative">
                                        <input
                                            type="date"
                                            name="date"
                                            className="form-control"
                                            disabled
                                            value={data?.created_at ? new Date(data.created_at).toISOString().split("T")[0] : ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default ViewQuery;