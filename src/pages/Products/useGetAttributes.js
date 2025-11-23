import { useSelector } from "react-redux";
import { get_attributes } from "../../reduxData/user/userAction";
import { useState , useEffect } from "react";

export const useGetAttributes = ()=>{

    const token = useSelector(state=>state.auth.accessToken);
const [listAttributes, setListAttributes] = useState([]);
      const handleGetAttributes = async () => {
        const res = await get_attributes(token);
        console.log(
          "response of the attriburtes in creatye variants",
          res?.data?.data
        );
        setListAttributes(res?.data?.data);
      };
    
      useEffect(() => {
        handleGetAttributes();
      }, []);
    return listAttributes ; 
}