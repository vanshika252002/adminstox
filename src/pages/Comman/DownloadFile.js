import React from 'react'
import { saveAs } from 'file-saver';

const { REACT_APP_BASE_URL } = process.env;

const DownloadFile = ({ invoiceUrl }) => {

    const handleDownload = async (url) => {
        if (!url) return;

        try {
            const filepath = url.includes('+') ? url.replace(/\+/g, '%2B') : url;
            const fileContent = `${REACT_APP_BASE_URL}profile/download?file=${filepath}`;
            const fileName = url?.substring(url?.lastIndexOf("/") + 1);
            const getMimeType = (ext) => {
                const mimeTypes = {
                    txt: "text/plain",
                    pdf: "application/pdf",
                    zip: "application/zip",
                    jpg: "image/jpeg",
                    jpeg: "image/jpeg",
                    png: "image/png",
                    gif: "image/gif",
                    mp4: "video/mp4",
                    mov: "video/quicktime"
                };
                return mimeTypes[ext] || "application/octet-stream";
            };

            const response = await fetch(fileContent, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem("token"),
                },
            });
            const blobFile = await response.blob();
            const fileExtension = fileName?.split(".").pop().toLowerCase();
            const mimeType = getMimeType(fileExtension);
            const blobwithtype = new Blob([blobFile], { type: mimeType });
            saveAs(blobwithtype, fileName);
        } catch (error) {
            console.log("Download error:", error)
        }
    };

    return (
        <div>
            <button type="button" className='w-auto download-btn btn-gradient-purple d-flex align-items-center gap-2' onClick={() => handleDownload(invoiceUrl)}>
                Invoice <i class="bi bi-download h5 mb-0"></i>
            </button>
        </div>
    )
}

export default DownloadFile