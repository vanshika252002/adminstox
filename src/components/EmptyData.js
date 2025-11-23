import React from "react";
import DataNotFound from "../images/NotFoundData.png";

const EmptyData = () => {
  return (
    <tr>
      <td colSpan="12" className="text-center py-4">
        <div className="NotFoundData">
          <img src={DataNotFound} alt="DataNotFound" className="w-25" />
        </div>
      </td>
    </tr>
  );
};

export default EmptyData;
