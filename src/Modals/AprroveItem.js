import React from "react";
import { Button, Modal } from "react-bootstrap";
import { approve_auction, get_all_sell_Item } from "../reduxData/user/userAction";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const AprroveItem = ({show,handleClose,itemid}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeItemStatus = async () => {
        const itemdata = {
            itemId : itemid?._id,
            status: true,
        };
        await approve_auction(itemdata, navigate, localStorage.getItem('token'), dispatch);
        await get_all_sell_Item(localStorage.getItem("token"),dispatch,1,10,'pending');
        handleClose();
        // if (data?.data?.status) {
        //     await get_all_sell_Item(localStorage.getItem("token"),dispatch,1,10,'pending');
        //     handleClose();
        // }
      };
    return (
        <Modal show={show} onHide={handleClose} className="logout-popup modal-border">
        <Modal.Body>
          <div className="px-5 py-4">
            <p className="h5 mb-0">Do you really want to Approve <span className="text-dark fw-600 h5 mb-0">"{itemid?.item_name}"</span> ?</p>
            <div className="d-flex gap-2 mt-5 pt-1">
              <div className="col-md-6 col-6">
                <Button variant="light" className="w-100 rounded-pill btn-outline-dark" onClick={changeItemStatus}>
                  Yes
                </Button>
              </div>
              <div className="col-md-6 col-6">
                <Button variant="light" className="w-100 rounded-pill btn-outline-dark" onClick={handleClose}>
                  No
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
};

export default AprroveItem;

