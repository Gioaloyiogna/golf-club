import { deactivateAccount } from './settings/SettingsModel';
import axios from 'axios'
import {API_URL} from '../../../urls'

export const getMembers: any = () => {
  return axios.get(`${API_URL}/members`)
}

export const postMember: any = (data: any) => {
  return axios.post(`${API_URL}/members`, data)
}
// Deactivating members
// export const deactivateUserApi=(id: any)=>{
//   axios.post(`${API_URL}/ActivationMembers?id=${id}`)
//   .then((response)=>{console.log(response.data);
//     console.log(response.status);
//   });

  
  
// }
