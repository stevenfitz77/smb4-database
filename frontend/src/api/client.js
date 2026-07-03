import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getPlayers = (params = {}) =>
  apiClient.get('/players/', { params }).then(res => res.data);

export const getPlayer = (id) =>
  apiClient.get(`/players/${id}`).then(res => res.data);

export const createPlayer = (data) =>
  apiClient.post('/players/', data).then(res => res.data);

export const updatePlayer = (id, data) =>
  apiClient.put(`/players/${id}`, data).then(res => res.data);

export const deletePlayer = (id) =>
  apiClient.delete(`/players/${id}`).then(res => res.data);

export const getTeams = () =>
  apiClient.get('/teams/').then(res => res.data);

export const getTeam = (id) =>
  apiClient.get(`/teams/${id}`).then(res => res.data);

export const createTeam = (data) =>
  apiClient.post('/teams/', data).then(res => res.data);

export const updateTeam = (id, data) =>
  apiClient.put(`/teams/${id}`, data).then(res => res.data);

export const deleteTeam = (id) =>
  apiClient.delete(`/teams/${id}`).then(res => res.data);