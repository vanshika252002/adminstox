import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { user_logout } from "../reduxData/auth/authAction";

const Logout = ({show,handleClose}) => {
    const { accessToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        let isLogout = await user_logout(dispatch, localStorage.getItem('token'));
        if(isLogout === true){
            localStorage.clear();
            handleClose();
        }
    };

    return (
        <Modal show={show} centered>
            <Modal.Body>
                <Modal.Title>Logout</Modal.Title>
                    <span className="fw-200 mt-1">
                        Are you sure you want to Logout ?
                    </span>
                <div className="d-flex justify-content-space-between gap-2 mt-3">
                    <Button type="submit" className="btn common-button" onClick={handleClose}>Cancel</Button>
                    <Button className="question-button" variant="danger" onClick={handleLogout}>Logout</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default Logout;

