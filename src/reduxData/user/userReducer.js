import { GET_ALL_BID_AUCTIONS, GET_ALL_CATEGORIES, GET_ALL_PAST_AUCTIONS, GET_ALL_RUNNING_AUCTIONS, GET_ALL_USERS, GET_ANALYTICS_DATA, GET_BADGE_LISTS, GET_BID_TOTAL, GET_CONTACT_LISTS, GET_ITEM_LISTING, GET_ITEM_TOTAL, GET_LOGS_DATA, GET_NEWSLETTER_LISTS, GET_ORDER_LISTS, GET_PAST_TOTAL, GET_PAYMENT_LISTS, GET_RUNNING_TOTAL, GET_SINGLE_STAFF, GET_STAFF_LISTING, GET_TOTAL_CATEGORIES, GET_TOTAL_USERS, USER_DISPUTES, USER_FLAG_COMMENTS, VIEW_ITEM_DETAIL ,GET_ATTRIBUTES} from "./userTypes";

const attribute =localStorage.getItem("attributes");
const initialState = {
  addAttributes: attribute ? JSON.parse(attribute) : [],
  allUsers: [],
  totalUsers: 0,
  itemdetail: null,
  itemdata: [],
  pastdata: [],
  runningdata: [],
  itemTotal: 0,
  runningTotal: 0,
  pastTotal: 0,
  biddata: [],
  bidtotal: 0,
  categoriesList:  [],
  totalCategories: 0,
  badgeLists: [],
  staffList: [],
  staffTotal: 0,
  singleStaff: null,
  disputes: [],
  disputesTotal: 0,
  flags: [],
  flagsTotal: 0,
  newsletterLists: [],
  totalNewsletters: 0,
  contactLists: [],
  totalContacts: 0,
  orderLists: [],
  totalOrders: 0,
  paymentLists: [],
  totalPayments: 0,
  analyticsData: null,
  logsData: [],
  totalLogs: 0,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload,
      };
    case GET_TOTAL_USERS:
      return {
        ...state,
        totalUsers: action.payload,
      };
    case VIEW_ITEM_DETAIL:
      return {
        ...state,
        itemdetail: action.payload,
      };
      case GET_ATTRIBUTES:
        return {
         addAttributes : action.payload
        }
    case GET_ITEM_LISTING:
      return {
        ...state,
        itemdata: action.payload,
      };
    case GET_ITEM_TOTAL:
      return {
        ...state,
        itemTotal: action.payload,
      };
    case GET_ALL_PAST_AUCTIONS:
      return {
        ...state,
        pastdata: action.payload,
      };
    case GET_PAST_TOTAL:
      return {
        ...state,
        pastTotal: action.payload,
      };
    case GET_ALL_RUNNING_AUCTIONS:
      return {
        ...state,
        runningdata: action.payload,
      };
    case GET_RUNNING_TOTAL:
      return {
        ...state,
        runningTotal: action.payload,
      };
    case GET_ALL_BID_AUCTIONS:
      return {
        ...state,
        biddata: action.payload,
      };
    case GET_BID_TOTAL:
      return {
        ...state,
        bidtotal: action.payload,
      };
    case GET_ALL_CATEGORIES:
      return {
        ...state,
        categoriesList: action.payload,
      };
    case GET_TOTAL_CATEGORIES:
      return {
        ...state,
        totalCategories: action.payload,
      };
    case GET_BADGE_LISTS:
      return {
        ...state,
        badgeLists: action.payload,
      };
    case GET_STAFF_LISTING:
      return {
        ...state,
        staffList: action.payload.data?.filter(r => r._id !== action.payload.uid),
        staffTotal: action.payload.total,
      };
    case GET_SINGLE_STAFF:
      return {
        ...state,
        singleStaff: action.payload,
      };
    case USER_DISPUTES:
      return {
        ...state,
        disputes: action.payload.data,
        disputesTotal: action.payload.total
      };
    case USER_FLAG_COMMENTS:
      return {
        ...state,
        flags: action.payload.list,
        flagsTotal: action.payload.total || action.payload.list.length
      };
    case GET_NEWSLETTER_LISTS:
      return {
        ...state,
        newsletterLists: action.payload.data,
        totalNewsletters: Number(action.payload.length)
      };
    case GET_CONTACT_LISTS:
      return {
        ...state,
        contactLists: action.payload.data,
        totalContacts: Number(action.payload.length)
      };
    case GET_ORDER_LISTS:
      return {
        ...state,
        orderLists: action.payload.data,
        totalOrders: Number(action.payload.length)
      };
    case GET_PAYMENT_LISTS:
      return {
        ...state,
        paymentLists: action.payload.data,
        totalPayments: Number(action.payload.length)
      };
    case GET_ANALYTICS_DATA:
      return {
        ...state,
        analyticsData: action.payload.data,
      };
    case GET_LOGS_DATA:
      return {
        ...state,
        logsData: action.payload.data,
        totalLogs: Number(action.payload.count)
      };
    default:
      return state;
  }
};

export default userReducer;
