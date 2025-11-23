import React, { useEffect, useState } from "react";
import { delete_newsletter_email, get_newsletter_lists } from "../reduxData/user/userAction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import EmptyData from "../components/EmptyData";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import { Box } from "@mui/joy";
import CustomPagination from "../components/CustomPagination";

let hasFetchedApis = false;

const NewsLetter = () => {
    const { user, accessToken } = useSelector((state) => state.auth);
    const { newsletterLists, totalNewsletters } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [deleteModal, setDeleteModal] = useState(false);
    const [data, setData] = useState(null);
    const [name, setName] = useState("");

    useEffect(() => {
        if (hasFetchedApis || !accessToken) return;
        hasFetchedApis = true;

        const fetchData = async () => {
            await get_newsletter_lists(accessToken, dispatch, 1, 10, name);
        };
        fetchData();

        return () => { hasFetchedApis = false; };
    }, []);

    const deleteNewsletter = async () => {
        let isDeleted = await delete_newsletter_email(dispatch, accessToken, data?.id);
        if (isDeleted) {
            await get_newsletter_lists(accessToken, dispatch, 1, 10);
            setData(null);
            setDeleteModal(false);
        }
    };

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
                Newsletter Management ({totalNewsletters})
            </h3>
            <div className="filters mb-3">
                <Input
                    id="nameInput"
                    type="text"
                    placeholder="Search by email"
                    value={name}
                    onChange={async (e) => {
                        setName(e.target.value);
                        await get_newsletter_lists(accessToken, dispatch, 1, 10, e.target.value);
                    }}
                />
            </div>
            <div className="table-responsive">
                <table className="table user-management-table table-hover">
                    <thead className="border-gray">
                        <th scope="col">Sr. No.</th>
                        <th scope="col">Email</th>
                        <th>Created At</th>
                        <th scope="col" className="text-center">Action</th>
                    </thead>
                    <tbody>
                        {totalNewsletters > 0 ?
                            newsletterLists.map((data, index) => (
                                <tr key={index}>
                                    <td>{index + 1}.</td>
                                    <td>{data?.email}</td>
                                    <td>{formatDate(data?.created_at)}</td>
                                    <td className="text-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                            className="cursor-pointer delete-icon bi bi-trash3-fill"
                                            onClick={() => { setData(data); setDeleteModal(true); }}
                                        >
                                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                        </svg>
                                    </td>
                                </tr>
                            )) : <EmptyData />}
                    </tbody>
                </table>
            </div>

            {totalNewsletters > 0 && (
                <CustomPagination
                    total={totalNewsletters}
                    onPageChange={(page, perPage) => { get_newsletter_lists(accessToken, dispatch, page, perPage) }}
                />
            )}

            <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
                <ModalDialog>
                    <DialogTitle>Delete Email</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete email ?
                    </DialogContent>
                    <Box>
                        <Button onClick={() => { setData(null); setDeleteModal(false); }}>Cancel</Button>
                        <Button
                            className="mx-2"
                            color="danger"
                            onClick={deleteNewsletter}
                        >
                            Delete
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </div>
    )
};

export default NewsLetter;