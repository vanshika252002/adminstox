// import { FormControl } from "@mui/joy";
// import React, { useEffect, useState } from "react";
// import { Button, Form, FormLabel } from "react-bootstrap";
// import ReactQuill from "react-quill";
// import { connect, useDispatch } from "react-redux";
// import { create_faq_question, get_term_data } from "../../reduxData/cms/cmsAction";
// import { useSelector } from "react-redux";

// const Terms = ({}) => {
//     const [formData, setFormData] = useState({
//         content: '',
//          status: false,
//      });
//      const {user}=useSelector(state=>state.auth);
//          const {termdata}=useSelector(state=>state.cms);

//      const [errors, setErrors] = useState({
//          content: '',
//      });
//      const dispatch = useDispatch();
//      const [isPermission,setIsPermission]=useState(false);
//      useEffect(()=>{
//          setIsPermission(((((user?.role==='staff') && (user?.permission?.p_staff>1)) || (user?.role!=='staff')))?true:false);
//      },[user]);

//     const modules = {
//         toolbar: [
//             [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
//             [{ script: 'sub' }, { script: 'super' }],
//             [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
//             [{ direction: 'rtl' }, { align: [] }], 
//             [{ color: [] }, { background: [] }],
//             ['link', 'image', 'video'],
//             ['clean'],
//             [{ 'undo': 'undo' }, { 'redo': 'redo' }],
//         ],
//         history: {
//             delay: 1000,
//             maxStack: 100,
//             userOnly: true,
//         },
//     };
 
//      const handleQuillChange = (value) => {
//          setErrors({ ...errors, content: !value || value === '<p><br></p>' ? "Content is required" : null });
//          setFormData({ ...formData, content: value });
//      };
 
//      const handleStatus = (e) => {
//          const { checked } = e.target;
//          if(checked){
//              setFormData({ ...formData, status: true });
//          } else {
//              setFormData({ ...formData, status: false });
//          }
//      };
 
//      const handleSubmit = async (e) => {
//          e.preventDefault();
//          const { content } = formData;
//          setErrors({
//              ...errors,
//              content: !content || content === '<p><br></p>' ? "Content is required" : null,
//          });
//          if(content){
//              const quest_data = {
//                  name: "termsandconditions",
//                  type: "termsandconditions",
//                  status : formData.status,
//                  content : {
//                      Content: formData.content,
//                  }
//              };
//          const contentId = termdata ? termdata?.id : null;
//          await create_faq_question(localStorage.getItem("token"), quest_data, contentId, dispatch);
//          await get_term_data(localStorage.getItem("token"), "termsandconditions", dispatch); 
//         }
//      };
 
//      useEffect(() => {
//          const handleQuest = async () => {
//              await get_term_data(localStorage.getItem("token"), "termsandconditions", dispatch);
//          };
//          handleQuest();
//      }, []);
//      console.log("termdata",termdata?.content?.Content)
//      useEffect(() => {
//         if(termdata){
//           setFormData({
//              content: termdata?.content?.Content,
//              status: termdata?.status,
//           });
//         }
//      },[termdata]);

//     return (
//         <div className="mt-1">
//             <div className="container">
//                 <h3 className="mb-0 fw-600">Terms and Conditions</h3>
//                 <Form onSubmit={handleSubmit}>
//                     <FormControl className="mt-2 mb-2">
//                         <FormLabel className="fw-600">Content</FormLabel>
//                         <ReactQuill
//                             name="answer"
//                             value={formData.content}
//                             modules={modules}
//                             disabled={!isPermission}
//                             onChange={handleQuillChange}
//                         />
//                         {console.log("formData.content",formData)}
//                         {errors?.content && <div className="error_msg">{errors?.content}</div>}
//                     </FormControl>
//                     <FormControl className="mt-1 mb-2">
//                         <FormLabel className="fw-600">Status</FormLabel>
//                         <div class="form-check form-switch switch-large">
//                             <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={formData.status} disabled={!isPermission} onChange={handleStatus} />
//                         </div>
//                     </FormControl>
//                     <Button type="submit" className="btn common-button" disabled={!isPermission}>Save</Button>
//                 </Form>
//             </div>
//         </div>
//     )
// };

// const mapStateToProps = (state) => {
//     return {
//         user: state.auth.user,
//         termdata: state.cms.termdata,
//     }
// };

// export default connect(mapStateToProps)(Terms);








import { FormControl } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import { create_faq_question, get_term_data } from "../../reduxData/cms/cmsAction";

const normalizeStatus = (v) => {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  return false;
};

const Terms = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { termdata } = useSelector((state) => state.cms);

  const [formData, setFormData] = useState({
    content: "",
    status: false, // default false
  });

  const [errors, setErrors] = useState({ content: "" });
  const [isPermission, setIsPermission] = useState(false);

  useEffect(() => {
    setIsPermission(
      (user?.role === "staff" && user?.permission?.p_staff > 1) ||
        user?.role !== "staff"
        ? true
        : false
    );
  }, [user]);

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

  const handleQuillChange = (value) => {
    setErrors({
      ...errors,
      content: !value || value === "<p><br></p>" ? "Content is required" : null,
    });
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleStatus = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, status: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { content } = formData;

    setErrors({
      ...errors,
      content: !content || content === "<p><br></p>" ? "Content is required" : null,
    });

    if (content) {
      const quest_data = {
        name: "termsandconditions",
        type: "termsandconditions",
        status: Boolean(formData.status),
        content: {
          Content: formData.content,
        },
      };

      const contentId = termdata ? termdata?.id : null;
      await create_faq_question(
        localStorage.getItem("token"),
        quest_data,
        contentId,
        dispatch
      );
      await get_term_data(localStorage.getItem("token"), "termsandconditions", dispatch);
    }
  };

  // fetch once on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      get_term_data(token, "termsandconditions", dispatch);
    }
  }, [dispatch]);

  // update from API response
  useEffect(() => {
    if (!termdata) return;

    setFormData((prev) => {
      const next = { ...prev };

      if (
        termdata?.content?.Content !== undefined &&
        termdata?.content?.Content !== null
      ) {
        next.content = termdata.content.Content;
      }

      if (Object.prototype.hasOwnProperty.call(termdata, "status")) {
        next.status = normalizeStatus(termdata.status);
      }

      return next;
    });
  }, [termdata]);

  return (
    <div className="mt-1">
      <div className="container">
        <h3 className="mb-0 fw-600">Terms and Conditions</h3>
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
            <div className="form-check form-switch switch-large">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked={!!formData.status}
                disabled={!isPermission}
                onChange={handleStatus}
              />
            </div>
          </FormControl>

          <Button
            type="submit"
            className="btn common-button"
            disabled={!isPermission}
          >
            Save
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Terms;
