import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useGetAttributesValues } from "../../utils/useGetAttributesValues";
import { delete_attribute } from "../../reduxData/user/userAction";
import { useSelector } from "react-redux";

const AddValuesModal = ({
  valuesModal,
  setValuesModal,
  choosenAttribute,
  setMultipleValues,
  setCurrentValue,
  currentValue,
  handleValues,
  handleAddValues,
  multipleValues,
  selected,
  selectedAttributeId
}) => {
const [call,setCall] = useState(false);
const {values, handleDeleteAttribute} = useGetAttributesValues(selectedAttributeId);
const token = useSelector(state=>state.auth.accessToken);



useEffect(()=>{
  if(values.length>0)
console.log("values", values[0].values?.map(i=>i.id))
},[values])

  const handleRemoveNewValue = (indexToRemove) => {
    setMultipleValues(multipleValues.filter((_, index) => index !== indexToRemove));
  };


  return (
    <Modal
      isOpen={valuesModal}
      onClose={() => {
        setValuesModal(false);
      }}
    >
      <div>
        <div className="d-flex justify-content-between gap-3">
          <p className="fs-5 mb-1 fw-bold text-capitalize">
            Attribute : {choosenAttribute}
          </p>
          <button
            className="btn btn-close  text-end"
            onClick={() => {
              setValuesModal(false);
              setMultipleValues([]);
              setCurrentValue("");
            }}
          ></button>
        </div>
        <div className="mt-3">
          <div className="d-flex justify-content-between flex-column gap-2 values-wrapper">
            <input
              className=" form-control"
              value={currentValue}
              placeholder="Add values"
              onChange={(e) => setCurrentValue(e.target.value)}
            />

         {values.length>0 && values[0]?.values?.length>0 &&  <div>
              <p>Already Added Values</p>
             
           <div className="values-wrapper">
               {values[0]?.values?.map(item=>(
               <div className="btn btn-light border border-1 mt-2 delete-added-items">
                {item?.value}
                 <button className="delete-added-items-btn " onClick={()=>{handleDeleteAttribute(item?.id);setCall(true)}}>
                  x
                </button>
                </div>
              ))}
            </div>

            </div>}
    {
      multipleValues.length>0 && <div>
         <p>Newly Added Values</p>
                <div className="values-wrapper">
            {multipleValues?.map((i, index) => (
               <div className="btn btn-light border border-1 mt-2 delete-added-items">
                {i}   
              <button 
                key={index}
               className="delete-added-items-btn "
                onClick={() => handleRemoveNewValue(index)}
              >
               x
              </button>
              </div>
            ))}
          </div>
        </div>
    }
            <button
              className="btn btn-secondary"
              onClick={() => {
                handleValues();
              }}
            >
              Add{" "}
            </button>
          </div>
      
          <button
            className="btn btn-primary mt-3 w-100"
            onClick={() => {
              handleAddValues();
            }}
          >
            Submit{" "}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddValuesModal;
