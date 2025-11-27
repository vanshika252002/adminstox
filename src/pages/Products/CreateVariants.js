import React, { useEffect , useState} from "react";
import { toast } from "react-toastify";
import { useCreateVariants } from "./useCreateVariants";
import { handleDate } from "./utils";

const { REACT_APP_IMAGE_URL } = process.env;

// Helper component for status badge
const StatusBadge = ({ status }) => {
  const statusLower = (status?.toLowerCase() || "submitted");
  const isSubmitted = statusLower === "submitted";
  const isDuplicated = statusLower === "duplicated";
  
  return (
    <span
      className={`badge ${
        isSubmitted 
          ? "bg-success" 
          : isDuplicated 
          ? "bg-danger" 
          : "bg-warning"
      } d-flex align-items-center gap-1 status-badge-fit`}
    >
      {isSubmitted ? (
        <>
          <i className="bi bi-check-circle"></i>
          Submitted
        </>
      ) : isDuplicated ? (
        <>
          <i className="bi bi-exclamation-triangle"></i>
          Duplicated
        </>
      ) : (
        <>
          <i className="bi bi-clock"></i>
          Pending
        </>
      )}
    </span>
  );
};

// Helper component for variant image
const VariantImage = ({ images }) => {
  if (images && images[0]) {
    return (
      <img
        className="container-fluid variant-image-thumb"
        src={`${REACT_APP_IMAGE_URL}${images[0]}`}
        alt="Variant"
      />
    );
  }
  return <span className="text-muted variant-no-image">No image</span>;
};

