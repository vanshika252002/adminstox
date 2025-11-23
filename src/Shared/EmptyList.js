import React from "react";

const EmptyList = ({ name }) => {
  return (
    
        <tr>
          <td  className="text-center py-2"  colSpan={7}>
            <p className="py-2 my-2">{name} list is empty!</p>
          </td>
        </tr>
    
  );
};

export default EmptyList;

