import { useAttributes } from "../../useAttributes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GET_ATTRIBUTES } from "../../reduxData/user/userTypes";
import {
  add_attribute,
  delete_attribute,
  edit_atribute,
  get_attributes,
  add_values_attributes,
} from "../../reduxData/user/userAction";

import CustomModal from "./CustomModal";
import { Category } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import AddValuesModal from "./AddAttributeValuesModal";

const Attributes = () => {

  const [inputAttribute, setInputAttribute] = useState("");
  const [selectAttribute, setSelectedAttribute] = useState("");
  const [listAttributes, setListAttributes] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [valuesModal, setValuesModal] = useState(false);

  const [selectedAttributeId, setSelectedAttributeId] = useState("");
  const [multipleValues, setMultipleValues] = useState([]);
  const [currentValue, setCurrentValue] = useState("");
  const [choosenAttribute, setChoosenAttribute] = useState("");

  const token = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  const handleAddValues = async () => {
    if (multipleValues.length == 0) return;

    const payload = {
      attribute_id: selectedAttributeId,
      value: multipleValues,
    };
    try {
      const res = await add_values_attributes(token, payload);
      if (res) {
        setValuesModal(false);
        setCurrentValue("");
      }
    } catch (error) {}
    setMultipleValues([]);
  };

  const handleValues = () => {
    if (!currentValue || !currentValue.trim()) return;
    setMultipleValues([...multipleValues, currentValue]);
    setCurrentValue("");
  };

  const handleAddAttribute = async () => {
    const data = {
      name: inputAttribute,
    };
    const res = await add_attribute(token, data);
    if (res) {
      handleGetAttributes();
      setOpen(false);
      setInputAttribute("");
    }
    setInputAttribute("");
  };

  const handleGetAttributes = async () => {
    const res = await get_attributes(token);
    console.log("response of the attriburtes", res?.data?.data);
    setListAttributes(res?.data?.data);
  };

  const handleDate = (i) => {
    const date = new Date(i);
    const formatDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatDate;
  };

  const deleteAttribute = async (id) => {
    try {
      const res = await delete_attribute(token, id);
      if (res) {
        handleGetAttributes();
      }
    } catch (error) {}
  };

  const handleEdit = async () => {
    const payload = {
      name: inputAttribute,
    };
    try {
      const res = await edit_atribute(token, payload, editId);
      if (res) {
        handleGetAttributes();
        setOpen(false);
        setInputAttribute("");
      }
    } catch (error) {}
  };
  const openEditModal = (attribute) => {
    setInputAttribute(attribute.name);
    setEditId(attribute.id);
    setIsEditMode(true);
    setOpen(true);
  };

  const openAddModal = () => {
    setInputAttribute("");
    setEditId(null);
    setIsEditMode(false);
    setOpen(true);
  };
  const handleSubmit = () => {
    if (isEditMode) {
      handleEdit();
    } else {
      handleAddAttribute();
    }
  };

  useEffect(() => {
    handleGetAttributes();
  }, []);


  return (
    <div className="container ">
      <div class="flex-md-row flex-column gap-2 d-flex justify-content-between align-items-center mb-3">
        <h3 class="fw-600 col-md-6">Attribute Management</h3>
        <button class="mt-2 btn common-button" onClick={openAddModal}>
          + Add New Attribute
        </button>
      </div>

      {
        <div className="table-responsive mt-3">
          <table className="table table-hover user-management-table auction-category-list">
            <thead className="border-gray">
              <th>Sr No.</th>
              <th>Attributes</th>
              <th>Created At</th>
              <th>Action</th>
            </thead>

            <tbody>
              {listAttributes?.length > 0 ? (
                listAttributes?.map((i, idx) => (
                  <tr key={i?.id}>
                    <td>{idx + 1}</td>
                    <td>{i?.name}</td>
                    <td>{handleDate(i?.created_at)}</td>
                    <td>
                      <i
                        class="far fa-edit edit me-2"
                        onClick={() => openEditModal(i)}
                      ></i>
                      <i
                        className="bi bi-plus-circle"
                        onClick={() => {
                          setValuesModal(true);
                          setSelectedAttributeId(i?.id);
                          setChoosenAttribute(i?.name);
                        }}
                      ></i>
                      <i
                        class="bi bi-trash3 ms-1 text-danger"
                        onClick={() => deleteAttribute(i?.id)}
                      ></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="d-flex ">Attribute list is empty!</tr>
              )}
            </tbody>
          </table>
        </div>
      }
      <CustomModal
        open={open}
        setOpen={setOpen}
        inputAttribute={inputAttribute}
        setInputAttribute={setInputAttribute}
        handleAddAttribute={handleSubmit}
        isEditMode={isEditMode}
      />
      {valuesModal && <AddValuesModal selectedAttributeId={selectedAttributeId}  valuesModal={valuesModal} setValuesModal={setValuesModal} choosenAttribute={choosenAttribute} setMultipleValues={setMultipleValues} setCurrentValue={setCurrentValue} currentValue={currentValue}  handleValues={handleValues} handleAddValues={handleAddValues} multipleValues={multipleValues}/>}
    </div>
  );
};

export default Attributes;
