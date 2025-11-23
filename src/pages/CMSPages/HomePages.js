import React from "react";
import HomeContent from "./HomeContent";
import HomeInsert from "./HomeInsert";
import NewsLetterContent from "./NewsLetterContent";

const HomePages = () => {
    return (
        <div className="mt-1">
            <div className="container">
                <h2 className="mb-0 fw-bold">Home Pages</h2>
            </div>
            <div>
                <HomeContent />
                {/* <HomeInsert /> */}
                <NewsLetterContent />
            </div>
        </div>
    )
};

export default HomePages;
