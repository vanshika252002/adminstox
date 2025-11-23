import { Box } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { get_export_sales, get_user_sales_history, get_users, gotToExport } from '../reduxData/user/userAction';
import { useDispatch } from 'react-redux';
import { BarChart } from '@mui/x-charts';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const SalesHistory = () => {
    const {isLoading}=useSelector(state=>state.loading.isLoading);
    const utcYear = new Date().getUTCFullYear();
    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,];
    const [formData, setFormData] = useState({
        year: utcYear,
        user: 'ALL'
    });

    const [userManagement, setUserManagement] = useState([]);
    const dispatch = useDispatch();
    const {user}=useSelector(state=>state.auth);
    const handleChange = (label, value) => {
        setFormData((prev) => ({ ...prev, [label]: value }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_users(dispatch, localStorage.getItem("token"));
                setUserManagement(data?.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, [dispatch]);

    const [salesData, setSalesData] = useState({
        months: [],
        sales: [],
        amounts: []
    });
    useEffect(() => {
        const handleSales = async () => {
            const data = {
                user_id: formData?.user,
                year: formData?.year
            };

            let getdata = await get_user_sales_history(localStorage.getItem("token"), data, dispatch);
            if (getdata) {
                setSalesData(prev => ({
                    ...prev,
                    months: getdata?.map((item) => item?.month),
                    sales: getdata?.map((item) => item?.sales),
                    amounts: getdata?.map((item) => item?.amount)
                }));
            }
        };
        handleSales();
    }, [formData?.year, formData?.user]);
    const exportData=async()=>{
        const data = await get_export_sales(dispatch,localStorage.getItem("token"),formData?.user,formData?.year);
        if (data) {
          gotToExport(data,'sales');
        } else{
          toast.error("Can't export users");
        }
      }
    return (
        <div>
            <div className='container'>
                <Box className="d-flex mb-4 justify-content-between align-items-center">
                    <h3 className="mb-0 fw-600">Sales History</h3>
                    <div className="d-flex gap-2 justify-content-between align-items-center">
                        <div className="d-flex gap-2 justify-content-between align-items-center me-2">
                            <label>Select User:</label>
                            <select
                                className="form-control"
                                value={formData?.user}
                                onChange={(e) => handleChange("user", e.target.value)}
                            >
                                <option value="" disabled>Choose a user</option>
                                <option value="ALL">All</option>
                                {userManagement?.map((item, index) => (
                                    <option key={index} value={item?._id}> {item?.user_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="d-flex gap-2 justify-content-between align-items-center">
                            <label>Select Year:</label>
                            <select
                                className="form-control"
                                value={formData?.year}
                                onChange={(e) => handleChange("year", e.target.value)}
                            >
                                <option value="" disabled>Choose a year</option>
                                {years?.map((item, index) => (
                                    <option key={index} value={item}> {item}</option>
                                ))}
                            </select>
                        </div>
                        {(((user?.role==='staff') && (user?.permission?.p_reports>1)) || (user?.role!=='staff')) && <button type="button" className="btn common-button ms-3" disabled={isLoading} onClick={()=>exportData(null)}>
                            <i className="fa fa-download me-1"></i>
                            Export
                        </button>}
                    </div>
                </Box>
                <div style={{ width: '100%', height: '400px' }}>
                    <BarChart
                        xAxis={[
                            {
                                data: salesData?.months,
                                label: 'Months',
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: salesData?.sales,
                                label: 'Sales',
                                color: '#FAB406'
                            },
                            {
                                data: salesData?.amounts,
                                label: 'Amount',
                                color: '#3498db',
                                visible: false,
                            },
                        ]}
                        width={800}
                        height={400}
                        title="Monthly Sales History"
                        tooltip={(point) => {
                            console.log(point);
                        }}
                    //onMouseOver={(point) => handlePoint(point)}
                    />
                </div>
            </div>
        </div>
    )
}

export default SalesHistory