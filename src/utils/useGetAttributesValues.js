import { useEffect, useState } from "react";
import {
  delete_attribute_values,
  get_attributes_values,
  delete_attribute,
} from "../reduxData/user/userAction";
import { useSelector } from "react-redux";

export const useGetAttributesValues = (id) => {
  const [values, setValues] = useState([]);
  const token = useSelector((state) => state.auth.accessToken);

  const fetchData = async () => {
    try {
      const res = await get_attributes_values(token, id);
      console.log("=====>", res);
      if (res?.data) {
        setValues(res?.data);
      }
    } catch (error) {}
  };

  const handleDeleteAttribute = async (id) => {
    try {
      const res = await delete_attribute(token, id);
       console.log("first1")
      if (res) 
    {
      console.log("first2")
      fetchData();
       console.log("second")
    }
    } catch (error) {}
  };

  useEffect(() => {
    if (!id) return;

    fetchData();
  }, [id, token]);

  return { values, handleDeleteAttribute };
};
