import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { approve_auction, get_all_sell_Item, unapprove_auction } from "../reduxData/user/userAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const RejectItem = ({show,handleClose,itemid}) => {
    const [formdata,setFormdata] = useState({
        message:''
    });
    const [errors,setErrors]=useState({
        message: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const {name,value}=e.target;
        setErrors({...errors, [name]:value===''?'Specify the reason':null});
        setFormdata({...formdata, [name]:value});
    };

    const handleReject = async(e) => {
        e.preventDefault();
        const {message} = formdata;
        setErrors({
            message: !message ? 'Specify the reason' : null,
        });
        if(message){
            const itemdata = {
                itemId : itemid?._id,
                status: false,
                message: formdata?.message
            };
            let data = await unapprove_auction(itemdata, navigate, localStorage.getItem('token'), dispatch);
           
            if (data?.data?.status) {
                await get_all_sell_Item(localStorage.getItem("token"),dispatch,1,10,'pending');
                handleFormClose();
            }
        }
    };

    const handleFormClose = () => {
        setFormdata({ ...formdata, message: '' });
        setErrors({ ...errors, message: '' });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleFormClose}>
            <Modal.Body>
            <div className="px-4 py-4">
                    <h5 className="mb-0 fw-bold">Specify the reason!</h5>
                    <div className="form-group col-md-12 mt-2">
                        <textarea type="text" name="message" className="form-control bg-light-white" value={formdata.message} onChange={handleInputChange}></textarea>
                        {errors.message && <p className="d-flex flex-start text-danger error-msg mb-1 mb-md-0">{errors.message}</p>}
                    </div>
                    <div className="d-flex gap-2 mt-3">
                        <div className="col-md-6">
                            <Button
                                variant="light"
                                className="w-100 rounded-pill btn-outline-dark"
                                onClick={handleReject}
                            >
                              Unapproved
                            </Button>
                        </div>
                        <div className="col-md-6">
                            <Button
                                variant="light"
                                className="w-100 rounded-pill btn-outline-dark"
                                onClick={() => handleFormClose()}
                            >
                                No
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default RejectItem;
