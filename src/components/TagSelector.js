import React, { useState } from "react";
import { FormLabel } from "react-bootstrap";

const tagCategories = {
  "Condition & Completeness": [
    "Sealed",
    "Brand New",
    "Complete in Box",
    "Cartridge Only",
    "Box Only",
    "Raw",
    "Restored",
    "Excellent",
    "Very Good",
    "Good",
    "Acceptible",
  ],

  "Edition & Rarity": [
    "Uncirculated",
    "Discontinued",
    "1 of 1",
    "1st Edition",
    "First Print",
    "Greatest Hits",
    "Launch Edition",
    "Limited Edition",
    "Collectors Edition",
    "Player's Choice",
    "Complete Edition",
    "Demo",
    "Game Of The Year Edition",
    "Gold Edition",
    "Premium Edition",
    "Special Edition",
    "SteelBook Edition",
    "Ultimate Edition",
  ],

  "Grading & Authentication": [
    "Graded",
    "Professional Sports Authenticator (PSA)",
    "Certified Guaranty Company (CGC)",
    "Beckett Grading Services (BGS)",
    "Sportscard Guaranty (SCG)",
    "TAG",
    "WATA",
  ],

  "Provenance & Exclusivity": [
    "Convention Exclusive",
    "E3 Exclusive",
    "Employee Award/Item",
    "Giveaway Prize",
    "Movie Premier",
    "National Championship",
    "Nintendo of America Exclusive",
    "Not for Resale",
    "Pokémon Center Exclusive",
    "Rep Only",
    "Sweepstakes Prize",
    "Tournament Exclusive",
  ],

  "Development & Pre-Release": [
    "Beta Copy",
    "Debug",
    "Demo",
    "Dev Console",
    "Prototype",
    "Test Market",
  ],

  "Promotional & Display Items": [
    "Countertop Display",
    "Countertop Kiosk",
    "Display",
    "Display Case",
    "Fiber Optic Sign",
    "Full-size Kiosk",
    "Full-size Standee",
    "Marketing Material",
    "Neon Sign",
    "Official Showcase",
    "Press Kit",
    "Promo Only",
    "Superbrite Sign",
    "World Of Nintendo",
    "Nintendo Sign",
    "PlayStation Sign",
    "Sega Sign",
    "Xbox Sign",
  ],

  "Item Type": [
    "Arcade (Sit Down)",
    "Arcade (Upright)",
    "Booster Box",
    "Booster Pack",
    "Case Pack",
    "Catalogs",
    "Cocktail Arcade",
    "Factory Case",
  ],
};

const TagSelector = ({ selectedTags, onTagsChange }) => {

     const tagDefaultStyle = {
    background: '#f8f9fa', 
    border: '1px solid #dee2e6',
    color: '#212529',
    margin: '0.25rem',
    padding: '0.3rem 0.75rem',
    borderRadius: '50rem', 
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  };
  
  const tagSelectedStyle = {
    ...tagDefaultStyle, 
    background: 'var(--yellow-color, #ffc107)', 
    color: '#000',
    borderColor: 'var(--yellow-color, #ffc107)',
  };

  const handleTagClick = (tag) => {
    let newTags;
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter(t => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    onTagsChange(newTags);
  };
  return (
    <div className="col-md-12 mb-4">
      <FormLabel className="text-dark fw-600">Select Tags</FormLabel>
      <div className="form-text mb-2">Choose tags that apply to your item. This helps buyers find that grail they've been looking for.</div>

      {Object.entries(tagCategories).map(([category, tags]) => (
        <div key={category} className="mb-3">
          <h6 className="text-muted">{category}</h6>
          <div className="tag-container">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                style={selectedTags.includes(tag) ? tagSelectedStyle : tagDefaultStyle}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagSelector;