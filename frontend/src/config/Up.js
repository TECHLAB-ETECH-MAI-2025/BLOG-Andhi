import { up } from "up-fetch";

const SERVER_API_URL = import.meta.env.VITE_API_URL;

export const upfetch = up(fetch, () => ({
    baseUrl: SERVER_API_URL,
	timeout: 10000,
}));

export const API = up(fetch, () => ({
    headers: { Authorization: localStorage.getItem('token') },
    baseUrl: SERVER_API_URL,
	timeout: 10000,
}));
