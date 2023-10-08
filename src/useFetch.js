import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true); // initially true
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController(); // abort controller
        
        setTimeout(() => {
            fetch(url, { signal: abortCont.signal }) // pass in signal
                .then(res => {
                    if(!res.ok) {
                        throw Error('Could not fetch data for that resource');
                    }
                    return res.json();
                })
                .then(data => {
                    setData(data);
                    setIsPending(false);
                    setError(null);
                })
                .catch(err => {
                    if(err.name === 'AbortError') {
                        console.log('fetch aborted');
                    } else {
                        setIsPending(false);
                        setError(err.message);
                    }
                });
        }, 1000);

        return () => abortCont.abort(); // abort the fetch
    } , [url]);

    return { data, isPending, error };
}

export default useFetch;