import React from "react";
import { Button, Modal } from "react-bootstrap";
import { delete_badge, delete_faq_question, delete_user, get_badge_lists } from "../reduxData/user/userAction";
import { useDispatch } from "react-redux";
import { get_all_faq_questions } from "../reduxData/cms/cmsAction";

const DeleteContent = ({show,handleClose,data,heading,otherLine,isFaq,currentQuest}) => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        if(isFaq==='userDelete'){
            let faq_delete = await delete_user(dispatch,localStorage.getItem("token"),data?.id);
            if(faq_delete) {
                handleClose();
            }
        }else if(isFaq) {
            let faq_delete = await delete_faq_question(localStorage.getItem("token"),data?._id, dispatch);
            if(faq_delete) {
                await get_all_faq_questions(localStorage.getItem("token"), currentQuest, dispatch);
                handleClose();
            }
        } else if(isFaq !==true) {
            let is_delete = await delete_badge(localStorage.getItem("token"),data?._id, dispatch);
            if(is_delete){
                await get_badge_lists(localStorage.getItem("token"), dispatch);
                handleClose();
            }  
        }
    };

    return (
        <Modal show={show} centered>
            <Modal.Body>
                <Modal.Title>Delete {heading}</Modal.Title>
                    <span className="fw-200 mt-1">
                        Are you sure you want to delete {otherLine}.
                    </span>
                <div className="d-flex justify-content-space-between gap-2 mt-3">
                    <Button type="submit" className="btn common-button" onClick={handleClose}>Cancel</Button>
                    <Button className="question-button" variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default DeleteContent;

