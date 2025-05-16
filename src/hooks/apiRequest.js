import { useState } from "react";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const useApi = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const callApi = async (params) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await apiFunction(params); // Call the passed API function
      
      // console.log('result in use api',result)
      if(result.success!==true){
        // toast.error(result.message || 'unit failed')
        setError(result.message || 'unit fetching failed')
        setLoading(false)
        return
      }
      setData(result);
      setError(null)
      

      return result; // Return the result for further use
    } catch (err) {
      setError(err.message || "An error occurred");
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, callApi };
};

export default useApi;
