import { FormControl } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import ReactQuill from "react-quill";
import { connect, useDispatch } from "react-redux";
import { create_faq_question, get_about_data } from "../../reduxData/cms/cmsAction";
import { useSelector } from "react-redux";

const normalizeStatus = (v) => {
  // Converts many possible API shapes into a strict boolean
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  return false;
};


const AboutUsContent = () => {
    const [formData, setFormData] = useState({
        content: '',
        status: false,
    });
    const [errors, setErrors] = useState({
        content: '',
    });

    const { user } = useSelector(state => state.auth);
    const { aboutusdata } = useSelector(state => state.cms);

    const dispatch = useDispatch();
    const [isPermission, setIsPermission] = useState(false);
    useEffect(() => {
        setIsPermission(((((user?.role === 'staff') && (user?.permission?.p_staff > 1)) || (user?.role !== 'staff'))) ? true : false);
    }, [user]);

    const modules = {
        toolbar: [
            [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }, { align: [] }],
            [{ color: [] }, { background: [] }],
            ['link', 'image', 'video'],
            ['clean'],
            [{ 'undo': 'undo' }, { 'redo': 'redo' }],
        ],
        history: {
            delay: 1000,
            maxStack: 100,
            userOnly: true,
        },
    };

  const handleQuillChange = (value) => {
    setErrors({
      ...errors,
      content: !value || value === "<p><br></p>" ? "Content is required" : null,
    });
    setFormData((p) => ({ ...p, content: value }));
  };

  const handleStatus = (e) => {
    const { checked } = e.target;
    setFormData((p) => ({ ...p, status: checked }));
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { content } = formData;
        setErrors({
            ...errors,
            content: !content || content === '<p><br></p>' ? "Content is required" : null,
        });
        if (content) {
            const quest_data = {
                name: "aboutus",
                type: "aboutus",
                status: Boolean(formData.status),
                content: {
                    Content: formData.content,
                }
            };
            const contentId = aboutusdata ? aboutusdata?.id : null;
            await create_faq_question(localStorage.getItem("token"), quest_data, contentId, dispatch);
            await get_about_data(localStorage.getItem("token"), "aboutus", dispatch);
        }
    };

    useEffect(() => {
        const handleQuest = async () => {
            await get_about_data(localStorage.getItem("token"), "aboutus", dispatch);
        };
        handleQuest();
    }, []);

    // update formData only when API actually provides fields
      useEffect(() => {
        if (!aboutusdata) return;
    
        setFormData((prev) => {
          const next = { ...prev };
    
          // if API provides content, overwrite; otherwise keep previous
          if (aboutusdata?.content?.Content !== undefined && aboutusdata?.content?.Content !== null) {
            next.content = aboutusdata.content.Content;
          }
    
          // only overwrite status if API explicitly has the 'status' key
          if (Object.prototype.hasOwnProperty.call(aboutusdata, "status")) {
            next.status = normalizeStatus(aboutusdata.status);
          }
    
          return next;
        });
      }, [aboutusdata]);

    return (
        <div className="mt-1">
            <div className="container">
                <h3 className="mb-0 fw-600">About Us</h3>
                <Form onSubmit={handleSubmit}>
                    <FormControl className="mt-2 mb-2">
                        <FormLabel className="fw-600">Content</FormLabel>
                        <ReactQuill
                            name="answer"
                            value={formData.content}
                            modules={modules}
                            disabled={!isPermission}
                            onChange={handleQuillChange}
                        />
                        {errors?.content && <div className="error_msg">{errors?.content}</div>}
                    </FormControl>
                    <FormControl className="mt-1 mb-2">
                        <FormLabel className="fw-600">Status</FormLabel>
                        <div class="form-check form-switch switch-large">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={formData.status} disabled={!isPermission} onChange={handleStatus} />
                        </div>
                    </FormControl>
                    <Button type="submit" className="btn common-button" disabled={!isPermission}>Save</Button>
                </Form>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        aboutusdata: state.cms.aboutusdata,
    }
};

export default connect(mapStateToProps)(AboutUsContent);
