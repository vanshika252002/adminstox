import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@mui/joy";
import EmptyData from "../../components/EmptyData";
import moment from "moment";
import { toast } from "react-toastify";
import { get_users, update_user } from "../../reduxData/user/userAction";
import DeleteContent from "../../Modals/DeleteContent";
import UserDetails from "../../components/UserDetails";
import CustomPagination from "../../components/CustomPagination";
import { delete_user } from "../../reduxData/user/userAction";

const UserManagement = () => {
    const { allUsers, totalUsers } = useSelector((state) => state.user);
    const { isLoading } = useSelector((state) => state.loading);
    const [deleteUser,setDeleteUser] = useState(false);
    const [currentTab, setCurrentTab] = useState("seller");
    const tabs = ["seller", "buyer"];
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isDelete, setIsDelete] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [editData, setEditData] = useState(null);
    const [resetPage, setResetPage] = useState(false);
    const { user } = useSelector(state => state.auth);
    const [show, setShow] = useState(false);
    const [data, setData] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [currentTab, currentPage, perPage, name, email, statusFilter]);

    const changeDOJFormat = (data) => {
        const joinDate = moment(data).format('MM/DD/YYYY');
        return joinDate;
    };

    const fetchData = async (page = currentPage, rows = perPage) => {
            try {
                const data = await get_users(dispatch, localStorage.getItem("token"), page, rows, name, statusFilter, currentTab);
                // setUserManagement(data?.data);
                // setTotal(data?.total || 0);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

    const handleDelete = async (item) => {
        const data = {
            is_deactive: item?.is_deactive ? false : true,
        };
        const message = item?.is_deactive ? "User Active Successfully" : "User In-Active Successfully";
        const isEdit = await update_user(item?.id, data, navigate, localStorage.getItem("token"), dispatch, true, message);
        if (isEdit) {
            const data = await get_users(dispatch, localStorage.getItem("token"), currentPage, perPage, "", statusFilter);
            // setUserManagement(data?.data);
        }
    };


    const handleFilterChange = (newFilter) => {
        setStatusFilter(newFilter);
        setResetPage(true);
        get_users(dispatch, localStorage.getItem("token"), 1, perPage, name, newFilter).then(() => {
            setResetPage(false);
        });
    };

 const handleDeleteUser = async(id)=>{
            let deleteUser= await delete_user(dispatch,localStorage.getItem("token"),id);
        if(deleteUser)
        {
            await fetchData();
        }
 };

    return (
        <div>
            <div className="container">
                <h3 className="mb-0 fw-600 mb-3">
                    {/* {currentTab === "seller" ? "Seller" : "Buyer"}  */}
                    User Management 
                    ({totalUsers})
                </h3>

                <div className="filters mb-3">
                    <Input
                        id="nameInput"
                        type="text"
                        placeholder="Search by name/email"
                        value={name}
                        onChange={async (e) => {
                            setName(e.target.value);
                            const data = await get_users(dispatch, localStorage.getItem("token"), 1, 10, e.target.value);
                            // setUserManagement(data?.data);
                        }}
                    />

                    <div className="custom-select">
                        <p className="m-0">View By Status</p>
                        <div className="select">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => {
                                    // setStatusFilter(e.target.value);
                                    // setCurrentPage(1);
                                    handleFilterChange(e.target.value)
                                }}
                            >
                                <option value="All">All</option>
                                <option value="Active">Active</option>
                                <option value="In-active">In-active</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* <div className="col-lg-8 col-md-8 mt-4 mb-4">
                    <div className="text-md-end">
                        <ul className="list-inline mb-0 sorting-list">
                            {tabs.map((tab) => (
                                <li key={tab} className="list-inline-item mb-2 mb-md-0">
                                    <Link
                                        className={`text-decoration-none text-capitalize border rounded-pill px-3 py-2 ${currentTab === tab ? "active" : ""
                                            }`}
                                        onClick={() => {
                                            setCurrentTab(tab);
                                            localStorage.setItem("itemPage", JSON.stringify(tab));
                                        }}
                                    >
                                        {tab}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div> */}

                <div className="table-responsive">
                    <table className="table user-management-table table-hover">
                        <thead className="border-gray">
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            {/* <th scope="col">Role</th> */}
                            {/* <th scope="col">Store Name</th> */}
                            <th scope="col">Phone No.</th>
                            <th scope="col" className="text-center">Date of Joining</th>
                            {/* <th scope="col" className="text-center">Phone Number</th> */}
                            <th scope="col" className="text-center">Status</th>
                            {(((user?.role === 'staff') && (user?.permission?.p_users > 1)) || (user?.role !== 'staff')) && <th scope="col" className="text-center">Action</th>}
                        </thead>
                        <tbody>
                            {Array.isArray(allUsers) && allUsers?.length > 0 ?
                                allUsers.map((data, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}.</td>
                                        <td>
                                            <div className={data?.user_name ? 'w-fit-content cursor-pointer hover-underline' : ''}
                                                onClick={() => {
                                                    setShow(true);
                                                    setData(data);
                                                }}
                                            >
                                                {data?.user_name ? data?.user_name : 'N/A'}
                                            </div>
                                        </td>
                                        <td>{data?.email}</td>
                                        {/* <td>{data?.role === "seller" ? 'Seller' : 'Buyer'}</td> */}
                                        {/* <td>{data?.store_name && data?.store_name !== "" ? data?.store_name : 'N/A'}</td> */}
                                        <td>{data?.phone_no ? `${data?.country_code}-${data?.phone_no}` : 'N/A'}</td>
                                        <td className="text-center">{changeDOJFormat(data.createdAt)}</td>
                                        {/* <td className="text-center">{data.phoneNumber ? data.phoneNumber : '-'}</td> */}
                                        <td className="text-center">
                                            {data?.is_deactive ? ("In-active") : ("Active")}
                                        </td>
                                        {(((user?.role === 'staff') && (user?.permission?.p_users > 1)) || (user?.role !== 'staff')) && <td className="d-flex gap-1 align-items-center text-center">
                                            {/* <button className="btn btn-sm btn-main m-2"> */}
                                            {/* <Link
                                                className="navbar-brand"
                                                to="javascript:void(0)"
                                                disabled={isLoading}
                                                onClick={() => exportData(data._id)}
                                            >
                                                <i className="fa fa-download edit"></i>
                                            </Link> */}
                                            <Link
                                                className="navbar-brand mx-2"
                                                to={`/editUser/${data.id}`}
                                            >
                                                <i className="far fa-edit edit"></i>
                                            </Link>
                                            {/* </button> */}

                                            {/* {(((user?.role === 'staff') && (user?.permission?.p_users > 2)) || (user?.role !== 'staff')) && <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                                className="cursor-pointer delete-icon bi bi-trash3-fill"
                                                onClick={() => { setEditData(data); setIsDelete(true); }}
                                            >
                                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                            </svg>} */}

                                            {(((user?.role === 'staff') && (user?.permission?.p_users > 2)) || (user?.role !== 'staff')) &&
                                                <div class="form-check form-switch switch-large">
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        id="flexSwitchCheckDefault"
                                                        checked={!data?.is_deactive}
                                                        onChange={() => handleDelete(data)}
                                                    />
                                                </div>}

                                            {/* {currentTab === "seller" &&
                                                <Link className="navbar-brand mx-2 fs-5"
                                                    onClick={() => {
                                                        window.open(`https://bid4style.visionvivante.in/login?accessToken=${localStorage.getItem("token")}&email=${data?.email}`, "_blank");
                                                    }} >
                                                    <i class="bi bi-box-arrow-in-right"></i>
                                                </Link>
                                            } */}

                                            <Link className="text-danger" onClick={()=>{handleDeleteUser(data.id)}}><i class="bi bi-trash3"></i></Link>

                                        </td>}

                                    </tr>
                                )) : <EmptyData />}
                        </tbody>
                    </table>
                </div>

                <div className="mt-3">
                    {/* {totalUsers > 0 && (
                          <CustomPagination
                            total={totalUsers}
                            onPageChange={(page, perPage) => { get_users(dispatch, localStorage.getItem("token"), page, perPage, "", statusFilter); }}
                          />
                        )} */}

                    {totalUsers > 0 && (
                        <CustomPagination
                            total={totalUsers}
                            onPageChange={(page, perPage) => {
                                setCurrentPage(page);
                                setPerPage(perPage);
                                get_users(dispatch, localStorage.getItem("token"), page, perPage, name, statusFilter);
                            }}
                            resetPage={resetPage}
                        />
                    )}
                </div>

                <UserDetails
                    show={show}
                    handleClose={() => {
                        setData(null);
                        setShow(false);
                    }}
                    user={data}
                />

                <DeleteContent
                    show={isDelete}
                    handleClose={() => { setEditData(null); setIsDelete(false); }}
                    data={editData}
                    heading={"User"}
                    otherLine={"User"}
                    isFaq={'userDelete'}
                />

            </div>
        </div>
    )
};

export default UserManagement;