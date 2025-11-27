import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  generate_variants,
  edit_variants,
} from "../../reduxData/user/userAction";
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
  const [editedAttributes, setEditedAttributes] = useState([]);
  const [editAttributeValues, setEditAttributeValues] = useState({});

  const listAttributes = useGetAttributes();
  const token = useSelector((state) => state.auth.accessToken);
  const { productId } = useParams();
  const { list, handleDeleteVariant, fetchData } = useVariantsList(
    token,
    productId
  );
  const { values } = useGetAttributesValues(selectedId);

  const isColorAttribute = useCallback((attrName) => {
    return COLOR_ATTRIBUTE_NAMES.includes(attrName.toLowerCase());
  }, []);

  const handleAddAttribute = useCallback(
    (e) => {
      const value = JSON.parse(e.target.value);
      const exists = selectedAttributes.some((attr) => attr.id === value.id);

      if (!exists) {
        console.log("Adding attribute:", value, "Current selectedAttributes:", selectedAttributes);
        console.log("Current combinationImages before adding attribute:", combinationImages);
        setSelectedId(value.id);
        setSelectedAttributes((prev) => {
          const newAttrs = [
            ...prev,
            { ...value, selectedValues: [] },
          ];
          console.log("Setting selectedAttributes to:", newAttrs);
          return newAttrs;
        });
        setTableAttrib((prev) => [...prev, value.name]);
      }

      e.target.value = "";
    },
    [selectedAttributes, combinationImages]
  );

  const handleSelectValue = useCallback((attributeId, e) => {
    
    console.log("selected value ====>>> ",e.target.selectedOptions[0]);

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
          selectedValues: [
            ...attr.selectedValues,
            { id: valueId, value: valueText },
          ],
        };
      })
    );

    e.target.value = "";
  }, []);

  const handleRemoveValue = useCallback((attributeId, valueId) => {
    setSelectedAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attributeId
          ? {
              ...attr,
              selectedValues: attr.selectedValues.filter(
                (v) => v.id !== valueId
              ),
            }
          : attr
      )
    );
  }, []);

  const handleRemoveAttribute = useCallback((attributeId, attributeName) => {
    setSelectedAttributes((prev) =>
      prev.filter((attr) => attr.id !== attributeId)
    );
    setTableAttrib((prev) => prev.filter((attr) => attr !== attributeName));
  }, []);

  const cartesian = useCallback((arr) => {
    if (arr.length === 0) return [[]];
    return arr.reduce(
      (a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())),
      [[]]
    );
  }, []);

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

    const allValueArrays = attributesWithValues.map((attr) =>
      attr.selectedValues.map((val) => ({
        id: val.id,
        name: val.value,
        attributeName: attr.name,
      }))
    );

    const allCombinations = cartesian(allValueArrays);

    const generatedPairs = allCombinations.map((combination, idx) => {
      const comboArray = Array.isArray(combination)
        ? combination
        : [combination];
      const filteredCombo = comboArray.filter(
        (item) => item !== undefined && item !== null
      );
      const allIds = filteredCombo.map((v) => v.id).sort((a, b) => a - b);
      const combinationKey = `combo_${allIds.join("_")}`;

      const colorValue = filteredCombo.find((val) => {
        const attr = selectedAttributes.find(
          (a) => a.name === val.attributeName
        );
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

    // Preserve images from old combinations when regenerating pairs
    setCombinationImages((prevImages) => {
      console.log("generatePairs: Preserving images. Previous images:", prevImages);
      console.log("generatePairs: Generated pairs count:", generatedPairs.length);
      const newImages = { ...prevImages };
      let hasChanges = false;

      generatedPairs.forEach((pair) => {
        // If this new combination key doesn't have images, try to find matching old key
        if (!newImages[pair.combinationKey]) {
          const newIds = pair.combinationKey.replace('combo_', '').split('_').map(Number).sort((a, b) => a - b);
          
          // Find old combinations where all their IDs exist in this new combination
          // This handles the case when a new attribute value is added (new combo has more IDs)
          const matchingOldKeys = Object.keys(prevImages).filter((oldKey) => {
            const oldIds = oldKey.replace('combo_', '').split('_').map(Number).sort((a, b) => a - b);
            // Check if all IDs in the OLD combination exist in the NEW combination
            // This means the old combo is a subset of the new combo
            return oldIds.length > 0 && oldIds.every(id => newIds.includes(id));
          });
          
          // If multiple matches, prefer the one with the most IDs (most specific match)
          const matchingOldKey = matchingOldKeys.length > 0 
            ? matchingOldKeys.reduce((best, current) => {
                const bestIds = best.replace('combo_', '').split('_').map(Number);
                const currentIds = current.replace('combo_', '').split('_').map(Number);
                return currentIds.length > bestIds.length ? current : best;
              })
            : null;
          
          if (matchingOldKey && prevImages[matchingOldKey]) {
            // Preserve images from the matching old combination
            newImages[pair.combinationKey] = prevImages[matchingOldKey];
            hasChanges = true;
            console.log(`✅ Preserving images from ${matchingOldKey} to ${pair.combinationKey}`, prevImages[matchingOldKey]);
          } else {
            console.log(`⚠️ No matching images found for ${pair.combinationKey}. New IDs:`, newIds, "Old keys:", Object.keys(prevImages));
          }
        } else {
          console.log(`✓ Images already exist for ${pair.combinationKey}:`, newImages[pair.combinationKey]);
        }
      });

      // Clean up images for combination keys that no longer exist
      const existingKeys = new Set(generatedPairs.map(p => p.combinationKey));
      Object.keys(newImages).forEach(key => {
        if (!existingKeys.has(key)) {
          console.log(`🗑️ Removing images for old key: ${key}`);
          delete newImages[key];
          hasChanges = true;
        }
      });

      console.log("generatePairs: Final images after preservation:", newImages);
      return hasChanges ? newImages : prevImages;
    });
  }, [selectedAttributes, isColorAttribute, cartesian]);

  const convertPairsToPendingVariants = useCallback(() => {
    if (pairs.length === 0) {
      setPendingVariants([]);
      return;
    }

    console.log("convertPairsToPendingVariants called with pairs:", pairs.length, "combinationImages:", Object.keys(combinationImages).length);

    const submittedList = list || [];
    const pendingList = [];
    const seenSignatures = new Set();

    pairs.forEach((pair, pairIdx) => {
      const valueCombo = pair.values || [];
      const allAttributeIds = valueCombo.map((v) => v.id);

      const attributes = valueCombo.map((val) => {
        const attr = selectedAttributes.find(
          (a) => a.name === val.attributeName
        );
        return {
          attribute_id: attr?.id || 0,
          attribute_name: val.attributeName || "",
          value: val.name,
        };
      });

      // Create a signature to check for duplicates within pending list
      const normalizeValue = (value) => {
        // Handle null, undefined, empty string, and "-" as the same
        if (value === null || value === undefined || value === "" || value === "-") {
          return "-";
        }
        // Convert to string, lowercase, and trim
        const normalized = String(value).toLowerCase().trim();
        // Also handle string representations of null/undefined
        return normalized === "null" || normalized === "undefined" ? "-" : normalized;
      };

      const createSignature = (attrs) => {
        if (!attrs || attrs.length === 0) {
          return "";
        }
        return attrs
          .map((attr) => {
            const attrId = attr.attribute_id || 0;
            // Handle both value and attribute_value_id (in case value is null but we have the ID)
            const attrValue = normalizeValue(attr.value !== null && attr.value !== undefined ? attr.value : "-");
            return `${attrId}:${attrValue}`;
          })
          .sort()
          .join("|");
      };

      const pendingSignature = createSignature(attributes);

      // Check if this variant already exists in submitted list
      const isDuplicateOfSubmitted = submittedList.some((submittedVariant) => {
        if (!submittedVariant?.attribute || submittedVariant.attribute.length === 0) {
          return false;
        }
        const submittedSignature = createSignature(submittedVariant.attribute);
        const matches = pendingSignature === submittedSignature;
        if (matches) {
          console.log("🚫 Blocking duplicate at creation:", pendingSignature);
        }
        return matches;
      });

      // Check if this variant already exists in pending list (within current batch)
      const isDuplicateInPending = seenSignatures.has(pendingSignature);

      // Only add if not a duplicate
      if (!isDuplicateOfSubmitted && !isDuplicateInPending) {
        seenSignatures.add(pendingSignature);
        pendingList.push({
          temp_id: `pending_${pendingList.length}`,
          status: "pending",
          attribute: attributes,
          images: combinationImages[pair.combinationKey] || [],
          created_at: new Date().toISOString(),
          _payload: {
            attribute_value_ids: allAttributeIds,
            images: combinationImages[pair.combinationKey] || [],
          },
        });
      } else {
        console.log("Skipping duplicate variant:", pendingSignature, isDuplicateOfSubmitted ? "(in submitted)" : "(in pending)");
      }
    });

    console.log("Setting pending variants:", pendingList.length, "out of", pairs.length, "pairs");
    setPendingVariants(pendingList);
  }, [pairs, combinationImages, selectedAttributes, list]);

  const isVariantDuplicate = useCallback((pendingVariant, submittedList) => {
    if (!submittedList || submittedList.length === 0) {
      return false;
    }
    if (!pendingVariant?.attribute || pendingVariant.attribute.length === 0) {
      return false;
    }

    const normalizeValue = (value) => {
      // Handle null, undefined, empty string, and "-" as the same
      if (value === null || value === undefined || value === "" || value === "-") {
        return "-";
      }
      // Convert to string, lowercase, and trim
      const normalized = String(value).toLowerCase().trim();
      // Also handle string representations of null/undefined
      return normalized === "null" || normalized === "undefined" ? "-" : normalized;
    };

    // Create signature with all attributes sorted by attribute_id
    const createSignature = (attributes) => {
      if (!attributes || attributes.length === 0) {
        return "";
      }
      return attributes
        .map((attr) => {
          const attrId = attr.attribute_id || 0;
          // Handle both value and attribute_value_id (in case value is null but we have the ID)
          const attrValue = normalizeValue(attr.value !== null && attr.value !== undefined ? attr.value : "-");
          return `${attrId}:${attrValue}`;
        })
        .sort()
        .join("|");
    };

    const pendingSignature = createSignature(pendingVariant.attribute);
    console.log("🔍 Checking duplicate - Pending signature:", pendingSignature, "Attributes:", pendingVariant.attribute);

    const isDuplicate = submittedList.some((submittedVariant) => {
      if (
        !submittedVariant?.attribute ||
        submittedVariant.attribute.length === 0
      ) {
        return false;
      }

      const submittedSignature = createSignature(submittedVariant.attribute);
      const matches = pendingSignature === submittedSignature;
      
      if (matches) {
        console.log("🔴 DUPLICATE FOUND:", {
          pending: pendingSignature,
          submitted: submittedSignature,
          pendingVariant: pendingVariant.attribute,
          submittedVariant: submittedVariant.attribute
        });
      } else {
        console.log("✓ Not duplicate:", {
          pending: pendingSignature,
          submitted: submittedSignature
        });
      }
      return matches;
    });

    return isDuplicate;
  }, []);

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
          setSelectedAttributes([]);
          setPairs([]);
          setTableAttrib([]);
          setCombinationImages({});
          setPendingVariants([]);
          fetchData();
        }
        window.scrollTo({ top: "0", behavior: "smooth" });
      } catch (error) {
        console.error("Error generating variants:", error);
      }
    },
    [productId, token, fetchData]
  );

  const handleSubmit = useCallback(() => {
    console.log("handleSubmit called with pendingVariants:", pendingVariants.length);
    
    if (pendingVariants.length === 0) {
      toast.warning("No variants to submit");
      return;
    }

    const submittedList = list || [];
    console.log("Checking against submitted list:", submittedList.length, "variants");
    
    const duplicates = [];
    const uniqueVariants = [];
    const seenSignatures = new Set();

    // Check for duplicates against submitted list AND within pending list
    const normalizeValue = (value) => {
      // Handle null, undefined, empty string, and "-" as the same
      if (value === null || value === undefined || value === "" || value === "-") {
        return "-";
      }
      // Convert to string, lowercase, and trim
      const normalized = String(value).toLowerCase().trim();
      // Also handle string representations of null/undefined
      return normalized === "null" || normalized === "undefined" ? "-" : normalized;
    };

    const createSignature = (attributes) => {
      if (!attributes || attributes.length === 0) {
        return "";
      }
      return attributes
        .map((attr) => {
          const attrId = attr.attribute_id || 0;
          // Handle both value and attribute_value_id (in case value is null but we have the ID)
          const attrValue = normalizeValue(attr.value !== null && attr.value !== undefined ? attr.value : "-");
          return `${attrId}:${attrValue}`;
        })
        .sort()
        .join("|");
    };

    pendingVariants.forEach((pendingVariant) => {
      const signature = createSignature(pendingVariant.attribute || []);

      if (!signature) {
        console.warn("Variant has no signature:", pendingVariant);
        return;
      }

      // Check if duplicate in submitted list
      const isDuplicateOfSubmitted = isVariantDuplicate(pendingVariant, submittedList);
      
      // Check if duplicate in pending list (already seen)
      const isDuplicateInPending = seenSignatures.has(signature);

      if (isDuplicateOfSubmitted || isDuplicateInPending) {
        duplicates.push({
          variant: pendingVariant,
          type: isDuplicateOfSubmitted ? "submitted" : "pending",
          signature: signature
        });
        console.log("Found duplicate:", signature, isDuplicateOfSubmitted ? "(in submitted)" : "(in pending)");
      } else {
        seenSignatures.add(signature);
        uniqueVariants.push(pendingVariant);
      }
    });

    console.log("Duplicate check results:", {
      duplicates: duplicates.length,
      unique: uniqueVariants.length,
      total: pendingVariants.length
    });

    if (duplicates.length > 0) {
      const duplicateDetails = duplicates
        .map((dup) => {
          const attrs = dup.variant.attribute
            ?.map((a) => `${a.attribute_name}: ${a.value}`)
            .join(", ");
          return attrs;
        })
        .join("; ");

      const duplicateType = duplicates.some(d => d.type === "submitted")
        ? "already exist in submitted list" 
        : "are duplicates within pending list";

      toast.error(
        `${duplicates.length} variant(s) ${duplicateType} and cannot be submitted. Please remove duplicates before submitting.`
      );

      console.error("Submission blocked due to duplicates:", duplicates);
      return; // Block submission
    }

    if (uniqueVariants.length === 0) {
      toast.warning("No valid variants to submit after removing duplicates");
      return;
    }

    console.log("Submitting", uniqueVariants.length, "unique variants");
    const payload = uniqueVariants.map((variant) => variant._payload);
    generateVariants(payload);
  }, [pendingVariants, list, isVariantDuplicate, generateVariants]);

  const handleSubmitPending = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

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

  const handleDeleteWithConfirmation = useCallback(
    (variantId) => {
      handleDeleteVariant(variantId);
    },
    [handleDeleteVariant]
  );

  const handleDeletePending = useCallback((tempId) => {
    const pairIdxMatch = tempId.match(/pending_(\d+)/);
    if (pairIdxMatch) {
      const pairIdx = parseInt(pairIdxMatch[1]);

      setPairs((prevPairs) => {
        const pairToDelete = prevPairs[pairIdx];

        if (pairToDelete?.combinationKey) {
          setCombinationImages((prevImages) => {
            const newImages = { ...prevImages };
            delete newImages[pairToDelete.combinationKey];
            return newImages;
          });
        }

        const deletedValueIds = (pairToDelete?.values || []).map((v) => v.id);

        const remainingPairs = prevPairs.filter((_, idx) => idx !== pairIdx);

        const usedValueIds = new Set();
        remainingPairs.forEach((pair) => {
          (pair?.values || []).forEach((val) => {
            usedValueIds.add(val.id);
          });
        });

        setSelectedAttributes((prevSelectedAttributes) => {
          let updatedAttributes = [...prevSelectedAttributes];
          let hasChanges = false;

          deletedValueIds.forEach((valueId) => {
            if (!usedValueIds.has(valueId)) {
              const valueObj = pairToDelete?.values?.find(
                (v) => v.id === valueId
              );
              if (valueObj) {
                const attributeIndex = updatedAttributes.findIndex(
                  (attr) => attr.name === valueObj.attributeName
                );
                if (attributeIndex !== -1) {
                  const originalLength =
                    updatedAttributes[attributeIndex].selectedValues.length;
                  updatedAttributes[attributeIndex] = {
                    ...updatedAttributes[attributeIndex],
                    selectedValues: updatedAttributes[
                      attributeIndex
                    ].selectedValues.filter((v) => v.id !== valueId),
                  };

                  if (
                    updatedAttributes[attributeIndex].selectedValues.length <
                    originalLength
                  ) {
                    hasChanges = true;
                  }
                }
              }
            }
          });

          return hasChanges ? updatedAttributes : prevSelectedAttributes;
        });

        return remainingPairs;
      });
    }

    setPendingVariants((prev) => prev.filter((v) => v.temp_id !== tempId));
  }, []);

  const handleDeleteCombination = useCallback((pairIdx) => {
    setPairs((prevPairs) => {
      const pairToDelete = prevPairs[pairIdx];

      if (pairToDelete?.combinationKey) {
        setCombinationImages((prevImages) => {
          const newImages = { ...prevImages };
          delete newImages[pairToDelete.combinationKey];
          return newImages;
        });
      }

      const deletedValueIds = (pairToDelete?.values || []).map((v) => v.id);
      const remainingPairs = prevPairs.filter((_, idx) => idx !== pairIdx);

      const usedValueIds = new Set();
      remainingPairs.forEach((pair) => {
        (pair?.values || []).forEach((val) => {
          usedValueIds.add(val.id);
        });
      });

      setSelectedAttributes((prevSelectedAttributes) => {
        let updatedAttributes = [...prevSelectedAttributes];
        let hasChanges = false;

        deletedValueIds.forEach((valueId) => {
          if (!usedValueIds.has(valueId)) {
            const valueObj = pairToDelete?.values?.find(
              (v) => v.id === valueId
            );
            if (valueObj) {
              const attributeIndex = updatedAttributes.findIndex(
                (attr) => attr.name === valueObj.attributeName
              );
              if (attributeIndex !== -1) {
                const originalLength =
                  updatedAttributes[attributeIndex].selectedValues.length;
                updatedAttributes[attributeIndex] = {
                  ...updatedAttributes[attributeIndex],
                  selectedValues: updatedAttributes[
                    attributeIndex
                  ].selectedValues.filter((v) => v.id !== valueId),
                };

                if (
                  updatedAttributes[attributeIndex].selectedValues.length <
                  originalLength
                ) {
                  hasChanges = true;
                }
              }
            }
          }
        });

        return hasChanges ? updatedAttributes : prevSelectedAttributes;
      });

      return remainingPairs;
    });
  }, []);

  const handleEditVariant = useCallback(
    async (variant) => {
      setEditingVariant(variant);

      setEditImages(variant?.images || []);

      const initialAttributes =
        variant?.attribute?.map((attr) => ({
          attribute_id: attr.attribute_id,
          attribute_name: attr.attribute_name,
          value: attr.value,
          value_id: attr.value_id || attr.attribute_value_id || null,
        })) || [];

      setEditedAttributes(initialAttributes);

      setEditAttributeValues({});

      const valuesMap = {};

      for (const attr of initialAttributes) {
        try {
          const attrValues = attributesValues.find(
            (av) => av.id === attr.attribute_id
          );
          if (
            attrValues &&
            attrValues.values &&
            Array.isArray(attrValues.values)
          ) {
            valuesMap[attr.attribute_id] = attrValues.values;
          } else {
            const res = await get_attributes_values(token, attr.attribute_id);
            if (res?.data) {
              let valuesArray = [];

              if (Array.isArray(res.data) && res.data.length > 0) {
                valuesArray = res.data[0]?.values || [];
              } else if (
                res.data.data &&
                Array.isArray(res.data.data) &&
                res.data.data.length > 0
              ) {
                valuesArray = res.data.data[0]?.values || [];
              } else if (res.data.values && Array.isArray(res.data.values)) {
                valuesArray = res.data.values;
              } else if (Array.isArray(res.data)) {
                valuesArray = res.data;
              }

              if (Array.isArray(valuesArray) && valuesArray.length > 0) {
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
          console.error(
            `Error fetching values for attribute ${attr.attribute_id}:`,
            error
          );
          valuesMap[attr.attribute_id] = [];
        }

        if (!Array.isArray(valuesMap[attr.attribute_id])) {
          valuesMap[attr.attribute_id] = [];
        }
      }

      setEditAttributeValues(valuesMap);
    },
    [attributesValues, token]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingVariant(null);
    setEditImages([]);
    setEditedAttributes([]);
    setEditAttributeValues({});
  }, []);

  const handleChangeEditAttributeValue = useCallback(
    (attributeId, valueId, valueText) => {
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
    },
    []
  );

  const handleEditImageUpload = useCallback(async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }

      const { upload_multiple_image } = await import(
        "../../reduxData/user/userAction"
      );
      const res = await upload_multiple_image(
        formData,
        localStorage.getItem("token")
      );

      if (res?.data?.data) {
        setEditImages((prev) => [...prev, ...res.data.data]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    }
  }, []);

  const handleRemoveEditImage = useCallback((imageIndex) => {
    setEditImages((prev) => prev.filter((_, idx) => idx !== imageIndex));
  }, []);

  const isEditedVariantDuplicate = useCallback(
    (editedAttributes, submittedList, currentVariantId) => {
      if (!submittedList || submittedList.length === 0) return false;
      if (!editedAttributes || editedAttributes.length === 0) return false;

      const normalizeValue = (value) =>
        String(value || "")
          .toLowerCase()
          .trim();

      const editingSignature = editedAttributes
        .map((attr) => `${attr.attribute_id}:${normalizeValue(attr.value)}`)
        .sort()
        .join("|");

      return submittedList.some((submittedVariant) => {
        if (submittedVariant.variant_id === currentVariantId) {
          return false;
        }

        if (
          !submittedVariant?.attribute ||
          submittedVariant.attribute.length === 0
        ) {
          return false;
        }

        const submittedSignature = submittedVariant.attribute
          .map((attr) => `${attr.attribute_id}:${normalizeValue(attr.value)}`)
          .sort()
          .join("|");

        return editingSignature === submittedSignature;
      });
    },
    []
  );

  const handleSubmitEdit = useCallback(async () => {
    console.log("first 1");
    if (!editingVariant) return;
    console.log("first 2");

    const submittedList = list || [];
    if (
      isEditedVariantDuplicate(
        editedAttributes,
        submittedList,
        editingVariant.variant_id
      )
    ) {
      const duplicateDetails = editedAttributes
        ?.map((a) => `${a.attribute_name}: ${a.value}`)
        .join(", ");

      toast.error(
        `This variant already exists in the submitted list. Duplicate: ${duplicateDetails}. Please change the attributes.`
      );
      return;
    }
    console.log("first 3");

    const attributeValueIds = editedAttributes
      .map((attr) => attr.value_id)
      .filter(Boolean);

    if (attributeValueIds.length === 0) {
      toast.error("Please select values for all attributes.");
      return;
    }
    console.log("first 4");
    if (attributeValueIds.length !== editedAttributes.length) {
      toast.error("Please ensure all attributes have valid values selected.");
      return;
    }
    console.log("first 5");

    const payload = {
      variantId: editingVariant.variant_id,
      attribute_value_ids: attributeValueIds,
      images: editImages,
    };
    console.log("first 6", payload);

    try {
      const res = await edit_variants(token, payload);
      if (res) {
        fetchData();
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Error updating variant:", error);
    }
  }, [
    editingVariant,
    editImages,
    editedAttributes,
    token,
    fetchData,
    handleCancelEdit,
    list,
    isEditedVariantDuplicate,
  ]);

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
    console.log("attributes json ", attributesValues );
  }, [values]);

  useEffect(() => {
    generatePairs();
  }, [generatePairs]);

  useEffect(() => {
    convertPairsToPendingVariants();
  }, [pairs, combinationImages, convertPairsToPendingVariants]);

  useEffect(() => {
    const allVariants = [...(list || []), ...pendingVariants];

    if (allVariants.length > 0) {
      const attributeMap = new Map();
      allVariants.forEach((variant) => {
        variant?.attribute?.forEach((attr) => {
          if (!attributeMap.has(attr?.attribute_id) && attr.attribute_name) {
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

  const allVariants = useMemo(() => {
    const submitted = (list || []).map((v) => ({ ...v, status: "submitted" }));
    const pending = pendingVariants.map((v) => ({ ...v, status: "pending" }));
    return [...submitted, ...pending];
  }, [list, pendingVariants]);

  const filteredVariants = useMemo(() => {
    // Only show submitted variants, exclude pending
    return allVariants.filter((variant) => variant?.status?.toLowerCase() !== "pending");
  }, [allVariants]);

  const variantStats = useMemo(() => {
    const submitted = allVariants.filter(
      (v) => v?.status === "submitted"
    ).length;
    const pending = allVariants.filter((v) => v?.status === "pending").length;

    return { submitted, pending };
  }, [allVariants]);

  const duplicateVariants = useMemo(() => {
    if (!list || list.length === 0 || pendingVariants.length === 0)
      return new Set();

    const duplicates = new Set();
    pendingVariants.forEach((pendingVariant) => {
      if (isVariantDuplicate(pendingVariant, list)) {
        duplicates.add(pendingVariant.temp_id);
      }
    });

    return duplicates;
  }, [pendingVariants, list, isVariantDuplicate]);

  return {
   
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
    handleDeleteCombination,
    isColorAttribute,

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