import { deactivateAccount } from './settings/SettingsModel';
import axios from 'axios'
import {API_URL} from '../../../urls'

export const getMembers: any = () => {
  return axios.get(`${API_URL}/members`)
}

export const postMember: any = (data: any) => {
  return axios.post(`${API_URL}/members`, data)
}

export const getPlayerMembers: any = (chosenTime: string) => {
  if (chosenTime != '') {
    return axios.get(`${API_URL}/TeeSlots/${chosenTime}`)
  }
}
export const addCaddiesApi:any=(data:any)=>{
   return axios.post(`${API_URL}/Caddies`, data)
}
// export const fetchDataperDate=(teeDate:string)=>{
//   axios.get(`${API_URL}/CellCount/${teeDate}`).then(res=>console.log('data',res.data)).catch((error)=>{
//     console.log(error.response.data.error)
// });
// }

export const fetchTees = () => {
  return axios.get(`${API_URL}/CellCount`)
}
// Deactivating members
// export const deactivateUserApi=(id: any)=>{
//   axios.post(`${API_URL}/ActivationMembers?id=${id}`)
//   .then((response)=>{console.log(response.data);
//     console.log(response.status);
//   });

  
  
// }
