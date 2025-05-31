import axios from "axios";

export default function useApi() {
    return axios.create({
        baseURL: "https://api.coingecko.com/api/v3",
        headers: {
            Accept: "application/json"
        }
    });
}