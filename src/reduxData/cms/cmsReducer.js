import {
    GET_ALL_FAQS,
    GET_BUYING_CONTENT,
    GET_CONTACT_US_CONTENT,
    GET_EDIT_DATA,
    GET_FINALIZE_CONTENT,
    GET_HEADER_CONTENT,
    GET_INSERTBID_CONTENT,
    GET_NEWSLETTER_CONTENT,
    GET_PHOTO_GUIDE_CONTENT,
    GET_SELL_ITEM_CONTENT,
    GET_SELLING_CONTENT,

    // cms 
    GET_PRIVACY_POLICY_DATA,
    GET_TERM_DATA,
    GET_COKIE_POLICY_DATA,
    GET_HOW_IT_WORK_DATA,
    GET_ABOUT_DATA,
    GET_FAQ_DATA,
    GET_DPA_DATA,
    GET_RETURN_POLICY_DATA,
} from "./cmsTypes";


const initialState = {
    faqContent: null,
    faqItems: [],
    totalFaqs: 0,
    editData: null,
    insertbid_content: [],
    newsletter_content: [],
    buyingCont: [],
    sellingCont: [],
    finalizeCont: [],
    contactCont: [],
    sellItemCont: [],
    photoguideCont: [],
    headerContent: [],

    // cms 
    privacypolicydata: [],
    termdata: [],
    cookiepolicydata: [],
    howitworkdata: [],
    aboutusdata: [],
    dpadata: [],
    returnpolicydata: [],
};

const cmsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_FAQS:
            return {
                ...state,
                faqItems: action.payload,
            };
        case GET_EDIT_DATA:
            return {
                ...state,
                editData: action.payload,
            };
        case GET_FAQ_DATA:
            return {
                ...state,
                faqContent: action.payload,
            };
        case GET_INSERTBID_CONTENT:
            return {
                ...state,
                insertbid_content: action.payload,
            };
        case GET_NEWSLETTER_CONTENT:
            return {
                ...state,
                newsletter_content: action.payload,
            };
        case GET_BUYING_CONTENT:
            return {
                ...state,
                buyingCont: action.payload,
            };
        case GET_SELLING_CONTENT:
            return {
                ...state,
                sellingCont: action.payload,
            };
        case GET_FINALIZE_CONTENT:
            return {
                ...state,
                finalizeCont: action.payload,
            };
        case GET_CONTACT_US_CONTENT:
            return {
                ...state,
                contactCont: action.payload,
            };
        case GET_SELL_ITEM_CONTENT:
            return {
                ...state,
                sellItemCont: action.payload,
            };
        case GET_PHOTO_GUIDE_CONTENT:
            return {
                ...state,
                photoguideCont: action.payload,
            };
        case GET_HEADER_CONTENT:
            return {
                ...state,
                headerContent: action.payload,
            };

        // cms
        case GET_PRIVACY_POLICY_DATA:
            return {
                ...state,
                privacypolicydata: action.payload,
            };

        case GET_TERM_DATA:
            return {
                ...state,
                termdata: action.payload,
            };

        case GET_COKIE_POLICY_DATA:
            return {
                ...state,
                cookiepolicydata: action.payload,
            };
        case GET_HOW_IT_WORK_DATA:
            return {
                ...state,
                howitworkdata: action.payload,
            };
        case GET_ABOUT_DATA:
            return {
                ...state,
                aboutusdata: action.payload,
            };
        case GET_DPA_DATA:
            return {
                ...state,
                dpadata: action.payload,
            };
        case GET_RETURN_POLICY_DATA:
            return {
                ...state,
                returnpolicydata: action.payload,
            };
        default:
            return state;
    }
};

export default cmsReducer;

