import { DialogTitle, FormControl, Input } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Button, Form, FormLabel, Modal } from "react-bootstrap";
import context from "react-bootstrap/esm/AccordionContext";
import ReactQuill from "react-quill";
import { create_faq_question, get_all_faq_questions } from "../reduxData/cms/cmsAction";
import { connect, useDispatch } from "react-redux";

const AddQuestion = ({ show, handleClose, editData }) => {
    const [formData, setFormData] = useState({
        question: '',
        type: '',
        status: false,
    });
    const [errors, setErrors] = useState({
        question: '',
        answer: '',
        type: ''
    });
    const [contentData,setContentData] = useState({
        answer: '',
    });
    const [isFocus,setIsFocus] = useState(false);

    const dispatch = useDispatch();
    let currentPage = JSON.parse(localStorage.getItem("currentQuest"));

    const questionType = [
        // { label: 'General', value: 'general' },
        { label: 'Seller', value: 'seller' },
        { label: 'Buyer', value: 'buyer' },
    ];

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'question':
                setErrors({ ...errors, question: !value ? "Question is required" : null });
                setFormData({ ...formData, question: value });
                break;
            case 'type':
                setErrors({ ...errors, type: !value ? "Question Type is required" : null });
                setFormData({ ...formData, type: value });
                break;
            default:
                setFormData({ ...formData, [name]: value });
                break;
        }
    };

    const handleQuillChange = (value,label) => {

        if(isFocus) {
            setErrors({ ...errors, [label]: !value || value === '<p><br></p>' ? "Answer is required" : null });
        }
       
        setContentData({ ...contentData, [label]: value });
    };

    const handleStatus = (e) => {
        const { checked } = e.target;
        if(checked){
            setFormData({ ...formData, status: true });
        } else {
            setFormData({ ...formData, status: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { question, type } = formData;
        const { answer } = contentData;
        setErrors({
            ...errors,
            question: !question ? "Question is required" : null,
            answer: !answer || answer === '<p><br></p>' ? "Answer is required" : null,
            type: !type ? "Question Type is required" : null
        });
        if (question && answer && type) {
            const quest_data = {
                name: "FAQ",
                type: formData.type,
                status: formData.status,
                content : {
                    question : formData.question,
                    answer : contentData.answer,
                }
            };
         let question_created = await create_faq_question(localStorage.getItem("token"),quest_data,editData?.id, dispatch);
         if(question_created){
            await get_all_faq_questions(localStorage.getItem("token"), (currentPage ?? 'seller'), dispatch);
            handleCancel();
         }
        }
    };

    useEffect(() => {
        if(editData){
            setFormData(prev => {
                return ({
                    ...prev,
                question: editData?.content?.question || '', 
                type: editData?.type || '', 
                status: editData?.status || false, 
                })
            });
            setContentData( prev => { return ({ ...prev, answer: editData?.content?.answer || '', }) });
            setErrors({ ...errors, question: '', answer: '', type: '' });
        } else if (editData === null) {
            setFormData({ ...formData, question: '', type: '', status: false });
            setContentData({ ...contentData, answer: '' });
            setErrors({ ...errors, question: null, answer: null, type: null });
        }
    }, [editData]);

    const handleCancel = () => {
        setFormData({ ...formData, question: '', type: '', status: false });
        setContentData({ ...contentData, answer: '' });
        setErrors({ ...errors, question: '', answer: '', type: '' });
        setIsFocus(false);
        handleClose();
    };

    return (
        <Modal show={show} size="lg">
            <Modal.Body>
                <DialogTitle>{editData ? 'Edit' : 'Add'} Question</DialogTitle>
                <Form onSubmit={handleSubmit}>
                    <FormControl className="mt-1 mb-2">
                        <FormLabel className="fw-600">Type <span style={{ color: 'red' }}>*</span></FormLabel>
                        <select
                            name="type"
                            className="form-control"
                            value={formData.type}
                            style={{ appearance: 'auto' }}
                            onChange={handleChange}
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            {questionType?.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors?.type && <div className="error_msg">{errors?.type}</div>}
                    </FormControl>
                    <FormControl className="mt-1 mb-2">
                        <FormLabel className="fw-600">Question <span style={{ color: 'red' }}>*</span></FormLabel>
                        <Input
                            type="text"
                            name="question"
                            placeholder="Enter question"
                            value={formData.question}
                            onChange={handleChange}
                        />
                        {errors?.question && <div className="error_msg">{errors?.question}</div>}
                    </FormControl>
                    <FormControl className="mt-1 mb-2">
                        <FormLabel className="fw-600">Answer <span style={{ color: 'red' }}>*</span></FormLabel>
                        <ReactQuill
                            name="answer"
                            value={contentData?.answer}
                            modules={modules}
                            onFocus={() => setIsFocus(true)}
                            onChange={(value) => handleQuillChange(value, 'answer')}
                        />
                        {errors?.answer && <div className="error_msg">{errors?.answer}</div>}
                    </FormControl>
                    <FormControl className="mt-1 mb-2">
                        <FormLabel className="fw-600">Status</FormLabel>
                        <div class="form-check form-switch switch-large">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={formData.status} onChange={handleStatus} />
                        </div>
                    </FormControl>
                    <Button type="submit" className="btn common-button">Save</Button>{" "}
                    <Button className="question-button" variant="danger" onClick={handleCancel}>Cancel</Button>
                </Form>
            </Modal.Body>
        </Modal >
    )
};

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        editData: state.cms.editData
    }
};

export default connect(mapStateToProps)(AddQuestion);
