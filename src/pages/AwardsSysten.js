import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyData from "../components/EmptyData";
import { getAwardsAPI, deleteAwardAPI  } from "../reduxData/user/userAction";
import { Avatar } from "@mui/joy";
import AddAward from "../Modals/AddAward";

const AwardsSystem = () => {
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [editData, setEditData] = useState(null);
  const [awardToGrant, setAwardToGrant] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  

  const fetchAwards = async () => {
    setIsLoading(true);
    const awardsData = await getAwardsAPI();
    if (awardsData) {
      setAwards(awardsData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAwards();
  }, []);

 const handleAddNew = () => {
    setEditData(null);      
    setShowAddModal(true);
  };

  const handleEdit = (award) => {
    setEditData(award);      
    setShowAddModal(true);
  };

  const handleDelete = async (award) => {
    if (
      window.confirm(
        `Are you sure you want to delete this award? This action is permanent.`
      )
    ) {
      const success = await deleteAwardAPI(award._id);
      if (success) {
        fetchAwards(); 
      }
    }
  };
  
  const handleGrant = (award) => {
    setAwardToGrant(award);
    setShowAwardModal(true);
  };

  const handleSave = () => {
    setShowAddModal(false);
    fetchAwards();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return  (
    <div className="container">
      <div className="d-flex justify-content-between">
        <h3 className="fw-600">Awards Management</h3>
        {((user?.role === "staff" && user?.permission?.p_badge_system > 1) ||
          user?.role !== "staff") && (
        <button className="btn common-button" onClick={handleAddNew}>
          New Award
        </button>
        )}
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-hover user-management-table">
          <thead className="border-gray">
            <th>Image</th>
            <th>Type</th>
            <th>Text/Name</th>
            <th>Action</th>
          </thead>
          <tbody>
            {awards.length > 0 ? (
              awards.map((item) => (
                <tr key={item._id}>
                  <td><Avatar src={item.image} alt={item.text} /></td>
                  <td><span className="badge bg-secondary">{item.type}</span></td>
                  <td>{item.text}</td>
                  <td>
                    <i 
                      className="cursor-pointer mx-2 fas fa-trophy text-warning"
                      title="Award to User"
                      onClick={() => handleGrant(item)}
                    />
                     {((user?.role === "staff" && user?.permission?.p_badge_system > 1) ||
          user?.role !== "staff") && (
            <>
                    <i
                      className="cursor-pointer mx-2 far fa-edit edit"
                      title="Edit Award"
                      onClick={() => handleEdit(item)}
                    />
                    <i
                      className="cursor-pointer mx-2 fas fa-trash-alt delete-icon"
                      title="Delete Award"
                      onClick={() => handleDelete(item)}
                    />
            </>
          )}

                  </td>
                </tr>
              ))
            ) : (
              <EmptyData />
            )}
          </tbody>
        </table>
      </div>

      {/* Render the Add/Edit Modal */}
      <AddAward 
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        data={editData}
        onSave={handleSave}
      />

      {/* Placeholder for the other modals */}
      {/* <AwardUser
        show={showAwardModal}
        handleClose={() => setShowAwardModal(false)}
        award={awardToGrant}
      />
      
      <DeleteContent
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        data={editData}
        heading={"Award"}
      />
      */}
    </div>
  );
};

export default AwardsSystem;