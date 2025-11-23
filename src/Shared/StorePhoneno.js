import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { getCountries, getCountryCallingCode, isValidPhoneNumber } from "react-phone-number-input";
import en from 'react-phone-number-input/locale/en';

const StorePhoneno = ({ sellItem, setSellItem, handlePhone, country, setCountry, isSign, isContact }) => {
    const StoreCountrySelect = ({ value, labels, ...rest }) => (
        <Dropdown>
            <Dropdown.Toggle variant="default">
                +{getCountryCallingCode(country ? country : 'US')}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {getCountries().map((country) => (<Dropdown.Item key={country} onClick={() => { setCountry(country); setSellItem(); }}>
                    {labels[country]}(+{getCountryCallingCode(country)})
                </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>

    )
    return (
        <div>
            <div className={isSign ? 'phone-input position-relative' : 'password position-relative d-flex align-items-center'}
            >
                <StoreCountrySelect
                    value={country}
                    labels={en}
                />
                <input
                    // defaultCountry={country} 
                    type="number"
                    name="phone_number"
                    className={`${isContact ? 'form-control b-0 bg-light-gray' : 'form-control'}`}
                    placeholder="Enter Phone no."
                    value={sellItem}
                    onChange={(e) => handlePhone(e.target.value, 'store_phone_number')}
                    onInput={(e) => handlePhone(e.target.value, 'store_phone_number')}
                />
            </div >
        </div>
    )
}

export default StorePhoneno;
