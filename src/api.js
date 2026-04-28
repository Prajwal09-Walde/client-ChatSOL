import { API_URL } from './config';

export const fetchResponse = async(chat) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/`, {
             method: 'POST',
             headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
             },
             body: JSON.stringify({
                message: chat.map((message) => message.message).join("\n")
             })
            })

            const data = await response.json()
            return data
    } catch(error) {
        console.log(error);
        return { error: "Network error" };
    }
}