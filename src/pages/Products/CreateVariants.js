import React from "react";
import { toast } from "react-toastify";
import { useCreateVariants, STATUS_TABS } from "./useCreateVariants";
import { handleDate } from "./utils";

const { REACT_APP_IMAGE_URL } = process.env;

// Helper component for status badge
const StatusBadge = ({ status }) => {
  const isSubmitted = (status?.toLowerCase() || "submitted") === "submitted";
  return (
    <span
      className={`badge ${isSubmitted ? "bg-success" : "bg-warning"} d-flex align-items-center gap-1`}
      style={{ width: "fit-content" }}
    >
      {isSubmitted ? (
        <>
          <i className="bi bi-check-circle"></i>
          Submitted
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
        className="container-fluid"
        src={`${REACT_APP_IMAGE_URL}${images[0]}`}
        alt="Variant"
        style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
      />
    );
  }
  return <span className="text-muted">No image</span>;
};

const CreateVariants = () => {
  const {
    // State
    tableAttrib,
    pairs,
    colorImages,
    variantImages,
    tableFields,
    filterTab,
    selectedAttributes,
    attributesValues,
    listAttributes,
    allVariants,
    filteredVariants,
    variantStats,
    duplicateVariants,

    // Handlers
    setFilterTab,
    handleAddAttribute,
    handleSelectValue,
    handleRemoveValue,
    handleRemoveAttribute,
    handleImageUpload,
    handleSubmit,
    handleSubmitPending,
    handleDeleteWithConfirmation,
    handleDeletePending,
    isColorAttribute,
  } = useCreateVariants();

  // Scroll to variant creation section
  const scrollToCreation = () => {
    document.getElementById("variant-creation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="create-product-variants mx-auto container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Single page variant management UI</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={scrollToCreation}>
            + Generate Combinations
          </button>
          <button className="btn btn-success" onClick={scrollToCreation}>
            + Add Single Variant
          </button>
        </div>
      </div>

      {/* Variants Summary */}
      {allVariants.length > 0 && (
        <div className="mb-4">
          <h3 className="fw-600">All Variants ({allVariants.length})</h3>
          <div className="d-flex gap-3 mb-3">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill text-success"></i>
              <span>{variantStats.submitted} Submitted</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-clock-fill text-warning"></i>
              <span>{variantStats.pending} Pending</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="d-flex gap-2 mb-3">
            {Object.values(STATUS_TABS).map((tab) => (
              <button
                key={tab}
                className={`btn ${filterTab === tab ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setFilterTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Duplicate Warning */}
          {duplicateVariants.size > 0 && (
            <div className="alert alert-warning mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Warning:</strong> {duplicateVariants.size} pending variant(s) already exist
              in the submitted list. Please remove duplicates before submitting.
            </div>
          )}

          {/* Submit Pending Button */}
          {variantStats.pending > 0 && (
            <button
              className="btn btn-success mb-3"
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

          {/* Variants Table */}
          {filteredVariants.length > 0 && (
            <div className="table-responsive mb-5">
              <table className="table user-management-table table-hover">
                <thead className="border-gray">
                  <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Sr. No.</th>
                    {tableFields?.map((i) => (
                      <th key={i[0]}>{i[1].name}</th>
                    ))}
                    <th scope="col">Images</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Actions</th>
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
                        className={isDuplicate ? "table-warning" : ""}
                        style={isDuplicate ? { backgroundColor: "#fff3cd" } : {}}
                      >
                        <td>
                          <StatusBadge status={variant?.status} />
                          {isDuplicate && (
                            <span
                              className="badge bg-danger ms-2"
                              title="This variant already exists"
                            >
                              Duplicate
                            </span>
                          )}
                        </td>
                        <td>{idx + 1}</td>
                        {tableFields?.map((field) => {
                          const attrId = field[0];
                          const foundAttr = variant?.attribute?.find(
                            (attr) => attr?.attribute_id === attrId
                          );
                          return (
                            <td key={attrId} className="text-capitalize">
                              {foundAttr?.value || "-"}
                            </td>
                          );
                        })}
                        <td className="w-25">
                          <VariantImage images={variant?.images} />
                        </td>
                        <td>{handleDate(variant?.created_at)}</td>
                        <td>
                          <i
                            className="far fa-edit edit me-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              toast.info("Edit functionality to be implemented");
                            }}
                          ></i>
                          {variant?.status === "pending" ? (
                            <i
                              onClick={() => handleDeletePending(variant?.temp_id)}
                              className="bi bi-trash3 text-danger"
                              style={{ cursor: "pointer" }}
                            ></i>
                          ) : (
                            <i
                              onClick={() =>
                                handleDeleteWithConfirmation(variant?.variant_id)
                              }
                              className="bi bi-trash3 text-danger"
                              style={{ cursor: "pointer" }}
                            ></i>
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
      <div id="variant-creation">
        <h2 className="mb-4">Create Product Variants</h2>

        {/* SELECT ATTRIBUTE */}
        <div className="mb-4">
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
        {selectedAttributes.map((attribute) => (
          <div key={attribute.id} className="selected-att">
            <div className="d-flex justify-content-between align-items-center mb-2">
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
                <p className="fw-bold mb-2">Selected Values:</p>
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

        {/* Combinations Table */}
        {pairs.length > 0 && (
          <div className="table-responsive mb-4 mt-5">
            <h3>Combinations</h3>
            <table className="table table-hover table-bordered user-management-table auction-category-list">
              <thead className="border-gray">
                <tr>
                  <th>Sr No.</th>
                  {pairs.length > 0 && pairs[0]?.colorId && <th>Color</th>}
                  <th>Images</th>
                  {tableAttrib
                    .filter((attr) => !isColorAttribute(attr))
                    .map((attr, idx) => (
                      <th key={idx}>{attr}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair, pairIdx) => {
                  const hasColor = pair.colorId !== null && pair.colorId !== undefined;
                  const valueCombos =
                    pair.values && pair.values.length > 0 ? pair.values : [[]];

                  return (
                    <React.Fragment key={pairIdx}>
                      {valueCombos.length > 0 ? (
                        valueCombos.map((valueCombo, comboIdx) => (
                          <tr key={`${pairIdx}-${comboIdx}`}>
                            {comboIdx === 0 && (
                              <td rowSpan={valueCombos.length}>{pairIdx + 1}</td>
                            )}
                            {hasColor && comboIdx === 0 && (
                              <td rowSpan={valueCombos.length} className="fw-bold">
                                {pair.color}
                              </td>
                            )}
                            {comboIdx === 0 && (
                              <td rowSpan={valueCombos.length}>
                                {pair.colorId ? (
                                  <>
                                    <input
                                      type="file"
                                      className="form-control form-control-sm"
                                      accept="image/*"
                                      multiple
                                      onChange={(e) =>
                                        handleImageUpload(e, pair.colorId, true)
                                      }
                                    />
                                    {colorImages[pair.colorId] && (
                                      <small className="text-muted d-block mt-1">
                                        {colorImages[pair.colorId].length} file(s) selected
                                      </small>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <input
                                      type="file"
                                      className="form-control form-control-sm"
                                      accept="image/*"
                                      multiple
                                      onChange={(e) =>
                                        handleImageUpload(e, pair.variantKey, false)
                                      }
                                    />
                                    {variantImages[pair.variantKey] && (
                                      <small className="text-muted d-block mt-1">
                                        {variantImages[pair.variantKey].length} file(s) selected
                                      </small>
                                    )}
                                  </>
                                )}
                              </td>
                            )}
                            {valueCombo && valueCombo.length > 0 ? (
                              valueCombo.map((val, valIdx) => (
                                <td key={valIdx}>{val.name}</td>
                              ))
                            ) : (
                              tableAttrib
                                .filter((attr) => !isColorAttribute(attr))
                                .map((attr, idx) => <td key={idx}>-</td>)
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>{pairIdx + 1}</td>
                          {hasColor && <td className="fw-bold">{pair.color}</td>}
                          <td>
                            {pair.colorId ? (
                              <>
                                <input
                                  type="file"
                                  className="form-control form-control-sm"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleImageUpload(e, pair.colorId, true)}
                                />
                                {colorImages[pair.colorId] && (
                                  <small className="text-muted d-block mt-1">
                                    {colorImages[pair.colorId].length} file(s) selected
                                  </small>
                                )}
                              </>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  className="form-control form-control-sm"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleImageUpload(e, pair.variantKey, false)}
                                />
                                {variantImages[pair.variantKey] && (
                                  <small className="text-muted d-block mt-1">
                                    {variantImages[pair.variantKey].length} file(s) selected
                                  </small>
                                )}
                              </>
                            )}
                          </td>
                          {tableAttrib
                            .filter((attr) => !isColorAttribute(attr))
                            .map((attr, idx) => (
                              <td key={idx}>-</td>
                            ))}
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Submit Button */}
        {selectedAttributes.length > 0 && (
          <button onClick={handleSubmit} className="submit-variants">
            Submit Variants
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateVariants;
