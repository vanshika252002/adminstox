import React, { useEffect, useState } from "react";
import AddQuestion from "../../Modals/AddQuestion";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { create_faq_question, get_all_faq_questions, get_faq_data, update_items_sequence } from "../../reduxData/cms/cmsAction";
import EmptyData from "../../components/EmptyData";
import { GET_EDIT_DATA } from "../../reduxData/cms/cmsTypes";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DeleteContent from "../../Modals/DeleteContent";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const FAQ = ({ user, faqItems, faqcontent }) => {
    const [isShow, setIsShow] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [editdata, setEditdata] = useState(null);
    const dispatch = useDispatch();
    var currentPage = JSON.parse(localStorage.getItem("currentQuest"));
    const [currentQuest, setCurrentQuest] = useState("seller");
    const [isPermission, setIsPermission] = useState(false);
    const [isPermissionDelete, setIsPermissionDelete] = useState(false);

    const modules = {
        toolbar: [
            [{ font: [] }, { size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
            [{ script: "sub" }, { script: "super" }],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }, { align: [] }],
            [{ color: [] }, { background: [] }],
            ["link", "image", "video"],
            ["clean"],
            [{ undo: "undo" }, { redo: "redo" }],
        ],
        history: { delay: 1000, maxStack: 100, userOnly: true },
    };
    const [faqContent, setFaqContent] = useState("");
    const [faqStatus, setFaqStatus] = useState(false);
    const handleQuillChange = (value) => {
        // setErrors({
        //   ...errors,
        //   content: !value || value === "<p><br></p>" ? "Content is required" : null,
        // });
        setFaqContent(value);
    };
    const handleFaqStatus = (e) => {
        const { checked } = e.target;
        if(checked){
            setFaqStatus(true);
        } else {
            setFaqStatus(false);
        }
    };

    const handleSubmit = async () => {
        if(!faqContent || faqContent === "<p><br></p>" || faqContent === "") {
            toast.error("Content is required!", { autoClose: 1500, toastId: "toatidff" });
            return;
        }

        const quest_data = {
            name: "faqContent",
            type: "faqContent",
            status: Boolean(faqStatus),
            content: { content: faqContent, },
        };
    
          const contentId = faqcontent ? faqcontent?.id : null;
          await create_faq_question(localStorage.getItem("token"), quest_data, contentId, dispatch);
    };

    useEffect(() => {
        const fetchFaq = async () => {
            await get_faq_data(localStorage.getItem("token"), "faqContent", dispatch);
        };
        fetchFaq();
    }, []);
    useEffect(() => {
        if (faqcontent) {
            setFaqContent(faqcontent?.content?.content);
            setFaqStatus(faqcontent?.status);
        }
    }, [faqcontent]);
    // faq content end

    useEffect(() => {
        setIsPermission(((((user?.role === 'staff') && (user?.permission?.p_staff > 1)) || (user?.role !== 'staff'))) ? true : false);
        setIsPermissionDelete(((((user?.role === 'staff') && (user?.permission?.p_staff > 2)) || (user?.role !== 'staff'))) ? true : false);
    }, [user]);
    useEffect(() => {
        if (currentPage) {
            setCurrentQuest(currentPage);
        } else {
            setCurrentQuest("seller");
        }
    }, []);

    useEffect(() => {
        const handleQuest = async () => {
            await get_all_faq_questions(localStorage.getItem("token"), currentQuest, dispatch);
        };
        handleQuest();
    }, [currentQuest]);

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        let items = Array.from(faqItems);
        const [reordereditem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordereditem);
        const updated_sequence = {
            sequence: items?.map((item) => item?._id)
        };
        let updated = await update_items_sequence(localStorage.getItem("token"), updated_sequence, currentQuest, dispatch);
        if (updated) await get_all_faq_questions(localStorage.getItem("token"), currentQuest, dispatch);
    };

    const handleToogle = async (status, item) => {

        const quest_data = {
            name: "FAQ",
            type: item.type,
            status: item.status === true ? false : true,
            content: {
                question: item?.content?.question,
                answer: item?.content?.answer,
            }
        };

        let question_created = await create_faq_question(localStorage.getItem("token"), quest_data, item?.id, dispatch);
        if (question_created) {
            await get_all_faq_questions(localStorage.getItem("token"), currentQuest, dispatch);
        }
    };

    return (
        <div className="mt-1">
            <div className="container ">
                <h3 className="fw-500">FAQ's</h3>
                <div className="mb-5">
                    <h5>Faq Content</h5>
                    <div className="col-12 mb-3">
                        <ReactQuill
                            name="answer"
                            value={faqContent}
                            modules={modules}
                            // onFocus={() => setIsFocus(true)}
                            onChange={(value) => handleQuillChange(value, 'answer')}
                        />
                    </div>
                    <div className="col-6 mb-3">
                        <div class="form-check form-switch switch-large">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={faqStatus} onChange={handleFaqStatus} />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="btn common-button"
                        disabled={!isPermission}
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                </div>

                <div className="d-flex justify-content-between">
                    <div className="col-lg-4 col-md-6 pt-2">
                        <div className="text-md-end">
                            <ul className="list-inline mb-0 sorting-list">
                                {/* <li className="list-inline-item mb-2 mb-md-0">
                                    <Link
                                        className={`text-decoration-none border rounded-pill px-3 py-2 ${currentQuest === 'general' ? 'active' : ''}`}
                                        onClick={() => { setCurrentQuest("general"); localStorage.setItem("currentQuest", JSON.stringify("general")); }}
                                    >
                                        General
                                    </Link>
                                </li> */}
                                <li className="list-inline-item mb-2 mb-md-0">
                                    <Link
                                        className={`text-decoration-none border rounded-pill px-3 py-2 ${currentQuest === 'seller' ? 'active' : ''}`}
                                        onClick={() => { setCurrentQuest("seller"); localStorage.setItem("currentQuest", JSON.stringify("seller")); }}
                                    >
                                        Seller
                                    </Link>
                                </li>
                                <li className="list-inline-item mb-2 mb-md-0">
                                    <Link
                                        className={`text-decoration-none border rounded-pill px-3 py-2 ${currentQuest === 'buyer' ? 'active' : ''}`}
                                        onClick={() => { setCurrentQuest("buyer"); localStorage.setItem("currentQuest", JSON.stringify("buyer")); }}
                                    >
                                        Buyer
                                    </Link>
                                </li>
                            </ul>
                        </div>{" "}
                    </div>
                    <button className="btn common-button" disabled={!isPermission} onClick={() => { setIsShow(true); }}>Add New Question</button>
                </div>

                <div className="col-lg-12 mt-2">
                    <h5 className="fw-500">
                        {currentQuest === "seller" ? 'Seller' : currentQuest === "buyer" ? 'Buyer' : 'General'} Questions
                    </h5>
                    <div className="table-responsive mt-4">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="faqlist">
                                {(provided) => (
                                    <table className="table table-hover user-management-table" {...provided.droppableProps} ref={provided.innerRef}>
                                        <thead className="border-gray">
                                            <th>#</th>
                                            <th>Question</th>
                                            <th>Status</th>
                                            {isPermission && <th>Action</th>}
                                        </thead>
                                        <tbody>
                                            {faqItems?.length > 0 ?
                                                faqItems?.map((item, index) => (
                                                    <Draggable key={item?._id} draggableId={item?._id} index={index}>
                                                        {(provided) => (
                                                            <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <td>{index + 1}.</td>
                                                                <td>{item?.content?.question}</td>
                                                                <td>
                                                                    <div class="form-check form-switch switch-large">
                                                                        <input
                                                                            class="form-check-input"
                                                                            type="checkbox"
                                                                            role="switch"
                                                                            id="flexSwitchCheckDefault"
                                                                            checked={item?.status}
                                                                            disabled={!isPermission}
                                                                            onChange={(e) => handleToogle(e.target.value, item)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                {isPermission && <td className="d-flex pt-4">
                                                                    <div onClick={() => { dispatch({ type: GET_EDIT_DATA, payload: item }); setIsShow(true); }}>
                                                                        <i className="cursor-pointer mx-2 far fa-edit edit" />
                                                                    </div>
                                                                    {!isPermissionDelete && <div>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="currentColor"
                                                                            viewBox="0 0 16 16"
                                                                            className="cursor-pointer delete-icon bi bi-trash3-fill"
                                                                            onClick={() => { setEditdata(item); setIsDelete(true); }}
                                                                        >
                                                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                                                        </svg>
                                                                    </div>}
                                                                </td>}
                                                            </tr>
                                                        )}
                                                    </Draggable>
                                                ))
                                                :
                                                <EmptyData />
                                            }
                                        </tbody>
                                    </table>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>
            <AddQuestion show={isShow} handleClose={() => { dispatch({ type: GET_EDIT_DATA, payload: null }); setIsShow(false); }} />
            <DeleteContent
                show={isDelete}
                handleClose={() => { setEditdata(null); setIsDelete(false); }}
                data={editdata}
                heading={currentQuest === "seller" ? 'Seller FAQ' : currentQuest === "buyer" ? 'Buyer FAQ' : 'General FAQ'}
                otherLine={"question"}
                isFaq={true}
                currentQuest={currentQuest}
            />
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        faqItems: state.cms.faqItems,
        faqcontent: state.cms.faqContent
    }
};

export default connect(mapStateToProps)(FAQ);
