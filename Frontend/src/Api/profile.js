import axios from 'axios'
const URL = import.meta.env.VITE_API_URL;

 export const createProfile = async(token, id, data)=>{
     try {
         const res = await axios.post(`${URL}/api2/createProfile/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
              }
         })
          return res;
     } catch (error) {
         console.log("error " ,error)
     }
 }

