import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FAQ from "./FAQ";
import Policy from "./Policy";
import Terms from "./Terms";
import HowItWorks from "./HowItWorks";
import { useSelector } from "react-redux";

const CMS = () => {
    var currentPage = JSON.parse(localStorage.getItem("currentTab"));
    const [currentTab, setCurrentTab] = useState("faqs");
    useEffect(() => {
        if (currentPage) {
            setCurrentTab(currentPage);
        } else {
            setCurrentTab("faqs");
        }
    }, []);

    return (
        <div>
            <div className="container">
                <h3 className="mb-0 fw-600">CMS Pages</h3>
                <div className="col-lg-12 col-md-8 mt-4">
                    <div className="text-md-end">
                        <ul className="list-inline mb-0 sorting-list">
                            <li className="list-inline-item mb-2 mb-md-0">
                                <Link
                                    className={`text-decoration-none border rounded-pill px-3 py-2 ${currentTab === 'faqs' ? 'active' : ''}`}
                                    onClick={() => { setCurrentTab("faqs"); localStorage.setItem("currentTab", JSON.stringify("faqs")); }}
                                >
                                    FAQ's
                                </Link>
                            </li>
                            <li className="list-inline-item mb-2 mb-md-0">
                                <Link
                                    className={`text-decoration-none border rounded-pill px-3 py-2 ${currentTab === 'privacy' ? 'active' : ''}`}
                                    onClick={() => { setCurrentTab("privacy"); localStorage.setItem("currentTab", JSON.stringify("privacy")); }}
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className="list-inline-item mb-2 mb-md-0">
                                <Link
                                    className={`text-decoration-none border rounded-pill px-3 py-2 ${currentTab === 'terms' ? 'active' : ''}`}
                                    onClick={() => { setCurrentTab("terms"); localStorage.setItem("currentTab", JSON.stringify("terms")); }}
                                >
                                    Terms and Conditions
                                </Link>
                            </li>
                            <li className="list-inline-item mb-2 mb-md-0">
                                <Link
                                    className={`text-decoration-none border rounded-pill px-3 py-2 ${currentTab === 'howitworks' ? 'active' : ''}`}
                                    onClick={() => { setCurrentTab("howitworks"); localStorage.setItem("currentTab", JSON.stringify("howitworks")); }}
                                >
                                    How It Works
                                </Link>
                            </li>
                        </ul>
                    </div>{" "}
                </div>
                <div className="col-lg-12">
                    {currentTab === "faqs" ?
                        <FAQ />
                        :
                        currentTab === "privacy" ?
                            <Policy />
                            :
                            currentTab === "terms" ?
                                <Terms />
                                :
                                <HowItWorks />
                    }
                </div>
            </div>
        </div>
    )
};

export default CMS;
