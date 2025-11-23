import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useGetAttributes } from "./useGetAttributes";
import { useGetAttributesValues } from "../../utils/useGetAttributesValues";
import { toast } from "react-toastify";
import { generate_variants, upload_multiple_image } from "../../reduxData/user/userAction";
import { useNavigate, useParams } from "react-router-dom";
import { handleImageUpload } from "./utils";

// Helper to handle image upload for variants (with or without color)
const handleVariantImageUpload = async (e, identifier, hasColor, setColorImages, setVariantImages, colorImages, variantImages) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }

  try {
    const res = await upload_multiple_image(
      formData,
      localStorage.getItem("token")
    );
    
    console.log("response of the images api", res?.data?.data);
    
    if (hasColor) {
      setColorImages((prev) => ({
        ...prev,
        [identifier]: res?.data?.data || []
      }));
    } else {
      setVariantImages((prev) => ({
        ...prev,
        [identifier]: res?.data?.data || []
      }));
    }
    
  } catch (error) {
    console.error("Upload error:", error);
  }
};

const CreateVariants = () => {

  const [uploadImages, setUploadImages] = useState([]);
  const [showCombination, setShowCombination] = useState(false);
  const [tableAttrib, setTableAttrib] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [colorImages, setColorImages] = useState([]);
  const [variantImages, setVariantImages] = useState([]);

  const listAttributes = useGetAttributes();

  const token = useSelector(state => state.auth.accessToken);
  const { productId } = useParams();
  const [selectedId, setSelectedId] = useState("");

  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const navigate = useNavigate();
  const [attributesValues, setAttributesValues] = useState([]);

  const {values} = useGetAttributesValues(selectedId);

  const handleAddAttribute = (e) => {
    const value = JSON.parse(e.target.value);

    const exists = selectedAttributes.some((attr) => attr.id === value.id);

    setSelectedId(value.id);
    if (!exists) {
      setSelectedAttributes((prev) => [...prev, { ...value, selectedValues: [] }]);
    }

    setTableAttrib(prev => [...prev, value.name]);

    e.target.value = "";
  };

  const handleSelectValue = (attributeId, e) => {
    const selectedOption = e.target.selectedOptions[0];
    const valueId = parseInt(e.target.value);
    const valueText = selectedOption.text;

    if (!valueId) return;

    setSelectedAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id !== attributeId) return attr;

        const isDuplicate = attr.selectedValues.some((v) => v.id === valueId);

        if (isDuplicate) {
          toast.error("Value already added");
          return attr;
        }

        return {
          ...attr,
          selectedValues: [...attr.selectedValues, { id: valueId, value: valueText }],
        };
      })
    );

    e.target.value = "";
  };

  const handleRemoveValue = (attributeId, valueId) => {
    setSelectedAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attributeId
          ? {
              ...attr,
              selectedValues: attr.selectedValues.filter((v) => v.id !== valueId),
            }
          : attr
      )
    );
  };

  const handleRemoveAttribute = (attributeId,value) => {
    setSelectedAttributes((prev) =>
      prev.filter((attr) => attr.id !== attributeId)
    );
    setTableAttrib(prev =>prev.filter(attr=>attr!==value));
    
  };


  const generateVariants = async (ids) => {
    if (!ids || ids.length == 0)
      return;
    const payload = {
      product_id: productId,
      variants: ids
    }
    try {
      const res = await generate_variants(token, payload)
      if (res) {
        setSelectedAttributes("")
        navigate("/products")
      }
    } catch (error) {
    }
  }

  const handleSubmit = () => {
    const formattedData = selectedAttributes.map((attr) => ({
      attribute_id: attr.id,
      attribute_name: attr.name,
      value_ids: attr.selectedValues.map((v) => v.id),
    }));

    console.log("Formatted variants data:", formattedData);

    const allValueIds = selectedAttributes.flatMap((attr) =>
      attr.selectedValues.map((v) => v.id)
    );
    console.log("All selected value IDs:", allValueIds);

    const payload = pairs.map((pair) => {
      // Collect all unique attribute value IDs for this color/variant
      let allAttributeIds = [];
      
      if (pair.colorId) {
        // For color variants: collect all attribute IDs from all combinations
        const valueCombos = pair.values && pair.values.length > 0 ? pair.values : [];
        const allOtherIds = valueCombos.flatMap(valueCombo => 
          valueCombo.map(v => v.id)
        );
        const uniqueOtherIds = [...new Set(allOtherIds)];
        
        // Ensure colorId is first and all IDs are unique
        const otherIdsWithoutColor = uniqueOtherIds.filter(id => id !== pair.colorId);
        allAttributeIds = [pair.colorId, ...otherIdsWithoutColor];
        
        return {
          attribute_value_ids: allAttributeIds,
          images: colorImages[pair.colorId] || []
        };
      } else {
        // No color - collect all IDs from the single combination
        const valueCombo = pair.values && pair.values.length > 0 ? pair.values[0] : [];
        const allOtherIds = valueCombo.map(v => v.id);
        allAttributeIds = [...new Set(allOtherIds)];
        
        return {
          attribute_value_ids: allAttributeIds,
          images: variantImages[pair.variantKey] || []
        };
      }
    });
    
    console.log("payload", payload)
    console.log("variantImages", variantImages)
    
    generateVariants(payload)
  };

  // Generate pairs - works with or without color
  const generatePairs = () => {
    if (selectedAttributes.length === 0) {
      setPairs([]);
      return;
    }

    // Check if all attributes have values
    const attributesWithValues = selectedAttributes.filter(
      (attr) => attr.selectedValues.length > 0
    );

    if (attributesWithValues.length === 0) {
      setPairs([]);
      return;
    }

    const colorAttribute = selectedAttributes.find(
      (attr) => (attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "colour") && attr.selectedValues.length > 0
    );

    const otherAttributes = selectedAttributes.filter(
      (attr) => attr.name.toLowerCase() !== "color" && attr.name.toLowerCase() !== "colour" && attr.selectedValues.length > 0
    );

    const cartesian = (arr) => {
      if (arr.length === 0) return [[]];
      return arr.reduce(
        (a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())),
        [[]]
      );
    };

    // If color exists, generate pairs based on color (grouped by color)
    if (colorAttribute && colorAttribute.selectedValues.length > 0) {
      const otherValueArrays = otherAttributes.map((attr) =>
        attr.selectedValues.map((val) => ({
          id: val.id,
          name: val.value,
          attributeName: attr.name
        }))
      );

      const otherCombinations = otherValueArrays.length > 0
        ? cartesian(otherValueArrays)
        : [[]];

      const generatedPairs = colorAttribute.selectedValues.map((colorVal) => {
        const combinations = otherCombinations.map((combination) => {
          const comboArray = Array.isArray(combination) ? combination : [combination];
          return comboArray.filter(item => item !== undefined && item !== null);
        }).filter(combo => combo.length > 0 || otherAttributes.length === 0);

        return {
          color: colorVal.value,
          colorId: colorVal.id,
          values: combinations,
          variantKey: `color_${colorVal.id}`
        };
      });

      setPairs(generatedPairs);
      console.log("Generated Pairs (with color):", generatedPairs);
    } else {
      // No color attribute - generate all combinations from all attributes
      const allValueArrays = attributesWithValues.map((attr) =>
        attr.selectedValues.map((val) => ({
          id: val.id,
          name: val.value,
          attributeName: attr.name
        }))
      );

      const allCombinations = cartesian(allValueArrays);

      const generatedPairs = allCombinations.map((combination, idx) => {
        const comboArray = Array.isArray(combination) ? combination : [combination];
        const filteredCombo = comboArray.filter(item => item !== undefined && item !== null);
        const allIds = filteredCombo.map(v => v.id);
        const variantKey = `variant_${allIds.join('_')}`;

        return {
          color: null,
          colorId: null,
          values: [filteredCombo],
          variantKey: variantKey
        };
      });

      setPairs(generatedPairs);
      console.log("Generated Pairs (no color):", generatedPairs);
    }
  };

  // const handleShowCombinations = () => {
  //   generatePairs();
  //   setShowCombination(!showCombination);
  // };

  useEffect(() => {
    if (values.length === 0) return;
    console.log("values", values)

    setAttributesValues((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === values[0]?.attribute_id);

      if (existingIndex !== -1) {
        return prev;
      }
console.log("values", values[0],"====>",values[0]?.values?.map((i) => ({ id: i.id, value: i.value })))
      return [
        ...prev,
        {
          id: values[0]?.attribute_id,
          values: values[0]?.values?.map((i) => ({ id: i.id, value: i.value })),
        },
      ];
    });
  }, [values]);


