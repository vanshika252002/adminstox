import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useAttributes = () => {

    const savedAttributes = useSelector(state=>state?.user?.addAttributes )
const [attributes,setAttributes] = useState(savedAttributes)
  const [color, setColor] = useState(["black", "grey"]);
  const [size, setSize] = useState(["s", "m", "l"]);

  return {setColor,color, setSize, setAttributes , attributes};
};
