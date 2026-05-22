import { API_URL } from './config';

export const fetchResponse = async(chat) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api`, {
             method: 'POST',
             headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
             },
             body: JSON.stringify({
                chat: chat.map((msg) => ({
                    sender: msg.sender,
                    message: msg.message,
                    attachments: msg.attachments || []
                }))
             })
            })

            const data = await response.json()
            return data
    } catch(error) {
        console.log(error);
        return { error: "Network error" };
    }
}

export const fetchDocuments = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/knowledge/documents`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error("fetchDocuments error:", error);
        return [];
    }
};

export const uploadDocument = async (filename, content) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/knowledge/upload`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ filename, content })
        });
        return await response.json();
    } catch (error) {
        console.error("uploadDocument error:", error);
        return { error: "Failed to upload document" };
    }
};

export const deleteDocument = async (filename) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/knowledge/documents/${encodeURIComponent(filename)}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error("deleteDocument error:", error);
        return { error: "Failed to delete document" };
    }
};