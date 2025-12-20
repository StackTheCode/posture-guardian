import axios from "axios";
import type {  PostureEvent } from "../types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type": "application/json"
    }
})
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})
export const authApi = {
    register:(username: string,email:string,password:string) =>
        api.post('/auth/register', {username,email,password}),

    login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
}
export const postureApi = {
  saveEvent: (event: PostureEvent) =>
    api.post('/posture/events', event),
  
  getEvents: (start: string, end: string) =>
    api.get('/posture/events', { params: { start, end } }),
};

export default api;