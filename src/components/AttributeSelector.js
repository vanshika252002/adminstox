import React, { useState } from "react";
import { FormLabel } from "react-bootstrap";

const AttributeSelector = ({ selectedAttributes, onAttributesChange }) => {
  const availableKeywords = [
    'Color', 
    'Edition', 
    'Grading Service', 
    'Year', 
    'Signed By',
    'Platform',
    'Grade',
  ];
const handleAddKeyword = (selectedKey) => {
    if (!selectedKey || selectedAttributes.some(kw => kw.key === selectedKey)) {
      return;
    }
    const newAttributes = [...selectedAttributes, { id: Date.now(), key: selectedKey, value: "" }];
    onAttributesChange(newAttributes);
  };

  const handleValueChange = (id, newValue) => {
    const newAttributes = selectedAttributes.map(kw => 
      kw.id === id ? { ...kw, value: newValue } : kw
    );
    onAttributesChange(newAttributes);
  };

  const handleRemoveKeyword = (id) => {
    const newAttributes = selectedAttributes.filter(kw => kw.id !== id);
    onAttributesChange(newAttributes);
  };


  return (
    <div className="col-md-12 mb-3">
      <FormLabel className="text-dark fw-600">Select Attributes</FormLabel>
      <div className="form-text mb-2">
        What sets the item apart from others like it? Add specific details.
      </div>
      
      <select 
        className="form-select mb-3" 
        onChange={(e) => handleAddKeyword(e.target.value)}
        value="" 
      >
        <option value="" disabled>Add an optional field...</option>
        {availableKeywords
          .filter(kw => !selectedAttributes.some(attr => attr.key === kw))
          .map(kw => (
            <option key={kw} value={kw}>{kw}</option>
        ))}
      </select>
      
      {selectedAttributes.map(kw => (
        <div key={kw.id} className="input-group mb-2">
          <span className="input-group-text" style={{ minWidth: '150px' }}>
            {kw.key}:
          </span>
          <input
            type="text"
            className="form-control"
            placeholder={`Enter value for ${kw.key}`}
            value={kw.value}
            onChange={(e) => handleValueChange(kw.id, e.target.value)}
          />
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={() => handleRemoveKeyword(kw.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttributeSelector;
