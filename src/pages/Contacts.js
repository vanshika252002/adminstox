import React, { useEffect, useState } from "react";
import { get_contact_lists } from "../reduxData/user/userAction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import EmptyData from "../components/EmptyData";
import CustomPagination from "../components/CustomPagination";
import { Button } from "@mui/joy";
import ViewQuery from "../Modals/ViewQuery";
import Input from "@mui/joy/Input";

let hasFetchedApis = false;

const Contacts = () => {
    const { user, accessToken } = useSelector((state) => state.auth);
    const { contactLists, totalContacts } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [isShow, setIsShow] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        if (hasFetchedApis || !accessToken) return;
        hasFetchedApis = true;

        const fetchData = async () => {
            await get_contact_lists(accessToken, dispatch, 1, 10, name);
        };
        fetchData();

        return () => { hasFetchedApis = false; };
    }, []);

    const formatDate = (inputdate) => {
        const date = new Date(inputdate);

        // Get day, date, and month
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const day = days[date.getUTCDay()];
        const dayOfMonth = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();

        return `${dayOfMonth} ${month} ${year}`;
    };

    return (
        <div>
            <h3 className="mb-3 fw-600">
                Queries Management ({totalContacts})
            </h3>
            
                <div className="filters mb-3">
                    <Input
                        id="nameInput"
                        type="text"
                        placeholder="Search by name/email"
                        value={name}
                        onChange={async (e) => {
                            setName(e.target.value);
                            await get_contact_lists(accessToken, dispatch, 1, 10, e.target.value);
                        }}
                    />
                </div>
            
            <div className="table-responsive">
                <table className="table user-management-table table-hover">
                    <thead className="border-gray">
                        <th scope="col">Sr. No.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Message</th>
                        <th scope="col">Created At</th>
                        <th scope="col" className="text-center">Action </th>
                    </thead>
                    <tbody>
                        {totalContacts > 0 ?
                            contactLists.map((data, index) => (
                                <tr key={index}>
                                    <td className="col">{index + 1}.</td>
                                    <td className="col">{data?.name}</td>
                                    <td className="col">{data?.email}</td>
                                    <td className="fw-bold col">
                                        {data?.message?.length > 30
                                            ? data.message.slice(0, 30) + "..."
                                            : data?.message}
                                    </td>
                                    <td className="col">{formatDate(data?.created_at)}</td>
                                    <td>
                                        <Button
                                            className="p-0 text-decoration-underline "
                                            variant="contained"
                                            color="primary"
                                            style={{ color: "#0d6efd" }}
                                            onClick={() => {
                                                setData(data);
                                                setIsShow(true);
                                            }}
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            )) : <EmptyData />}
                    </tbody>
                </table>
            </div>
            {totalContacts > 0 && (
                <CustomPagination
                    total={totalContacts}
                    onPageChange={(page, perPage) => { get_contact_lists(accessToken, dispatch, page, perPage) }}
                />
            )}
            {isShow && <ViewQuery show={isShow} handleClose={() => { setData(null); setIsShow(false); }} data={data} />}
        </div>
    )
};

export default Contacts;