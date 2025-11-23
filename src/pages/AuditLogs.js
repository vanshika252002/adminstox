import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_logs_data } from '../reduxData/user/userAction';
import CustomPagination from '../components/CustomPagination';
import EmptyData from '../components/EmptyData';

const AuditLogs = () => {
    const { user } = useSelector((state) => state.auth);
    const { logsData, totalLogs } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [statusFilter, setStatusFilter] = useState("login");

    const fetchData = async (filterval) => {
        await get_logs_data(localStorage.getItem("token"), dispatch, 1, 10, filterval);
    };

    useEffect(() => {
        fetchData('login');
    }, []);

    const formatDate = (date) => {
        const dated = new Date(date);
        const formattedDate = dated.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
        return formattedDate;
    };

    const handleFilterChange = (newFilter) => {
       setStatusFilter(newFilter);
       fetchData(newFilter);
    };

    return (
        <div>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0 fw-600">Logs Tracking</h3>
                </div>

                <div className="filters mb-3">
                    <div className="custom-select">
                        <p className="m-0 fw-bold">View By Status</p>
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
                                {/* <option value="all">All</option> */}
                                <option value="login">Login</option>
                                <option value="logout">Logout</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="table-responsive mt-4">
                    <table className="table table-hover user-management-table">
                        <thead className="border-gray">
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                            <th scope="col">Action</th>
                            <th scope="col">Message</th>
                            <th scope="col">Time</th>
                        </thead>
                        <tbody>
                            {Array.isArray(logsData) && totalLogs > 0 ? (
                                logsData?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr key={index}>
                                            <th scope="row">{index + 1}.</th>
                                            <td>
                                                <div className='table-col-name-td'>{item?.user_name ? item?.user_name : 'N/A'}</div>
                                            </td>
                                            <td>
                                                <div className=''>{item?.email ? item?.email : 'N/A'}</div>
                                            </td>
                                            <td>
                                                <div className='table-col-name-td'>{item?.role ? item?.role : 'N/A'}</div>
                                            </td>
                                            <td>
                                                <div className='table-col-name-td'>{item?.action_type ? item?.action_type : 'N/A'}</div>
                                            </td>
                                            <td className="table-col-name-td text-green font-weight-500 fw-bold">{item?.message ? item?.message : 'N/A'} </td>
                                            <td>{item?.created_at ? formatDate(item?.created_at) : '-'}</td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (<EmptyData />)}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-3">
                {totalLogs > 0 && (
                    <CustomPagination
                        total={totalLogs}
                        onPageChange={(page, perPage) => {
                            get_logs_data(localStorage.getItem("token"), dispatch, page, perPage);
                        }}
                    />
                )}
            </div>

        </div>
    )
};

export default AuditLogs;