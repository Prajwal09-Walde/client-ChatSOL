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

export const fetchResponseStream = async (chat, onChunk, onError) => {
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
        });

        if (!response.ok) {
            const errText = await response.text();
            let errData;
            try { errData = JSON.parse(errText); } catch { errData = { error: errText }; }
            throw new Error(errData.error || `HTTP error ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
                const chunk = decoder.decode(value, { stream: !done });
                onChunk(chunk);
            }
        }
    } catch (error) {
        console.error("fetchResponseStream error:", error);
        onError(error.message || "Network error");
    }
};

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