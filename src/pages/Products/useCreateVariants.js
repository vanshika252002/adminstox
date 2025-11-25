import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { generate_variants, edit_variants } from "../../reduxData/user/userAction";
import { useGetAttributes } from "./useGetAttributes";
import { useGetAttributesValues } from "../../utils/useGetAttributesValues";
import { useVariantsList, handleVariantImageUpload } from "./utils";
import { get_attributes_values } from "../../reduxData/user/userAction";

export const STATUS_TABS = {
  ALL: "All",
  SUBMITTED: "Submitted",
  PENDING: "Pending",
};

const COLOR_ATTRIBUTE_NAMES = ["color", "colour"];

export const useCreateVariants = () => {
  // State management
  const [tableAttrib, setTableAttrib] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [combinationImages, setCombinationImages] = useState({});
  const [tableFields, setTableFields] = useState([]);
  const [filterTab, setFilterTab] = useState(STATUS_TABS.ALL);
  const [selectedId, setSelectedId] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [attributesValues, setAttributesValues] = useState([]);
  const [pendingVariants, setPendingVariants] = useState([]);
  const [editingVariant, setEditingVariant] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [editedAttributes, setEditedAttributes] = useState([]); // Edited attribute values
  const [editAttributeValues, setEditAttributeValues] = useState({}); // Values for each attribute

  // Hooks
  const listAttributes = useGetAttributes();
  const token = useSelector((state) => state.auth.accessToken);
  const { productId } = useParams();
  const { list, handleDeleteVariant, fetchData } = useVariantsList(token, productId);
  const { values } = useGetAttributesValues(selectedId);

  // Helper function to check if attribute is color
  const isColorAttribute = useCallback((attrName) => {
    return COLOR_ATTRIBUTE_NAMES.includes(attrName.toLowerCase());
  }, []);

  // Handle adding attribute
  const handleAddAttribute = useCallback(
    (e) => {
      const value = JSON.parse(e.target.value);
      const exists = selectedAttributes.some((attr) => attr.id === value.id);

      if (!exists) {
        setSelectedId(value.id);
        setSelectedAttributes((prev) => [...prev, { ...value, selectedValues: [] }]);
        setTableAttrib((prev) => [...prev, value.name]);
      }

      e.target.value = "";
    },
    [selectedAttributes]
  );

  // Handle selecting attribute value
  const handleSelectValue = useCallback((attributeId, e) => {
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
  }, []);

  // Handle removing attribute value
  const handleRemoveValue = useCallback((attributeId, valueId) => {
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
  }, []);

  // Handle removing attribute
  const handleRemoveAttribute = useCallback((attributeId, attributeName) => {
    setSelectedAttributes((prev) => prev.filter((attr) => attr.id !== attributeId));
    setTableAttrib((prev) => prev.filter((attr) => attr !== attributeName));
  }, []);

  // Generate cartesian product
  const cartesian = useCallback((arr) => {
    if (arr.length === 0) return [[]];
    return arr.reduce(
      (a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())),
      [[]]
    );
  }, []);

  // Generate variant pairs - each combination gets its own unique key
  const generatePairs = useCallback(() => {
    if (selectedAttributes.length === 0) {
      setPairs([]);
      return;
    }

    const attributesWithValues = selectedAttributes.filter(
      (attr) => attr.selectedValues.length > 0
    );

    if (attributesWithValues.length === 0) {
      setPairs([]);
      return;
    }

    // Create value arrays for all attributes
    const allValueArrays = attributesWithValues.map((attr) =>
      attr.selectedValues.map((val) => ({
        id: val.id,
        name: val.value,
        attributeName: attr.name,
      }))
    );

    // Generate all combinations
    const allCombinations = cartesian(allValueArrays);

    // Flatten to individual combinations, each with its own unique key
    const generatedPairs = allCombinations.map((combination, idx) => {
      const comboArray = Array.isArray(combination) ? combination : [combination];
      const filteredCombo = comboArray.filter(
        (item) => item !== undefined && item !== null
      );
      const allIds = filteredCombo.map((v) => v.id);
      const combinationKey = `combo_${allIds.join("_")}`;

      // Find color value if exists
      const colorValue = filteredCombo.find((val) => {
        const attr = selectedAttributes.find((a) => a.name === val.attributeName);
        return attr && isColorAttribute(attr.name);
      });

      return {
        combinationKey: combinationKey,
        values: filteredCombo,
        color: colorValue ? colorValue.name : null,
        colorId: colorValue ? colorValue.id : null,
      };
    });

    setPairs(generatedPairs);
  }, [selectedAttributes, isColorAttribute, cartesian]);

  // Convert pairs to pending variants format
  const convertPairsToPendingVariants = useCallback(() => {
    if (pairs.length === 0) {
      setPendingVariants([]);
      return;
    }

    const pendingList = pairs.map((pair, pairIdx) => {
      const valueCombo = pair.values || [];
      const allAttributeIds = valueCombo.map((v) => v.id);

      // Build attribute array for display
      const attributes = valueCombo.map((val) => {
        const attr = selectedAttributes.find((a) => a.name === val.attributeName);
        return {
          attribute_id: attr?.id || 0,
          attribute_name: val.attributeName || "",
          value: val.name,
        };
      });

      return {
        temp_id: `pending_${pairIdx}`,
        status: "pending",
        attribute: attributes,
        images: combinationImages[pair.combinationKey] || [],
        created_at: new Date().toISOString(),
        _payload: {
          attribute_value_ids: allAttributeIds,
          images: combinationImages[pair.combinationKey] || [],
        },
      };
    });

    setPendingVariants(pendingList);
  }, [pairs, combinationImages, selectedAttributes]);

  // Check if variant already exists in submitted list
  const isVariantDuplicate = useCallback((pendingVariant, submittedList) => {
    if (!submittedList || submittedList.length === 0) return false;
    if (!pendingVariant?.attribute || pendingVariant.attribute.length === 0) return false;

    // Normalize attribute values for comparison (case-insensitive, trimmed)
    const normalizeValue = (value) => String(value || "").toLowerCase().trim();

    // Build a signature for the pending variant: attribute_id:value pairs sorted
    const pendingSignature = pendingVariant.attribute
      .map((attr) => `${attr.attribute_id}:${normalizeValue(attr.value)}`)
      .sort()
      .join("|");

    return submittedList.some((submittedVariant) => {
      if (!submittedVariant?.attribute || submittedVariant.attribute.length === 0) {
        return false;
      }

      // Build signature for submitted variant
      const submittedSignature = submittedVariant.attribute
        .map((attr) => `${attr.attribute_id}:${normalizeValue(attr.value)}`)
        .sort()
        .join("|");

      // Compare signatures
      return pendingSignature === submittedSignature;
    });
  }, []);

  // Generate variants API call
  const generateVariants = useCallback(
    async (variantsPayload) => {
      if (!variantsPayload || variantsPayload.length === 0) return;

      const payload = {
        product_id: productId,
        variants: variantsPayload,
      };

      try {
        const res = await generate_variants(token, payload);
        if (res) {
          // Reset form
          setSelectedAttributes([]);
          setPairs([]);
          setTableAttrib([]);
          setCombinationImages({});
          setPendingVariants([]);
          // Refresh variants list (submitted list)
          fetchData();
          // toast.success("Variants created successfully!");
        }
        window.scrollTo({top:"0", behavior:"smooth"})
      } catch (error) {
        console.error("Error generating variants:", error);
      }
    },
    [productId, token, fetchData]
  );

  // Handle submit - submit pending variants
  const handleSubmit = useCallback(() => {
    if (pendingVariants.length === 0) {
      toast.warning("No variants to submit");
      return;
    }

    // Check for duplicates
    const submittedList = list || [];
    const duplicates = [];
    const uniqueVariants = [];

    pendingVariants.forEach((pendingVariant) => {
      if (isVariantDuplicate(pendingVariant, submittedList)) {
        duplicates.push(pendingVariant);
      } else {
        uniqueVariants.push(pendingVariant);
      }
    });

    // Show error if duplicates found
    if (duplicates.length > 0) {
      const duplicateDetails = duplicates
        .map((v) => {
          const attrs = v.attribute?.map((a) => `${a.attribute_name}: ${a.value}`).join(", ");
          return attrs;
        })
        .join("; ");

      toast.error(
        `${duplicates.length} variant(s) already exist and cannot be submitted. Duplicates: ${duplicateDetails}`
      );

      // Don't submit if there are duplicates - let user remove them first
      return;
    }

    // Submit only unique variants
    const payload = uniqueVariants.map((variant) => variant._payload);
    generateVariants(payload);
     
  }, [pendingVariants, list, isVariantDuplicate, generateVariants]);

  // Handle submit pending button
  const handleSubmitPending = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  // Handle image upload - now uses combination keys
  const handleImageUpload = useCallback(
    (e, combinationKey) => {
      handleVariantImageUpload(
        e,
        combinationKey,
        setCombinationImages,
        combinationImages
      );
    },
    [combinationImages]
  );

  // Handle delete with confirmation
  const handleDeleteWithConfirmation = useCallback(
    (variantId) => {
      handleDeleteVariant(variantId);
    },
    [handleDeleteVariant]
  );

  // Handle delete pending variant - removes from both pending list and combinations
  const handleDeletePending = useCallback((tempId) => {
    // Extract pair index from temp_id (format: pending_${pairIdx})
    const pairIdxMatch = tempId.match(/pending_(\d+)/);
    if (pairIdxMatch) {
      const pairIdx = parseInt(pairIdxMatch[1]);
      
      // Get the pair to delete to access its combinationKey and values
      setPairs((prevPairs) => {
        const pairToDelete = prevPairs[pairIdx];
        
        // Remove images for this combination if it exists
        if (pairToDelete?.combinationKey) {
          setCombinationImages((prevImages) => {
            const newImages = { ...prevImages };
            delete newImages[pairToDelete.combinationKey];
            return newImages;
          });
        }
        
        // Get value IDs from the pair being deleted
        const deletedValueIds = (pairToDelete?.values || []).map((v) => v.id);
        
        // Remove from pairs first to get remaining pairs
        const remainingPairs = prevPairs.filter((_, idx) => idx !== pairIdx);
        
        // Check which value IDs are still used in ANY other remaining pair combination
        // This ensures we only remove attribute values that are truly unused
        const usedValueIds = new Set();
        remainingPairs.forEach((pair) => {
          (pair?.values || []).forEach((val) => {
            usedValueIds.add(val.id);
          });
        });
        
        // Remove attribute values that are no longer used in any other pair combination
        // Use functional update to access current selectedAttributes
        setSelectedAttributes((prevSelectedAttributes) => {
          let updatedAttributes = [...prevSelectedAttributes];
          let hasChanges = false;
          
          deletedValueIds.forEach((valueId) => {
            // Only remove if this value ID is NOT used in any remaining pair
            if (!usedValueIds.has(valueId)) {
              // Find which attribute this value belongs to
              const valueObj = pairToDelete?.values?.find((v) => v.id === valueId);
              if (valueObj) {
                const attributeIndex = updatedAttributes.findIndex(
                  (attr) => attr.name === valueObj.attributeName
                );
                if (attributeIndex !== -1) {
                  const originalLength = updatedAttributes[attributeIndex].selectedValues.length;
                  updatedAttributes[attributeIndex] = {
                    ...updatedAttributes[attributeIndex],
                    selectedValues: updatedAttributes[attributeIndex].selectedValues.filter(
                      (v) => v.id !== valueId
                    ),
                  };
                  // Track if we actually removed a value
                  if (updatedAttributes[attributeIndex].selectedValues.length < originalLength) {
                    hasChanges = true;
                  }
                }
              }
            }
          });
          
          // Only return updated attributes if there were changes
          return hasChanges ? updatedAttributes : prevSelectedAttributes;
        });
        
        return remainingPairs;
      });
    }
    
    // Remove from pending variants
    setPendingVariants((prev) => prev.filter((v) => v.temp_id !== tempId));
  }, []);

  // Handle edit variant - open edit mode
  const handleEditVariant = useCallback(async (variant) => {
    setEditingVariant(variant);
    // Set initial images for editing
    setEditImages(variant?.images || []);
    
    // Initialize edited attributes with current values
    const initialAttributes = variant?.attribute?.map((attr) => ({
      attribute_id: attr.attribute_id,
      attribute_name: attr.attribute_name,
      value: attr.value,
      value_id: attr.value_id || attr.attribute_value_id || null,
    })) || [];
    
    setEditedAttributes(initialAttributes);
    
    // Initialize empty values map first
    setEditAttributeValues({});
    
    // Fetch attribute values for each attribute
    const valuesMap = {};
    
    // Fetch values for each attribute
    for (const attr of initialAttributes) {
      try {
        // Try to get from existing attributesValues first
        const attrValues = attributesValues.find((av) => av.id === attr.attribute_id);
        if (attrValues && attrValues.values && Array.isArray(attrValues.values)) {
          valuesMap[attr.attribute_id] = attrValues.values;
        } else {
          // Fetch from API if not in cache
          const res = await get_attributes_values(token, attr.attribute_id);
          if (res?.data) {
            // API response structure: res.data = [{ attribute_id: X, values: [{ id, value }, ...] }]
            // Or res.data = { data: [{ attribute_id: X, values: [...] }] }
            let valuesArray = [];
            
            // Handle different response structures
            if (Array.isArray(res.data) && res.data.length > 0) {
              // Structure: [{ attribute_id: X, values: [...] }]
              valuesArray = res.data[0]?.values || [];
            } else if (res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
              // Structure: { data: [{ attribute_id: X, values: [...] }] }
              valuesArray = res.data.data[0]?.values || [];
            } else if (res.data.values && Array.isArray(res.data.values)) {
              // Structure: { values: [...] }
              valuesArray = res.data.values;
            } else if (Array.isArray(res.data)) {
              // Direct array
              valuesArray = res.data;
            }
            
            // Ensure we have an array of objects with id and value
            if (Array.isArray(valuesArray) && valuesArray.length > 0) {
              // Check if values are in the correct format
              if (valuesArray[0]?.id && valuesArray[0]?.value) {
                valuesMap[attr.attribute_id] = valuesArray;
              } else {
                valuesMap[attr.attribute_id] = [];
              }
            } else {
              valuesMap[attr.attribute_id] = [];
            }
          } else {
            valuesMap[attr.attribute_id] = [];
          }
        }
      } catch (error) {
        console.error(`Error fetching values for attribute ${attr.attribute_id}:`, error);
        valuesMap[attr.attribute_id] = [];
      }
      
      // Ensure it's always an array
      if (!Array.isArray(valuesMap[attr.attribute_id])) {
        valuesMap[attr.attribute_id] = [];
      }
    }
    
    // Set all values at once after fetching
    setEditAttributeValues(valuesMap);
  }, [attributesValues, token]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingVariant(null);
    setEditImages([]);
    setEditedAttributes([]);
    setEditAttributeValues({});
  }, []);

  // Handle change attribute value in edit
  const handleChangeEditAttributeValue = useCallback((attributeId, valueId, valueText) => {
    setEditedAttributes((prev) =>
      prev.map((attr) =>
        attr.attribute_id === attributeId
          ? {
              ...attr,
              value_id: valueId,
              value: valueText,
            }
          : attr
      )
    );
  }, []);

  // Handle edit image upload
  const handleEditImageUpload = useCallback(async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }

      const { upload_multiple_image } = await import("../../reduxData/user/userAction");
      const res = await upload_multiple_image(formData, localStorage.getItem("token"));
      
      if (res?.data?.data) {
        setEditImages((prev) => [...prev, ...res.data.data]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    }
  }, []);

  // Handle remove edit image
  const handleRemoveEditImage = useCallback((imageIndex) => {
    setEditImages((prev) => prev.filter((_, idx) => idx !== imageIndex));
  }, []);

  // Check if edited variant would be duplicate (excluding itself)
  const isEditedVariantDuplicate = useCallback((editedAttributes, submittedList, currentVariantId) => {
    if (!submittedList || submittedList.length === 0) return false;
    if (!editedAttributes || editedAttributes.length === 0) return false;

    // Normalize attribute values for comparison (case-insensitive, trimmed)
    const normalizeValue = (value) => String(value || "").toLowerCase().trim();

    // Build a signature for the edited attributes: attribute_id:value pairs sorted
    const editingSignature = editedAttributes
      .map((attr) => `${attr.attribute_id}:${normalizeValue(attr.value)}`)
      .sort()
      .join("|");

    // Check against all submitted variants except the one being edited
    return submittedList.some((submittedVariant) => {
      // Skip the variant being edited
      if (submittedVariant.variant_id === currentVariantId) {
        return false;
      }

      if (!submittedVariant?.attribute || submittedVariant.attribute.length === 0) {
        return false;
      }

      // Build signature for submitted variant
      const submittedSignature = submittedVariant.attribute
        .map((attr) => `${attr.attribute_id}:${normalizeValue(attr.value)}`)
        .sort()
        .join("|");

      // Compare signatures
      return editingSignature === submittedSignature;
    });
  }, []);

  // Handle submit edit
  const handleSubmitEdit = useCallback(async () => {
    console.log("first 1")
    if (!editingVariant) return;
console.log("first 2")
    // Check for duplicates before submitting using edited attributes
    const submittedList = list || [];
    if (isEditedVariantDuplicate(editedAttributes, submittedList, editingVariant.variant_id)) {
      const duplicateDetails = editedAttributes
        ?.map((a) => `${a.attribute_name}: ${a.value}`)
        .join(", ");

      toast.error(
        `This variant already exists in the submitted list. Duplicate: ${duplicateDetails}. Please change the attributes.`
      );
      return;
    }
    console.log("first 3")

    // Extract attribute_value_ids from edited attributes
    const attributeValueIds = editedAttributes
      .map((attr) => attr.value_id)
      .filter(Boolean);

    if (attributeValueIds.length === 0) {
      toast.error("Please select values for all attributes.");
      return;
    }
console.log("first 4")
    if (attributeValueIds.length !== editedAttributes.length) {
      toast.error("Please ensure all attributes have valid values selected.");
      return;
    }
    console.log("first 5")

    // Create payload in the same format as add variant
    const payload = {
      variantId:editingVariant.variant_id,
      attribute_value_ids: attributeValueIds,
      images: editImages,
    };
    console.log("first 6",payload)

    try {
      const res = await edit_variants(token , payload);
      if (res) {
        fetchData(); // Refresh the list
        handleCancelEdit();
        // toast.success("Variant updated successfully!");
      }
    } catch (error) {
      console.error("Error updating variant:", error);
    }
  }, [editingVariant, editImages, editedAttributes, token, fetchData, handleCancelEdit, list, isEditedVariantDuplicate]);

  // Update attributes values when values change
  useEffect(() => {
    if (values.length === 0) return;

    setAttributesValues((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === values[0]?.attribute_id
      );

      if (existingIndex !== -1) {
        return prev;
      }

      return [
        ...prev,
        {
          id: values[0]?.attribute_id,
          values: values[0]?.values?.map((i) => ({ id: i.id, value: i.value })),
        },
      ];
    });
  }, [values]);

  // Generate pairs when selected attributes change
  useEffect(() => {
    generatePairs();
  }, [generatePairs]);

  // Convert pairs to pending variants when pairs or images change
  useEffect(() => {
    convertPairsToPendingVariants();
  }, [convertPairsToPendingVariants]);

  // Set table fields from existing variants (both submitted and pending)
  useEffect(() => {
    const allVariants = [...(list || []), ...pendingVariants];

    if (allVariants.length > 0) {
      const attributeMap = new Map();
      allVariants.forEach((variant) => {
        variant?.attribute?.forEach((attr) => {
          if (!attributeMap.has(attr?.attribute_id)) {
            attributeMap.set(attr?.attribute_id, {
              name: attr?.attribute_name,
              id: attr?.attribute_id,
            });
          }
        });
      });

      setTableFields([...attributeMap]);
    }
  }, [list, pendingVariants]);

  // Combine submitted (from API) and pending (local) variants
  const allVariants = useMemo(() => {
    const submitted = (list || []).map((v) => ({ ...v, status: "submitted" }));
    const pending = pendingVariants.map((v) => ({ ...v, status: "pending" }));
    return [...submitted, ...pending];
  }, [list, pendingVariants]);

  // Memoized computed values
  const filteredVariants = useMemo(() => {
    if (filterTab === STATUS_TABS.ALL) return allVariants;

    return allVariants.filter((variant) => {
      const status = variant?.status?.toLowerCase() || "submitted";
      return status === filterTab.toLowerCase();
    });
  }, [allVariants, filterTab]);

  const variantStats = useMemo(() => {
    const submitted = allVariants.filter((v) => v?.status === "submitted").length;
    const pending = allVariants.filter((v) => v?.status === "pending").length;

    return { submitted, pending };
  }, [allVariants]);

  // Check which pending variants are duplicates
  const duplicateVariants = useMemo(() => {
    if (!list || list.length === 0 || pendingVariants.length === 0) return new Set();

    const duplicates = new Set();
    pendingVariants.forEach((pendingVariant) => {
      if (isVariantDuplicate(pendingVariant, list)) {
        duplicates.add(pendingVariant.temp_id);
      }
    });

    return duplicates;
  }, [pendingVariants, list, isVariantDuplicate]);

  return {
    // State
    tableAttrib,
    pairs,
    combinationImages,
    tableFields,
    filterTab,
    selectedAttributes,
    attributesValues,
    pendingVariants,
    listAttributes,
    list,
    allVariants,
    filteredVariants,
    variantStats,
    duplicateVariants,
    setPendingVariants,

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
  };
};