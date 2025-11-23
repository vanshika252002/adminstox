import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { getCountries, getCountryCallingCode, isValidPhoneNumber } from "react-phone-number-input";
import en from 'react-phone-number-input/locale/en';
import 'react-phone-number-input/style.css'

const PhoneNo = ({ sellItem, setSellItem, handlePhone, country, setCountry, isOwner }) => {
    // const [count, setCount] = useState(country);

    const CountrySelect = ({ value, labels, ...rest }) => {
        const [searchCountry, setSearchCountry] = useState('');
        const filteredCountries = getCountries().filter((country) =>
            labels[country].toLowerCase().includes(searchCountry.toLowerCase())
        );
        const filtercountries = getCountries().filter((country) => labels[country].toLowerCase().includes(searchCountry.toLowerCase()));
        const filteredCodes = getCountries().filter((country) => getCountryCallingCode(country).includes(searchCountry));
        return (
            <Dropdown>
                <Dropdown.Toggle variant="default" disabled>
                    +{getCountryCallingCode(country ? country : 'NL')}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <div className="col-md-12 position-relative">
                        <span class="search-icon position-absolute pt-0 ps-0 search-icon-store">
                            <i class="fa fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Country"
                            value={searchCountry}
                            onChange={(e) => setSearchCountry(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                    {/* {(filtercountries?.length > 0 ? filtercountries : filteredCodes)
                        .map((country) => (<Dropdown.Item key={country} onClick={() => { setCountry(country); setSellItem(); }}>
                            {labels[country]}(+{getCountryCallingCode(country)})
                        </Dropdown.Item>
                        ))} */}
                </Dropdown.Menu>
            </Dropdown>
        )
    };

    return (
        <div className={'phone-input password position-relative d-flex align-items-center owner-detail-phone-number-wrap'}
        >
            <CountrySelect
                value={country}
                labels={en}
            />
            <input defaultCountry={country} 
            type="number" name="phone_number" 
            className="form-control" 
            placeholder="Phone Number" 
            value={sellItem} 
            onChange={(e) => handlePhone(e.target.value, isOwner ? 'owner_phone_number' : 'phone_number')} />
        </div>
    )
};

export default PhoneNo;
