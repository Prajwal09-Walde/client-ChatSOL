export const fetchResponse = async(chat) => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3080/", {
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