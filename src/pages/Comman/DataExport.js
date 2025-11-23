import React from "react";
import { CSVLink } from "react-csv";

const DataExport = ({ data }) => {
    const csvData = data.map(item => ({
        ID: item.id,
        Name: item.name,
        Email: item.email,
        User_ID: item.user_id,
        Item_ID: item.item_id,
        Title: item.title,
        Slug: item.slug,
        Amount: item.amount,
        Total_Amount: item.total_amount,
        VAT: item.vat,
        Status: item.status,
        Created_At: item.created_at,
        Updated_At: item.updated_at,
        Seller_ID: item.seller_id,
        Sold_To: item.sold_to,
        Billing_City: item.billing_address.city,
        Billing_Country: item.billing_address.country,
        Shipping_City: item.shipping_address.city,
        Shipping_Country: item.shipping_address.country,
    }));

    const headers = [
        { label: "ID", key: "ID" },
        { label: "Name", key: "Name" },
        { label: "Email", key: "Email" },
        { label: "User ID", key: "User_ID" },
        { label: "Item ID", key: "Item_ID" },
        { label: "Title", key: "Title" },
        { label: "Slug", key: "Slug" },
        { label: "Amount", key: "Amount" },
        { label: "Total Amount", key: "Total_Amount" },
        { label: "VAT", key: "VAT" },
        { label: "Status", key: "Status" },
        { label: "Created At", key: "Created_At" },
        { label: "Updated At", key: "Updated_At" },
        { label: "Seller ID", key: "Seller_ID" },
        { label: "Sold To", key: "Sold_To" },
        { label: "Billing City", key: "Billing_City" },
        { label: "Billing Country", key: "Billing_Country" },
        { label: "Shipping City", key: "Shipping_City" },
        { label: "Shipping Country", key: "Shipping_Country" },
    ];

    const filename = "transaction_data_" + new Date().toISOString().slice(0, 10) + ".csv";

    return (
        <div>
            <CSVLink
                data={csvData}
                headers={headers}
                filename={filename}
                className="btn common-button"
            >
                <i className="bi bi-download me-2"></i> Download CSV
            </CSVLink>
        </div>
    )
};

export default DataExport;