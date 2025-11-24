import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { generate_variants } from "../../reduxData/user/userAction";
import { useGetAttributes } from "./useGetAttributes";
import { useGetAttributesValues } from "../../utils/useGetAttributesValues";
import { useVariantsList, handleVariantImageUpload } from "./utils";

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
  const [colorImages, setColorImages] = useState({});
  const [variantImages, setVariantImages] = useState({});
  const [tableFields, setTableFields] = useState([]);
  const [filterTab, setFilterTab] = useState(STATUS_TABS.ALL);
  const [selectedId, setSelectedId] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [attributesValues, setAttributesValues] = useState([]);
  const [pendingVariants, setPendingVariants] = useState([]);

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

  // Generate variant pairs
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

    const colorAttribute = attributesWithValues.find(
      (attr) => isColorAttribute(attr.name) && attr.selectedValues.length > 0
    );

    const otherAttributes = attributesWithValues.filter(
      (attr) => !isColorAttribute(attr.name) && attr.selectedValues.length > 0
    );

    if (colorAttribute && colorAttribute.selectedValues.length > 0) {
      const otherValueArrays = otherAttributes.map((attr) =>
        attr.selectedValues.map((val) => ({
          id: val.id,
          name: val.value,
          attributeName: attr.name,
        }))
      );

      const otherCombinations =
        otherValueArrays.length > 0 ? cartesian(otherValueArrays) : [[]];

      const generatedPairs = colorAttribute.selectedValues.map((colorVal) => {
        const combinations = otherCombinations
          .map((combination) => {
            const comboArray = Array.isArray(combination) ? combination : [combination];
            return comboArray.filter((item) => item !== undefined && item !== null);
          })
          .filter((combo) => combo.length > 0 || otherAttributes.length === 0);

        return {
          color: colorVal.value,
          colorId: colorVal.id,
          values: combinations,
          variantKey: `color_${colorVal.id}`,
        };
      });

      setPairs(generatedPairs);
    } else {
      const allValueArrays = attributesWithValues.map((attr) =>
        attr.selectedValues.map((val) => ({
          id: val.id,
          name: val.value,
          attributeName: attr.name,
        }))
      );

      const allCombinations = cartesian(allValueArrays);

      const generatedPairs = allCombinations.map((combination) => {
        const comboArray = Array.isArray(combination) ? combination : [combination];
        const filteredCombo = comboArray.filter(
          (item) => item !== undefined && item !== null
        );
        const allIds = filteredCombo.map((v) => v.id);
        const variantKey = `variant_${allIds.join("_")}`;

        return {
          color: null,
          colorId: null,
          values: [filteredCombo],
          variantKey: variantKey,
        };
      });

      setPairs(generatedPairs);
    }
  }, [selectedAttributes, isColorAttribute, cartesian]);

  // Convert pairs to pending variants format
  const convertPairsToPendingVariants = useCallback(() => {
    if (pairs.length === 0) {
      setPendingVariants([]);
      return;
    }

    const pendingList = pairs.flatMap((pair, pairIdx) => {
      if (pair.colorId) {
        const valueCombos = pair.values && pair.values.length > 0 ? pair.values : [[]];

        return valueCombos.map((valueCombo, comboIdx) => {
          const otherIds = valueCombo.map((v) => v.id);
          const allAttributeIds = [pair.colorId, ...otherIds];

          // Build attribute array for display
          const attributes = [];
          if (pair.colorId) {
            const colorAttr = selectedAttributes.find((attr) =>
              attr.selectedValues.some((v) => v.id === pair.colorId)
            );
            if (colorAttr) {
              const colorValue = colorAttr.selectedValues.find((v) => v.id === pair.colorId);
              attributes.push({
                attribute_id: colorAttr.id,
                attribute_name: colorAttr.name,
                value: colorValue?.value || "",
              });
            }
          }

          valueCombo.forEach((val) => {
            const attr = selectedAttributes.find((a) => a.name === val.attributeName);
            if (attr) {
              attributes.push({
                attribute_id: attr.id,
                attribute_name: attr.name,
                value: val.name,
              });
            }
          });

          return {
            temp_id: `pending_${pairIdx}_${comboIdx}`,
            status: "pending",
            attribute: attributes,
            images: colorImages[pair.colorId] || [],
            created_at: new Date().toISOString(),
            _payload: {
              attribute_value_ids: allAttributeIds,
              images: colorImages[pair.colorId] || [],
            },
          };
        });
      } else {
        const valueCombo = pair.values && pair.values.length > 0 ? pair.values[0] : [];
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
          images: variantImages[pair.variantKey] || [],
          created_at: new Date().toISOString(),
          _payload: {
            attribute_value_ids: allAttributeIds,
            images: variantImages[pair.variantKey] || [],
          },
        };
      }
    });

    setPendingVariants(pendingList);
  }, [pairs, colorImages, variantImages, selectedAttributes]);

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
          setColorImages({});
          setVariantImages({});
          setPendingVariants([]);
          // Refresh variants list (submitted list)
          fetchData();
          toast.success("Variants created successfully!");
        }
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

  // Handle image upload
  const handleImageUpload = useCallback(
    (e, identifier, hasColor) => {
      handleVariantImageUpload(
        e,
        identifier,
        hasColor,
        setColorImages,
        setVariantImages,
        colorImages,
        variantImages
      );
    },
    [colorImages, variantImages]
  );

  // Handle delete with confirmation
  const handleDeleteWithConfirmation = useCallback(
    (variantId) => {
      handleDeleteVariant(variantId);
    },
    [handleDeleteVariant]
  );

  // Handle delete pending variant
  const handleDeletePending = useCallback((tempId) => {
    setPendingVariants((prev) => prev.filter((v) => v.temp_id !== tempId));
  }, []);

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
    colorImages,
    variantImages,
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
  };
};

