import React from "react";
import { Button, Modal } from "react-bootstrap";
import DefaultImg from "../images/no_profile.png";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const UserDetails = ({ show, handleClose, user }) => {
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="col-12 mb-3">
                            <img
                                src={
                                    user?.profile_pic ? `${REACT_APP_IMAGE_URL}${user?.profile_pic}` : DefaultImg
                                }
                                style={{ width: 100, height: 100, borderRadius: 75, border: '2px solid #ddd' }}
                                className="object-fit-cover "
                            />
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Name:</strong> {user?.user_name ?? 'N/A'}
                            </div>
                            <div className="col-md-6">
                                <strong>Email:</strong> {user?.email ?? 'N/A'}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Store Name:</strong> {user?.store_name && user?.store_name !== "" ? user?.store_name : 'N/A'}
                            </div>
                            <div className="col-md-6">
                                <strong>Phone No:</strong>
                                {user?.country_code
                                    ?
                                    <span>{user?.country_code} {user?.phone_no}</span>
                                    :
                                    ' N/A'
                                }
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Location:</strong> {user?.location ?? 'N/A'}
                            </div>
                            <div className="col-md-6">
                                <strong>KYC No:</strong> {user?.kyc_no ?? 'N/A'}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Promoted:</strong> {user?.promoted ? "Yes" : "No"}
                            </div>
                            <div className="col-md-6">
                                <strong>Email Verified:</strong> {user?.email_verify ? "Yes" : "No"}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Account ID:</strong> {user?.account_id ?? 'N/A'}
                            </div>
                            <div className="col-md-6">
                                <strong>Created At:</strong>{" "}
                                {new Date(user?.created_at).toLocaleString()}
                            </div>
                        </div>
                        {(user && user?.role === 'seller' && user?.promoted) &&
                            <>
                                <div className="divided"></div>
                                <div className="mb-3 d-flex flex-column">
                                    <label className="form-label fw-600">Company Logo</label>
                                    <img
                                        src={
                                            user?.company_logo ? `${REACT_APP_IMAGE_URL}${user?.company_logo}` : DefaultImg
                                        }
                                        style={{ width: 100, height: 100, borderRadius: 75, border: '2px solid #ddd' }}
                                        className="object-fit-cover "
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-600">Bio</label>
                                    <div className="password position-relative">
                                        <textarea
                                            name="notes"
                                            cols="4"
                                            rows="4"
                                            class="form-control b-0 text-area-height"
                                            placeholder="bio"
                                            style={{ height: '120px' }}
                                            value={user?.bio}
                                        ></textarea>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserDetails;