const BASE_URL = 'http://127.0.0.1:80';
// const BASE_URL = 'https://api.harmosoftbookstore.co.ke';
// const BASE_URL = 'http://lemur-neutral-subtly.ngrok-free.app';
// const BASE_URL = 'https://nrad8394.pythonanywhere.com';

export const GET_INDIVIDUAL_URL = `${BASE_URL}/individuals/`;
export const UPDATE_INDIVIDUAL_URL = `${BASE_URL}/individuals/pk/`;


export const SIGN_UP_URL = `${BASE_URL}/register/`;
export const REFRESH_TOKEN = `${BASE_URL}/token/refresh/`;
export const LOGIN_URL_URL = `${BASE_URL}/login/`;
export const LOGOUT_URL = `${BASE_URL}/logout/`;
export const GET_USER_URL = `${BASE_URL}/users/pk/`;

// Products APIs
export const GET_ORGANIZATIONS_SUMMARY = `${BASE_URL}/organizations/summary/`;
export const GET_ORGANIZATION = `${BASE_URL}/organizations/`;
export const UPDATE_ORGANIZATION = `${BASE_URL}/organizations/pk/`;

// items
export const GET_ITEM_URL = `${BASE_URL}/items/{id}/`;
export const GET_ITEMS_URL = `${BASE_URL}/items/`;
export const CREATE_ITEM_URL = `${BASE_URL}/items/`;
export const UPDATE_ITEM_URL = `${BASE_URL}/items/{id}/`;
export const DELETE_ITEM_URL = `${BASE_URL}/items/{id}/`;
// Collections - NOTE - ARE SCHOOL LISTS
export const GET_COLLECTION_URL = `${BASE_URL}/collections/{id}/`;
export const GET_COLLECTIONS_URL = `${BASE_URL}/collections/`;
export const CREATE_COLLECTION_URL = `${BASE_URL}/collections/`;
export const UPDATE_COLLECTION_URL = `${BASE_URL}/collections/{id}/`;
export const DELETE_COLLECTION_URL = `${BASE_URL}/collections/{id}/`;
export const COLLECTION_SUMMARY_URL = `${BASE_URL}/collections/summary/`;
export const GET_SCHOOL_COLLECTION_URL = `${BASE_URL}/collections/{id}/school/`;
export const APPLY_CLUSTER_URL = `${BASE_URL}/collections/{id}/apply-cluster/`;


// Order APIS
//order
export const GET_ORDER_URL = `${BASE_URL}/orders/{id}/`;
export const GET_ORDERS_URL = `${BASE_URL}/orders/`;
export const CREATE_ORDER_URL = `${BASE_URL}/orders/`;
export const UPDATE_ORDER_URL = `${BASE_URL}/orders/{id}/`;
export const DELETE_ORDER_URL = `${BASE_URL}/orders/{id}/`;
export const GET_ORDER_STATUS = `${BASE_URL}/ordertracking/trackorder/{id}/`;

//receipts
export const GET_RECEIPT_URL = `${BASE_URL}/receipts/{id}/`;

// Payments APIS
// payment
export const CREATE_MPESA = `${BASE_URL}/api/mpesa/create/`;
export const MPESA_CALLBACK = `${BASE_URL}/mpesa/create/`;// 

// ADVERTS
export const ADVERTS = `${BASE_URL}/adverts/`;// 

export { BASE_URL }
