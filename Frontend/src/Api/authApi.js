import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000",  
  headers: {
    "Content-Type": "application/json",
  },
});
 
export const login = async (data) => {
  try {
    const res = await apiClient.post("/auth/login", data);  
    return res.data; 
  } catch (error) {
    if (error.response) {
       
      throw error.response.data;
    } else {
      throw { message: error.message };
    }
  }
};

 export const logout = async()=>{
  try {
    const res = await apiClient.patch('/auth/logout');
    if (res.status === 200) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
 }
export const verify = async (data) => {
  try {
    const res = await apiClient.post("/auth/verifyOtp", data);  
    return res.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: error.message };
    }
  }
};


