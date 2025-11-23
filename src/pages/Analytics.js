import React, { useEffect } from "react";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import { get_analytics_data } from "../reduxData/user/userAction";
import { useDispatch } from "react-redux";

const Analytics = () => {
    const { user } = useSelector((state) => state.auth);
     const { analyticsData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const statsData = [
        {
            label: "Total GMV (€)",
            value: analyticsData ? Number(analyticsData?.totalSale?.total_sale) : 0 ,
            color: "#0CB9B8",
        },
        {
            label: "Active Boutiques (or sellers)",
            value: analyticsData ? Number(analyticsData?.totalSellers?.total_sellers) : 0,
            color: "#837e7e",
        },
        {
            label: "Total Orders / Returns",
            value: analyticsData ? Number(analyticsData?.totalOrders?.total_orders) : 0,
            color: "#198754",
        },
        {
            label: "Commission Revenue (€)",
            value: analyticsData ? Number(analyticsData?.platformCommission?.total_platform_commission) : 0,
            color: "rgb(166 201 33)",
        },
    ];

    const fetchData = async () => {
        await get_analytics_data(localStorage.getItem("token"), dispatch);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="container">
                <div className="container-fluid admin-booking-detail-containers py-3">
                    <div className="row g-3 text-center">

                        {statsData?.map((item, index) => (
                            <div key={index} className="col-12 col-md-4 col-lg-4">
                                <div
                                    className="p-5 border rounded text-white h-100 d-flex flex-column justify-content-center"
                                    style={{ backgroundColor: item.color }}
                                >
                                    <p className="fs-6 mb-2">{item.label}</p>
                                    <h2 className="mb-0">
                                        <CountUp end={item.value} duration={5} useEasing={true} />
                                    </h2>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
};

export default Analytics;