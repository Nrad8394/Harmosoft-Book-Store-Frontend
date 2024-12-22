import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  BASE_URL, 
  GET_INDIVIDUAL_URL,
  UPDATE_INDIVIDUAL_URL,
  REFRESH_TOKEN,
  SIGN_UP_URL, 
  LOGIN_URL_URL, 
  LOGOUT_URL,
  GET_USER_URL,
  GET_ORGANIZATIONS_SUMMARY,
  GET_ORGANIZATION,
  UPDATE_ORGANIZATION,
  GET_ITEM_URL,
  GET_ITEMS_URL,
  GET_SCHOOL_COLLECTION_URL,
  CREATE_ITEM_URL,
  UPDATE_ITEM_URL,
  DELETE_ITEM_URL,
  GET_COLLECTION_URL,
  GET_COLLECTIONS_URL,
  CREATE_COLLECTION_URL,
  UPDATE_COLLECTION_URL,
  DELETE_COLLECTION_URL,
  COLLECTION_SUMMARY_URL,
  GET_ORDER_URL,
  GET_ORDERS_URL,
  CREATE_ORDER_URL,
  UPDATE_ORDER_URL,
  DELETE_ORDER_URL,
  GET_ORDER_STATUS,
  GET_RECEIPT_URL,
  CREATE_MPESA,
  MPESA_CALLBACK,
  ADVERTS,
  APPLY_CLUSTER_URL
} from './apiConfig';

// Handler for API error
const handleApiError = (error: AxiosError) => {
  if (error.response && error.response.data) {
    console.error('API Error:', error.response.data);
    throw error.response.data;
  } else {
    console.error('API Error:', error.message);
    throw error;
  }
};

// Configure Axios
const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include the access token in headers
api.interceptors.request.use(
  async (config: any) => { // Cast config to any to bypass the type issues
    try {
      const token = await localStorage.getItem('accessToken');
      console.log(token);

      // Explicitly check if the token is neither null nor undefined
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving access token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Handle refresh token logic
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config; // Cast to any to allow _retry property

    // Ensure originalRequest is defined before accessing its properties
    if (originalRequest && error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await localStorage.getItem('refreshToken');

        // Explicitly check if the refresh token is neither null nor undefined
        if (refreshToken) {
          const response = await api.post(REFRESH_TOKEN, { refresh: refreshToken });

          if (response.status === 200) {
            // Store the new access token
            await localStorage.setItem('accessToken', response.data.access);

            // Update the Authorization header with the new access token
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
            }

            // Retry the original request with the new access token
            return api(originalRequest);
          }
          else {
            // If the refresh token is invalid or the response status is not 200
            await localStorage.removeItem('accessToken');
            await localStorage.removeItem('refreshToken');
          }
        }

        // If the refresh token is invalid or the response status is not 200
        await localStorage.removeItem('accessToken');
        await localStorage.removeItem('refreshToken');
        // Optionally, you might want to redirect to login page or handle logout here
        return Promise.reject(error); // Reject with the original error
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);

        // Remove invalid tokens
        await localStorage.removeItem('accessToken');
        await localStorage.removeItem('refreshToken');
        
        // Optionally, you might want to redirect to login page or handle logout here
        return Promise.reject(refreshError); // Reject with the refresh error
      }
    }

    return Promise.reject(error); // Reject with the original error if it's not a 401 or retry logic already failed
  }
);



// User Authentication Handlers
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(LOGIN_URL_URL, { email, password });
    const { access, refresh ,user} = response.data;
    await localStorage.setItem('accessToken', access);
    await localStorage.setItem('refreshToken', refresh);
    await localStorage.setItem('username', user.username );

    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

