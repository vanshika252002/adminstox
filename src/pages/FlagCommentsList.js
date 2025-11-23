import React, { useEffect, useState, useCallback } from "react";
import { Box, Input, Select, Option, Button } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmptyData from "../components/EmptyData";
import CustomPagination from "../components/CustomPagination";
import {
  getPendingFlagsAPI,
  reviewFlagAPI,
} from "../reduxData/user/userAction";
import { toast } from "react-toastify";

const FlagCommentsList = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalReports, setTotalReports] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const DefaultImg =
    "https://ibb.co/gbfNz7Kb";

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPendingFlagsAPI(
        pagination.page,
        pagination.pageSize
      );
      setReports(response?.data || []);
      setTotalReports(response?.total || 0);
    } catch (error) {
      toast.error("Failed to load flagged comments.");
    } finally {
      setIsLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleReview = async (reportId, decision) => {
    const action = decision === "approve" ? "delete" : "keep";
    if (
      !window.confirm(
        `Are you sure you want to ${action} this comment? This action is permanent.`
      )
    ) {
      return;
    }

    try {
      const success = await reviewFlagAPI({ reportId, decision });
      if (success) {
        toast.success(`Report reviewed and comment has been handled.`);
        setReports((prevReports) =>
          prevReports.filter((report) => report._id !== reportId)
        );
        setTotalReports((prevTotal) => prevTotal - 1);
      }
    } catch (error) {}
  };

  const handlePageChange = (newPage, newPageSize) => {
    setPagination({ page: newPage, pageSize: newPageSize });
  };

  return (
    <div>
      <div className="container">
        <Box className="d-flex mb-4 justify-content-between align-items-center">
          <h3 className="mb-0 fw-600">{`Pending Flagged Comments (${totalReports})`}</h3>
        </Box>
        <div className="table-responsive">
          <table className="table user-management-table">
            <thead>
              <tr>
                <th>Reported By</th>
                <th>Item</th>
                <th>Reported Comment</th>
                <th>Actions</th>
                {/* <button onClick={() => console.log(reports)}>logger</button> */}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report._id}>
                    <td
                      style={{
                        textAlign: "left",
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      className="clickable-cell"

                    >
                      <div
                        className="d-flex align-items-center justify-content-left cursor-pointer"
                        onClick={() =>
                          navigate(`/editUser/${report?.reporterUserId?._id}`)
                        }
                      >
                        <span
                        // className="flag-comments-img-wrap"
                        >
                          <img
                            src={
                              report?.reporterUserId?.profile_pic
                                ? `${report?.reporterUserId?.profile_pic}`
                                : DefaultImg
                            }
                            style={{ width: 40, height: 40, borderRadius: 75 }}
                            className="object-fit-cover "
                            alt=""
                          />
                        </span>
                        <div className="px-2">
                          <span className="text-capitalize">
                            {report?.reporterUserId?.user_name}
                          </span>
                          <br />
                          {/* {report?.reporterUserId?.email} */}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      className="clickable-cell"
                    >
                      <a
                        // href={`https://bid4styleadmin.visionvivante.in/auction/${report.itemId?.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{width: '100%', height: '100%'}}
                      >
                        {report.itemId?.item_name || "N/A"}
                      </a>
                    </td>
                    {/* <td>
                      <strong>{report.reportedContent?.name}:</strong>
                      <p className="mb-0">
                        "{report.reportedContent?.comment}"
                      </p>
                    </td> */}
                    <td
                      className="clickable-cell"
                    
                    >
                      <div
                        className="d-flex flex-column align-items-start justify-content-left cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/editUser/${report?.reportedContent?.userId._id}`
                          )
                        }
                      >
                        <div className="d-flex align-items-center mb-2">
                          <span
                          // className="flag-comments-img-wrap"
                          >
                            <img
                              src={
                                report?.reportedContent?.userId?.profile_pic
                                  ? `${report?.reportedContent?.userId?.profile_pic}`
                                  : DefaultImg
                              }
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 75,
                              }}
                              className="object-fit-cover "
                              alt=""
                            />
                          </span>
                          <div className="px-2">
                            <span className="text-capitalize fw-600">
                              {report?.reportedContent?.userId?.user_name}
                            </span>
                            <br />
                          </div>
                        </div>
                        {report.contentType === "reply" ? (
                          <span style={{ maxWidth: "400px" }}>
                            <span
                              style={{ color: "#fab406", fontWeight: "600" }}
                            >
                              RE:{" "}
                              {
                                report?.reportedContent.replyingToUserId
                                  .user_name
                              }
                            </span>{" "}
                            {report?.reportedContent?.text}
                          </span>
                        ) : (
                          <span style={{ maxWidth: "400px" }}>
                            {report?.reportedContent?.comment}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* <td>{report.reason}</td> */}
                    <td>
                      <div
                        className="d-flex gap-2"
                        style={{ flexDirection: "column" }}
                      >
                        <Button
                          size="sm"
                          color="success"
                          onClick={() => handleReview(report._id, "reject")}
                        >
                          Keep
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => handleReview(report._id, "approve")}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <EmptyData />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          {totalReports > pagination.pageSize && (
            <CustomPagination
              total={totalReports}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlagCommentsList;
