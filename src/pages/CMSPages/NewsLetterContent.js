import { FormControl, FormLabel, Input } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import { create_faq_question, get_all_faq_questions } from "../../reduxData/cms/cmsAction";
import { connect, useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const NewsLetterContent = ({ newsletter_content }) => {
    const [formData, setFormData] = useState({
        heading: '',
        status: false,
    });
    const [contentData,setContentData] = useState({
        content: '',
    });
    const [errors, setErrors] = useState({
        heading: '',
        content: '',
    });
    const dispatch = useDispatch();
    const {user}=useSelector(state=>state.auth);
    const [isPermission,setIsPermission]=useState(false);
    useEffect(()=>{
        setIsPermission(((((user?.role==='staff') && (user?.permission?.p_staff>1)) || (user?.role!=='staff')))?true:false);
    },[user]);
    const modules = {
        toolbar: [
            [{ 'font': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'video'],
        ]
    };

    const handleChange = (value, label) => {
        switch (label) {
            case 'heading':
                setErrors({ ...errors, heading: !value || value === '' ? "Heading is required" : null });
                setFormData({ ...formData, heading: value });
                break;
            case 'status':
                setFormData({ ...formData, status: value ? true : false });
            default:
                setFormData({ ...formData, [label]: value });
                break;
        }
    };

    const handleQuillChange = (value) => {
        setErrors({ ...errors, content: !value || value === '<p><br></p>' ? "Content is required" : null });
        setContentData({ ...contentData, content: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { heading } = formData;
        setErrors({
            ...errors,
            heading: !heading ? 'Heading is required' : null,
            content: !contentData.content || contentData.content === '<p><br></p>' ? 'Content is required' : null,
        });
        if (heading && contentData?.content) {
            const content_data = {
                name: "newsletter_content",
                type: "newsletter_content",
                status: formData?.status,
                content: {
                    heading: formData?.heading,
                    content: contentData?.content,
                }
            };
            const contentId = newsletter_content ? newsletter_content?.id : null;
            await create_faq_question(localStorage.getItem("token"), content_data, contentId, dispatch);
            await get_all_faq_questions(localStorage.getItem("token"), "newsletter_content", dispatch);
        }
    };

    useEffect(() => {
        const handleQuest = async () => {
            await get_all_faq_questions(localStorage.getItem("token"), "newsletter_content", dispatch);
        };
        handleQuest();
    }, [dispatch]);

    useEffect(() => {
        if (newsletter_content) {
            setFormData({
                heading: newsletter_content?.content?.heading || '',
                status: newsletter_content?.status || false,
            });
            setContentData({ content: newsletter_content?.content?.content });
        }
    }, [newsletter_content]);

    return (
        <div className="container">
            <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <h4 className="mb-0 fw-bold">NewsLetter Content</h4>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div>
                            <Form onSubmit={handleSubmit}>
                                <FormControl className="mt-2 mb-2">
                                    <FormLabel className="fw-600">Heading</FormLabel>
                                    <Input
                                        type="text"
                                        name="heading"
                                         placeholder="Enter heading."
                                        value={formData.heading}
                                        disabled={!isPermission}
                                        onChange={(e) => handleChange(e.target.value, 'heading')}
                                    />
                                    {errors?.heading && <div className="error_msg">{errors?.heading}</div>}
                                </FormControl>
                                <FormControl className="mt-2 mb-2">
                                    <FormLabel className="fw-600">Content</FormLabel>
                                    <ReactQuill
                                        name="answer"
                                        value={contentData.content}
                                        modules={modules}
                                        disabled={!isPermission}
                                        onChange={handleQuillChange}
                                    />
                                    {errors?.content && <div className="error_msg">{errors?.content}</div>}
                                </FormControl>
                                <FormControl className="mt-2 mb-2">
                                    <FormLabel className="fw-600">Status</FormLabel>
                                    <div class="form-check form-switch switch-large">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            name="status"
                                            role="switch"
                                            id="flexSwitchCheckDefault"
                                            checked={formData.status}
                                            disabled={!isPermission}
                                            onChange={(e) => handleChange(e.target.checked, 'status')}
                                        />
                                    </div>
                                </FormControl>
                                <Button type="submit" className="btn common-button" disabled={!isPermission}>Save</Button>
                            </Form>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        newsletter_content: state.cms.newsletter_content,
    }
};

export default connect(mapStateToProps)(NewsLetterContent);
