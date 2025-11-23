import React from "react";
import { usePlacesWidget } from "react-google-autocomplete";

const {REACT_APP_GOOGLE_API_KEY} = process.env;

const AutoInput = ({address,handleChange}) => {
    const {ref} = usePlacesWidget({
        apiKey: REACT_APP_GOOGLE_API_KEY,
        onPlaceSelected: (place) => {
            console.log(place);
            const areaZip = place.address_components[
                place.address_components.findIndex(
                  (obj) => obj.types[0] == "postal_code"
                )
              ]?.long_name
                ? place.address_components[
                    place.address_components.findIndex(
                      (obj) => obj.types[0] == "postal_code"
                    )
                  ]?.long_name
                : null;
            handleChange(place.formatted_address, "location");
            handleChange(areaZip, "zipcode");
        },
        options: {
            types: ["(regions)"]
          },
    });
    return (
        <input
        ref={ref}
        className="form-control"
        id="location"
        name="location"
        type="text"
        placeholder="Enter location"
        value={address}
        onChange={(e) => handleChange(e.target.value, "location")}
    />
    )
};

export default AutoInput;