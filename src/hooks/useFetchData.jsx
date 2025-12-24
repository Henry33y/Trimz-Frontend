import { useEffect, useState } from "react";
import { BASE_URL, token } from "../config"; // ensure getToken() is exported

const useFetchData = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint || typeof endpoint !== "string" || endpoint.includes("undefined")) {
      setError({ message: "Invalid endpoint provided." });
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const url = `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token() && { Authorization: `Bearer ${token()}` }),
          },
          ...options,
        });

        if (!response.ok) {
          let errorMessage = `Request failed (${response.status})`;
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorBody = await response.json();
            errorMessage = errorBody?.message || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server did not return JSON");
        }

        const result = await response.json();

        if (isMounted) setData(result?.data ?? result);
      } catch (err) {
        if (isMounted) setError({ message: err.message || "Something went wrong" });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetchData;