useEffect(() => {

    generatePairs();
  
}, [selectedAttributes]);

  return (
    <div className="create-product-variants mx-auto">
      <h2>Create Product Variants</h2>

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
              onClick={() => handleRemoveAttribute(attribute.id,attribute.name)}
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

      {/* {selectedAttributes.length > 0 && (
        <button className="submit-variants mb-4" onClick={handleShowCombinations}>
          {showCombination ? "Hide Combinations" : "Show Combinations"}
        </button>
      )} */}

      { pairs.length > 0  &&(
        <div className="table-responsive mb-4">
          <table className="table table-hover table-bordered user-management-table auction-category-list">
            <thead className="border-gray">
              <tr>
                <th>Sr No.</th>
                {pairs.length > 0 && pairs[0]?.colorId && (
                  <th>Color</th>
                )}
                <th>Images</th>
                {tableAttrib
                  .filter(attr => attr.toLowerCase() !== "color" && attr.toLowerCase() !== "colour")
                  .map((attr, idx) => (
                    <th key={idx}>{attr}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair, pairIdx) => {
                const hasColor = pair.colorId !== null && pair.colorId !== undefined;
                const valueCombos = pair.values && pair.values.length > 0 ? pair.values : [[]];
                
                return (
                  <>
                    {valueCombos.length > 0 ? (
                      valueCombos.map((valueCombo, comboIdx) => (
                        <tr key={`${pairIdx}-${comboIdx}`}>
                          {comboIdx === 0 && (
                            <td rowSpan={valueCombos.length}>
                              {pairIdx + 1}
                            </td>
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
                                    onChange={(e) => handleVariantImageUpload(e, pair.colorId, true, setColorImages, setVariantImages, colorImages, variantImages)}
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
                                    onChange={(e) => handleVariantImageUpload(e, pair.variantKey, false, setColorImages, setVariantImages, colorImages, variantImages)}
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
                              .filter(attr => attr.toLowerCase() !== "color" && attr.toLowerCase() !== "colour")
                              .map((attr, idx) => (
                                <td key={idx}>-</td>
                              ))
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr key={pairIdx}>
                        <td>{pairIdx + 1}</td>
                        {hasColor && (
                          <td className="fw-bold">{pair.color}</td>
                        )}
                        <td>
                          {pair.colorId ? (
                            <>
                              <input
                                type="file"
                                className="form-control form-control-sm"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleVariantImageUpload(e, pair.colorId, true, setColorImages, setVariantImages, colorImages, variantImages)}
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
                                onChange={(e) => handleVariantImageUpload(e, pair.variantKey, false, setColorImages, setVariantImages, colorImages, variantImages)}
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
                          .filter(attr => attr.toLowerCase() !== "color" && attr.toLowerCase() !== "colour")
                          .map((attr, idx) => (
                            <td key={idx}>-</td>
                          ))}
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedAttributes.length > 0 && (
        <button onClick={handleSubmit} className="submit-variants">
          Submit Variants
        </button>
      )}
    </div>
  );
};

export default CreateVariants;