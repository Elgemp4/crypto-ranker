import { useEffect, useState } from "react";
import useApi from "./useApi";

export default function useLoad(url){
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const api = useApi();

    useEffect(() => {
        async function fetchData() {
            const result = await api.get(url);

            setData(result.data);
            setLoading(false);
        }

        fetchData();
    }, [url]);


    return {data, loading};
}