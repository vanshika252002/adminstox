import React from "react";
import { Button, Modal } from "react-bootstrap";
import DefaultImg from "../images/no_profile.png";

const { REACT_APP_BASE_URL, REACT_APP_IMAGE_URL } = process.env;

const SellerProfile = ({ show, handleClose, seller }) => {
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered size="lg" backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Seller Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="col-12 mb-3">
                            <img
                                src={
                                    seller?.profile_pic ? `${REACT_APP_IMAGE_URL}${seller?.profile_pic}` : DefaultImg
                                }
                                style={{ width: 100, height: 100, borderRadius: 75, border: '2px solid #ddd' }}
                                className="object-fit-cover "
                            />
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Name:</strong> {seller?.user_name ?? 'N/A'}
                            </div>
                            <div className="col-md-6">
                                <strong>Email:</strong> {seller?.email ?? 'N/A'}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Store Name:</strong> {seller?.store_name && seller?.store_name !== "" ? seller?.store_name : 'N/A'}
                            </div>
                            <div className="col-md-6">
                                <strong>Phone No:</strong> {seller?.country_code} {seller?.phone_no}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Location:</strong> {seller?.location ?? 'N/A'}
                            </div>
                            <div className="col-md-6">
                                <strong>KYC No:</strong> {seller?.kyc_no ?? 'N/A'}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Promoted:</strong> {seller?.promoted ? "Yes" : "No"}
                            </div>
                            <div className="col-md-6">
                                <strong>Email Verified:</strong> {seller?.email_verify ? "Yes" : "No"}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <strong>Account ID:</strong> {seller?.account_id ?? 'N/A'}
                            </div>
                            <div className="col-md-6">
                                <strong>Created At:</strong>{" "}
                                {new Date(seller?.created_at).toLocaleString()}
                            </div>
                        </div>
                        {(seller?.promoted) &&
                            <div className="mb-3 d-flex flex-column">
                                <label className="form-label fw-600">Company Logo</label>
                                <img
                                    src={
                                        seller?.company_logo ? `${REACT_APP_IMAGE_URL}${seller?.company_logo}` : DefaultImg
                                    }
                                    style={{ width: 100, height: 100, borderRadius: 75, border: '2px solid #ddd' }}
                                    className="object-fit-cover "
                                />
                            </div>}
                        {(seller?.promoted) &&
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
                                        value={seller?.bio}
                                    ></textarea>
                                </div>
                            </div>}
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

export default SellerProfile;