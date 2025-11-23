import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import {
  searchUsersAPI,
  sendNotificationAPI,
} from "../reduxData/user/userAction";
import { toast } from "react-toastify";

const NotifyUsers = () => {
  const [notificationType, setNotificationType] = useState("all");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      try {
        const users = await searchUsersAPI(term);
        const newResults = users.filter(
          (user) => !selectedUsers.some((selected) => selected._id === user._id)
        );
        setSearchResults(newResults);
      } catch (error) {
        console.error("Error searching users:", error);
        toast.error("Failed to search for users.");
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [selectedUsers]
  );

  useEffect(() => {
    setIsSearching(true);
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return toast.error("Notification message cannot be empty.");
    }
    if (notificationType === "specific" && selectedUsers.length === 0) {
      return toast.error("Please select at least one user to notify.");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        message: message,
        link: link.trim() || null,
        targetUserIds:
          notificationType === "all" ? "all" : selectedUsers.map((u) => u._id),
      };

      const success = await sendNotificationAPI(payload);

      if (success) {
        setMessage("");
        setLink("");
        setSearchTerm("");
        setSearchResults([]);
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Notify Users</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Send To:</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="notificationType"
                    id="allUsers"
                    value="all"
                    checked={notificationType === "all"}
                    onChange={(e) => setNotificationType(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="allUsers">
                    All Users
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="notificationType"
                    id="specificUsers"
                    value="specific"
                    checked={notificationType === "specific"}
                    onChange={(e) => setNotificationType(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="specificUsers">
                    Specific Users
                  </label>
                </div>
              </div>
            </div>

            {notificationType === "specific" && (
              <div className="mb-3 p-3 border rounded">
                <label htmlFor="userSearch" className="form-label">
                  Search for Users
                </label>
                <input
                  type="text"
                  id="userSearch"
                  className="form-control"
                  placeholder="Search by name, username, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {isSearching && searchTerm.length > 1 && (
                  <div className="mt-2">Searching...</div>
                )}

                {searchResults.length > 0 && (
                  <ul className="list-group mt-2">
                    {searchResults.map((user) => (
                      <li
                        key={user._id}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSelectUser(user)}
                        style={{ cursor: "pointer" }}
                      >
                        {user.user_name} ({user.email})
                      </li>
                    ))}
                  </ul>
                )}

                {selectedUsers.length > 0 && (
                  <div className="mt-3">
                    <h6>Selected Users:</h6>
                    <ul className="list-group">
                      {selectedUsers.map((user) => (
                        <li
                          key={user._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {user.user_name} ({user.email})
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Remove"
                            onClick={() => handleRemoveUser(user._id)}
                          ></button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="notificationMessage" className="form-label">
                Notification Message
              </label>
              <textarea
                id="notificationMessage"
                className="form-control"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="notificationLink" className="form-label">
                Link (Optional) - copy and paste the url of the page you want the
                notifcation to take the user to when clicked on.
              </label>
              <input
                type="url"
                id="notificationLink"
                className="form-control"
                // placeholder="e.g., https://bid4styleadmin.visionvivante.in/auctions/item"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-warning"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Notification"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotifyUsers;