export const signUpUser = async (email: string, username: string, password1: string,password2: string ,user_type: string) => {
  try {
    const response = await axios.post(SIGN_UP_URL, { email, username, password1,password2 ,user_type});
    const { access, refresh ,user} = response.data;
    await localStorage.setItem('accessToken', access);
    await localStorage.setItem('refreshToken', refresh);
    await localStorage.setItem('username', user.username );
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getUserDetails = async () => {
  try {
    const response = await api.get(GET_USER_URL);    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getIndividual = async () => {
  try {
    const response = await api.get(GET_INDIVIDUAL_URL);    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const UpdateIndividual = async (formData:any) => {
  try {
    const response = await api.patch(UPDATE_INDIVIDUAL_URL,{formData});    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const logoutUser = async () => {
  try {
    const authToken = await localStorage.getItem('accessToken');
    if (!authToken) throw new Error('No auth token found');
    const response = await api.post(LOGOUT_URL);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
  finally {
    await localStorage.removeItem('accessToken');
    await localStorage.removeItem('refreshToken');
  }
};
// Organizations
export const getOrganizationsSummary = async () => {
  try {
    const response = await api.get(GET_ORGANIZATIONS_SUMMARY);    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getOrganization = async () => {
  try {
    const response = await api.get(GET_ORGANIZATION);    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const updateOrganizations = async (formData:any) => {
  try {
    const response = await api.patch(UPDATE_ORGANIZATION,formData);    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
// Products APIs
// items
export const getItem = async (id: number) => {
  try {
    const response = await api.get(GET_ITEM_URL.replace('{id}', id.toString()));    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getItems = async () => {
  try {
    const response = await api.get(`${GET_ITEMS_URL}`);    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const createItem = async (data: any) => {
  try {
    const response = await api.post(CREATE_ITEM_URL, { data });
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const updateItem = async (id: number) => {
  try {
    const response = await api.patch(UPDATE_ITEM_URL.replace('{id}', id.toString()));
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const deleteItem = async (id: number) => {
  try {
    const response = await api.delete(DELETE_ITEM_URL.replace('{id}', id.toString()));
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

// Collections
export const getCollection = async (id: string) => {
  if (id == null) {
    throw new Error("Collection ID is undefined or null.");
  }

  try {
    const response = await api.get(GET_COLLECTION_URL.replace('{id}', id.toString()));
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getSchoolCollections = async (id: string) => {
  if (id == null) {
    throw new Error("School ID is undefined or null.");
  }

  try {
    const response = await api.get(GET_SCHOOL_COLLECTION_URL.replace('{id}', id.toString()));
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getCollections = async () => {
  try {
    const response = await api.get(GET_COLLECTIONS_URL);    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const createCollection = async (data: any) => {
  try {
    const response = await api.post(CREATE_COLLECTION_URL, data );
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const updateCollection = async (id: number,data: any) => {
  try {
    const response = await api.patch(UPDATE_COLLECTION_URL.replace('{id}', id.toString()),data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const deleteCollection = async (id: number) => {
  try {
    const response = await api.delete(DELETE_COLLECTION_URL.replace('{id}', id.toString()));
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const summaryCollection = async () => {
  try {
    const response = await axios.get(COLLECTION_SUMMARY_URL);    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

// Order APIS
//order
export const getOrder = async (id: number) => {
  try {
    const response = await api.get(GET_ORDER_URL.replace('{id}', id.toString()));    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getOrders = async () => {
  try {
    const response = await api.get(GET_ORDERS_URL);    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const createOrder = async (data: any) => {
  try {
    const response = await api.post(CREATE_ORDER_URL, data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const updateOrder = async (id: String,data: any) => {
  try {
    const response = await api.patch(UPDATE_ORDER_URL.replace('{id}', id.toString()), data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const deleteOrder = async (id: number) => {
  try {
    const response = await api.delete(DELETE_ORDER_URL.replace('{id}', id.toString()));
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getOrderStatus = async (orderId: string) => {
  try {
    const response = await api.get( GET_ORDER_STATUS.replace('{id}', orderId.toString()));
    return response.data; // This should return an array of OrderStep objects
  } catch (error) {
    console.error("Failed to fetch order status:", error);
    return null;
  }
};
// receipts
export const getReceipt = async (id: number) => {
  try {
    const response = await api.get(GET_RECEIPT_URL.replace('{id}', id.toString()));    
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

// Payments APIS
// payment
export const createMpesa = async (data: any) => {
  try {
    console.log(data);
    
    const response = await api.post(CREATE_MPESA, data);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const mpesaCallback = async (data: any) => {
  try {
    const response = await api.post(MPESA_CALLBACK, { data });
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
// roumers
export const updateOrderStatus = async (orderId :any, status:any) => {
  try {
    const response = await api.post(MPESA_CALLBACK);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const updateTrackingInfo = async (orderId:any, trackingNumber:any, shippingCarrier:any, expectedDelivery:any) => {
  try {
    const response = await api.post(MPESA_CALLBACK);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const addOrganization = async (data :any) => {
  try {
    const response = await api.post(MPESA_CALLBACK);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const updateOrganization = async (isEditing:any, newOrganization:any) => {
  try {
    const response = await api.post(MPESA_CALLBACK);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const deleteOrganization = async (orderId :any) => {
  try {
    const response = await api.post(MPESA_CALLBACK);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getPayments = async () => {
  try {
    const response = await api.post(MPESA_CALLBACK);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const updatePaymentStatus = async (orderId :any, status:String) => {
  try {
    const response = await api.post(MPESA_CALLBACK);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getProcurements = async () => {
  try {
    const response = await api.post(MPESA_CALLBACK);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const updateProcurementStatus = async (procurementId: number, status: string) => {
  try {
    const response = await api.post(MPESA_CALLBACK);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const getAdverts = async () => {
  try {
    const response = await api.get(ADVERTS);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};
export const handlePackSelection  = async (packName: string,id:string) => {
  try {
    const response = await api.post(APPLY_CLUSTER_URL.replace('{id}', id.toString()),{ cluster_name: packName });
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};