const CreateVariants = () => {
  const {
    // State
   list,
    tableAttrib,
    pairs,
    tableFields,
    selectedAttributes,
    attributesValues,
    listAttributes,
    allVariants,
    filteredVariants,
    variantStats,
    duplicateVariants,
    setPendingVariants,
    pendingVariants,
    pairsDuplicateInfo,
    combinationImages,

    // Handlers
    handleAddAttribute,
    handleSelectValue,
    handleRemoveValue,
    handleRemoveAttribute,
    handleImageUpload,
    handleSubmit,
    handleSubmitPending,
    handleDeleteWithConfirmation,
    handleDeletePending,
    handleDeleteCombination,
    // Edit handlers
    editingVariant,
    editImages,
    editedAttributes,
    editAttributeValues,
    handleEditVariant,
    handleCancelEdit,
    handleEditImageUpload,
    handleRemoveEditImage,
    handleChangeEditAttributeValue,
    handleSubmitEdit,
  } = useCreateVariants();

  // Scroll to variant creation section
const [ filter , setFilter] = useState("list") ;

  const scrollToCreation = () => {
    document.getElementById("variant-creation")?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(()=>{
console.log("list  ===>   ",list?.[0]?.attribute?.map(i=>i?.attribute_name))
  },[list])

  return (
    <div className="create-product-variants mx-auto container">
      {/* Header */}
      <div className="variant-header-section">
        <h2 className="variant-page-title">Variant Management</h2>
        <div className="variant-header-actions">
          <button className="btn btn-primary variant-action-btn" onClick={()=>setFilter("list")}>
            <i className="bi bi-plus-circle me-2"></i>
           List
          </button>
          <button className="btn btn-success variant-action-btn" onClick={()=>setFilter("createVariant")}>
            <i className="bi bi-plus-circle me-2"></i>
           Variants
          </button>
        </div>
      </div>

      {/* Variants Summary */}
      {allVariants.length > 0 && filter=="list" && (
        <div className="variants-summary-section mb-2 mt-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="variants-summary-title mb-0 variants-summary-title-compact">All Variants ({allVariants.length})</h3>
            <div className="d-flex gap-2 align-items-center">
              {/* Submit Pending Button */}
              {variantStats.pending > 0 && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleSubmitPending}
                  disabled={duplicateVariants.size > 0}
                  title={
                    duplicateVariants.size > 0
                      ? "Please remove duplicate variants before submitting"
                      : ""
                  }
                >
                  Submit Pending ({variantStats.pending})
                </button>
              )}
            </div>
          </div>
          
       
          {/* Duplicate Warning */}
          {duplicateVariants.size > 0 && (
            <div className="alert alert-warning mb-2 py-2 variant-duplicate-warning" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Warning:</strong> {duplicateVariants.size} pending variant(s) already exist
              in the submitted list. Please remove duplicates before submitting.
            </div>
          )}

          {/* Variants Table */}
          {filteredVariants.length > 0 && (
            <div className="table-responsive variants-table-container mb-2 variants-table-scroll">
              <table className="table user-management-table table-hover table-sm">
                <thead className="border-gray variants-table-header-sticky">
                  <tr>
                    <th scope="col" className="variants-table-th">Sr. No.</th>
                    {list?.[0]?.attribute?.map(i=>(<th className="variants-table-th">{i?.attribute_name}</th>))}
                    {/* {tableFields?.map((i) => (
                      <th key={i[0]} className="variants-table-th">{i[1].name}</th>
                    ))} */}
                    <th scope="col" className="variants-table-th">Images</th>
                    <th scope="col" className="variants-table-th">Created At</th>
                    <th scope="col" className="variants-table-th">Status</th>
                    <th scope="col" className="variants-table-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVariants.map((variant, idx) => {
                    const isDuplicate =
                      variant?.status === "pending" &&
                      duplicateVariants.has(variant?.temp_id);
                    return (
                      <tr
                        key={variant?.variant_id || variant?.temp_id || idx}
                        className={isDuplicate ? "table-warning variant-duplicate-row" : ""}
                      >
                        <td className="variants-table-td">{idx + 1}</td>
                        {list?.map(i=>i?.atrribute?.map(item=><td key={item?.attribute_id} className="text-capitalize variants-table-td variants-table-td-text">{item?.attribute_name}</td>))}
                        {tableFields?.map((field) => {
                          const attrId = field[0];
                          const foundAttr = variant?.attribute?.find(
                            (attr) => attr?.attribute_id === attrId
                          );
                          return (
                            <td key={attrId} className="text-capitalize variants-table-td variants-table-td-text">
                              {foundAttr?.value || "-"}
                            </td>
                          );
                        })}
                        <td className="variants-table-td variants-table-td-image">
                          <VariantImage images={variant?.images} />
                        </td>
                        <td className="variants-table-td variants-table-td-date">{handleDate(variant?.created_at)}</td>
                        <td className="variants-table-td">
                          <StatusBadge status={variant?.status} />
                          {isDuplicate && (
                            <span
                              className="badge bg-danger ms-2 variant-duplicate-badge"
                              title="This variant already exists"
                            >
                              Duplicate
                            </span>
                          )}
                        </td>
                        <td className="variants-table-td">
                          {variant?.status === "pending" ? (
                            <>
                              <i
                                className="far fa-edit edit me-2 text-muted variant-icon-disabled"
                                title="Edit disabled for pending variants"
                              ></i>
                              <i
                                className="bi bi-trash3 text-danger variant-icon-clickable"
                                onClick={() => handleDeletePending(variant?.temp_id)}
                                title="Delete pending variant"
                              ></i>
                            </>
                          ) : (
                            <>
                              <i
                                className="far fa-edit edit me-2 variant-icon-clickable"
                                onClick={() => handleEditVariant(variant)}
                                title="Edit variant"
                              ></i>
                              <i
                                onClick={() =>
                                  handleDeleteWithConfirmation(variant?.variant_id)
                                }
                                className="bi bi-trash3 text-danger variant-icon-clickable"
                                title="Delete variant"
                              ></i>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Variant Creation Section */}
     { filter=="createVariant" && <div id="variant-creation" className="variant-creation-wrapper">
        <div className="variant-creation-container">
          {/* Left Column - Combinations Table */}
          <div className="variant-combinations-column">
            <div className="combinations-sticky-wrapper">
              <h3 className="combinations-title">Combinations ({pairs.length})</h3>
              <div className="combinations-table-wrapper">
                {pairs.length > 0 ? (
                  <table className="table table-hover table-bordered combinations-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Sr No.</th>
                        <th>Images</th>
                        {}
                        {tableAttrib.map((attr, idx) => (
                          <th key={idx}>{attr}</th>
                        ))}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pairs.map((pair, pairIdx) => {
                        const valueCombo = pair.values || [];
                        const duplicateInfo = pairsDuplicateInfo?.get(pair.combinationKey);
                        const isDuplicate = !!duplicateInfo;
                        
                        return (
                          <tr key={pairIdx} className={isDuplicate ? "table-danger" : ""}>
                            <td>
                              <StatusBadge status={isDuplicate ? "duplicated" : "pending"} />
                            </td>
                            <td>{pairIdx + 1}</td>
                            <td>
                              <input
                                type="file"
                                key = {pair.combinationKey}
                                className="form-control form-control-sm combination-file-input"
                                accept="image/*"
                                multiple
                                onChange={(e) =>
                                  handleImageUpload(e, pair.combinationKey)
                                }
                              />
                              {combinationImages?.[pair.combinationKey] && combinationImages[pair.combinationKey].length > 0 && (
                                <small className="text-muted d-block mt-1 combination-file-count">
                                  {combinationImages[pair.combinationKey].length} file(s)
                                </small>
                              )}
                            </td>
                            {tableAttrib.map((attr, attrIdx) => {
                              const value = valueCombo.find(
                                (val) => val.attributeName === attr
                              );
                              return (
                                <td key={attrIdx} className="text-capitalize">
                                  {value ? value.name : "-"}
                                </td>
                              );
                            })}
                            <td>
                              <i
                                className="bi bi-trash3 text-danger variant-icon-clickable"
                                onClick={() => handleDeleteCombination(pairIdx)}
                                title="Delete combination"
                                style={{ cursor: "pointer" }}
                              ></i>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="combinations-empty-state">
                    <p className="text-muted text-center">No combinations generated yet. Select attributes and values to generate combinations.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="variant-form-column">
            <h2 className="variant-section-title">Create Product Variants</h2>

            {/* SELECT ATTRIBUTE */}
            <div className="mb-2">
              <label className="select-attribute">Select Attribute</label>
              <select
                defaultValue=""
                onChange={handleAddAttribute}
                className="select-option-attribute"
              >
                <option value="" disabled>
                  Choose an attribute...
                </option>
                {listAttributes?.map((attr) => (
                  <option
                    key={attr.id}
                    value={JSON.stringify({ name: attr.name, id: attr.id })}
                    disabled={selectedAttributes.some((a) => a.id === attr.id)}
                  >
                    {attr.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SELECTED ATTRIBUTES */}
            <div className="selected-attributes-container">
              {selectedAttributes.map((attribute) => (
                <div key={attribute.id} className="selected-att">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h3 className="text-capitalize">{attribute.name}</h3>
                    <button
                      onClick={() => handleRemoveAttribute(attribute.id, attribute.name)}
                      className="remove-btns"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="d-flex gap-2 mb-1">
                    <select
                      onChange={(e) => handleSelectValue(attribute.id, e)}
                      className="select-option-attribute"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select {attribute.name} value...
                      </option>
                      {attributesValues
                        ?.find((i) => i.id === attribute.id)
                        ?.values?.map((val) => (
                          <option key={val.id} value={val.id}>
                            {val.value}
                          </option>
                        ))}
                    </select>
                  </div>

                  {attribute.selectedValues.length > 0 && (
                    <div>
                      <p className="fw-bold mb-1 selected-values-label">Selected Values:</p>
                      <div className="atrr-mapping">
                        {attribute.selectedValues.map((val) => (
                          <span key={val.id} className="atrr-values">
                            {val.value}
                            <button
                              onClick={() => handleRemoveValue(attribute.id, val.id)}
                              className="remove-values"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            {selectedAttributes.length > 0 && (
              <button 
                onClick={handleSubmit} 
                className="submit-variants"
                disabled={
                  duplicateVariants.size > 0 || 
                  (pairsDuplicateInfo && pairsDuplicateInfo.size > 0)
                }
                title={
                  duplicateVariants.size > 0
                    ? "Please remove duplicate variants before submitting"
                    : pairsDuplicateInfo && pairsDuplicateInfo.size > 0
                    ? `Please delete ${pairsDuplicateInfo.size} duplicate variant(s) before submitting`
                    : ""
                }
              >
                Submit Variants
              </button>
            )}
          </div>
        </div>
      </div>
}

      {/* Edit Variant Modal */}
      {editingVariant && (
        <div
          className="modal fade show variant-edit-modal"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Variant</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancelEdit}
                ></button>
              </div>
              <div className="modal-body">
                {/* Editable Variant Attributes */}
                <div className="mb-4">
                  <h6>Edit Variant Attributes:</h6>
                  {editedAttributes.map((attr, idx) => (
                    <div key={idx} className="mb-3">
                      <label className="form-label fw-bold text-capitalize">
                        {attr.attribute_name}
                      </label>
                      <select
                        className="form-select"
                        value={attr.value_id || ""}
                        onChange={(e) => {
                          const selectedOption = e.target.selectedOptions[0];
                          const valueId = parseInt(e.target.value);
                          const valueText = selectedOption.text;
                          if (valueId) {
                            handleChangeEditAttributeValue(attr.attribute_id, valueId, valueText);
                          }
                        }}
                      >
                        <option value="">Select {attr.attribute_name}...</option>
                        {Array.isArray(editAttributeValues[attr.attribute_id]) &&
                          editAttributeValues[attr.attribute_id].length > 0 ? (
                          editAttributeValues[attr.attribute_id].map((val) => (
                            <option key={val.id} value={val.id}>
                              {val.value}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading values...</option>
                        )}
                      </select>
                      {!attr.value_id && (
                        <small className="text-danger">
                          Please select a value for {attr.attribute_name}
                        </small>
                      )}
                    </div>
                  ))}
                </div>

                {/* Images Section */}
                <div className="mb-3">
                  <label className="form-label">Variant Images</label>
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    multiple
                    
                    onChange={handleEditImageUpload}
                  />
                  
                  {/* Display current images */}
                  {editImages.length > 0 && (
                    <div className="row g-2 mt-2">
                      {editImages.map((image, idx) => (
                        <div key={idx} className="col-md-3 position-relative">
                          <img
                            src={`${REACT_APP_IMAGE_URL}${image}`}
                            alt={`Variant ${idx + 1}`}
                            className="img-thumbnail variant-edit-image"
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 variant-edit-image-remove"
                            onClick={() => handleRemoveEditImage(idx)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {editImages.length === 0 && (
                    <p className="text-muted">No images selected</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateVariants;