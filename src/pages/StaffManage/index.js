import React, { useEffect, useState } from "react";
import {
    Box,
    Input
} from "@mui/joy";
import { Link, useNavigate } from "react-router-dom";
import EmptyData from "../../components/EmptyData";
import CustomPagination from "../../components/CustomPagination";
import { useDispatch } from "react-redux";
import { DESIGNATION, get_all_staff } from "../../reduxData/user/userAction";
import { useSelector } from "react-redux";

const Staff = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {staffList,staffTotal}=useSelector((state)=>state.user);
    const {user}=useSelector((state)=>state.auth);
    const [search,setSearch]=useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    useEffect(()=>{
        get_all_staff(localStorage.getItem("token"), dispatch, currentPage, perPage, search,user?._id)
    },[dispatch,currentPage,perPage,search,user]);
    return (
        <div>
            <div className="container">
                <Box className="d-flex mb-4 justify-content-between align-items-center">
                    <h3 className="mb-0 fw-600">Staff Management ({staffTotal})</h3>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="mx-3">
                            <Input
                                id="nameInput"
                                type="text"
                                placeholder="Search Staff"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {(((user?.role==='staff') && (user?.permission?.p_staff>1)) || (user?.role!=='staff')) && <button type="button" className="btn common-button ms-3" onClick={()=>navigate('/staff/add')}>
                            <i className="fa fa-plus me-1"></i>
                            Add
                        </button>}
                    </div>
                </Box>
                <div className="table-responsive">
                    <table className="table user-management-table table-hover">
                        <thead className="border-gray">
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Designation</th>
                            <th scope="col" className="text-center">Status</th>
                            {(((user?.role==='staff') && (user?.permission?.p_staff>1)) || (user?.role!=='staff')) &&  <th scope="col" className="text-center">Actions</th>}
                        </thead>
                        <tbody>
                            {staffTotal>0?staffList.map((staff) => (
                                <tr key={staff._id}>
                                    <td className="text-capitalize">
                                        {staff?.name}
                                    </td>
                                    <td>
                                        {staff?.email}
                                    </td>
                                    <td>
                                        {staff?.phoneNumber}
                                    </td>
                                    <td className="text-capitalize">
                                        {DESIGNATION.find((r)=>r.value===staff?.designation)?.label}
                                    </td>
                                    <td className="text-center">
                                        {staff?.isDeactive ? "Inactive" : "Active"}
                                    </td>
                                    {(((user?.role==='staff') && (user?.permission?.p_staff>1)) || (user?.role!=='staff')) && <td className="text-center">
                                        <Link
                                            className="navbar-brand mx-2"
                                            to={`/staff/${staff._id}`}
                                        >
                                            <i className="far fa-edit edit"></i>
                                        </Link>
                                        {/* <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            className="cursor-pointer delete-icon bi bi-trash3-fill"
                                            onClick={() => { setEditData(user); setIsDelete(true); }}
                                        >
                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                        </svg> */}
                                    </td>}
                                </tr>
                            )): <EmptyData />}
                        </tbody>
                    </table>
                </div>
                <div className="mt-3">
                    {staffTotal > perPage && (
                        <CustomPagination
                            total={staffTotal}
                            onPageChange={(page, perPage) => { setCurrentPage(page); setPerPage(perPage);}}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Staff;
