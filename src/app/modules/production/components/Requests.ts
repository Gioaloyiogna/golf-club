import { deactivateAccount } from './settings/SettingsModel';
import axios from 'axios'
import {API_URL} from '../../../urls'

export const getMembers: any = () => {
  return axios.get(`${API_URL}/members`)
}
export const getPendingMembers:any=()=>{
  return axios.get(`${API_URL}/PendingMembers`)
}
export const getPlayers: any = () => {
  return axios.get(`${API_URL}/TeeSlots`)
}
export const postMember: any = (data: any) => {
  return axios.post(`${API_URL}/members`, data)
}

export const getPlayerMembers: any = (chosenTime: string) => {
  if (chosenTime != '') {
    return axios.get(`${API_URL}/TeeSlots/${chosenTime}`)
  }
}
export const getCaddyPerTeeApi: any = (chosenTime: string) => {
  if (chosenTime != '') {
    return axios.get(`${API_URL}/CaddyTeeSlots/${chosenTime}`)
  }
}

export const addCaddiesApi:any=(data:any)=>{
   return axios.post(`${API_URL}/Caddies`, data)
}
export const getAllCaddiesApi=()=>{
  return axios.get(`${API_URL}/Caddies`)
}
export const updateCaddyApi:any=(data:any)=>{
  return axios.put(`${API_URL}/Caddies/${data.id}`, data)
}
export const updateCaddySlotsApi:any=(data:any)=>{
  return axios.put(`${API_URL}/CaddyTeeSlots/${data.teeTime}`, data)
}
 
export const getAllTees= () => {
  return axios.get(`${API_URL}/GameTeeSlots`)
}
export const getAllCaddiesTees=()=>{
  return axios.get(`${API_URL}/CaddyTees`)
}

// export const fetchDataperDate=(teeDate:string)=>{
//   axios.get(`${API_URL}/CellCount/${teeDate}`).then(res=>console.log('data',res.data)).catch((error)=>{
//     console.log(error.response.data.error)
// });
// }

export const fetchTees = () => {
  return axios.get(`${API_URL}/CellCount`)
}
// Deleting tee per

export const deletePlayerApi=(values:any)=>{
  axios.delete(`${API_URL}/TeeSlots/${values.id}/${values.teeTime}`)
    
}
export const deleteNonMemberPlayerApi=(values:any)=>{
  axios.delete(`${API_URL}/ NonMemberTeeSlots/${values.playerEmail}/${values.teeTime}`)
 
}
// Fetch all gameschedules api
export const allGameScheduleApi=()=>{
  return axios.get(`${API_URL}/GameSchedules`)
}