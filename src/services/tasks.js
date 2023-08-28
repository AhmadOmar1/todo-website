export async function fetchTasksFromApi(apiUrl,limit) {
    const response = await fetch(`${apiUrl}?limit=${limit}`);
    if (!response.ok) {
        throw new Error(`Response status is not ok`);
    }
    const data = await response.json();
    return data.todos;
}

export async function postToApi(taskData) {
    try {
        const response = await fetch(`${apiUrl}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error("Failed to add task");
        }

        const responseData = await response.json();
        console.log("Task added successfully:", responseData);
    } catch (error) {
        console.error("Error adding task:", error);
    }
}


export async function updatetoApi(id) {
    fetch(`https://dummyjson.com/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            completed: true,
        }),
    })
        .then((res) => res.json())
        .then(console.log);
}

export async function deleteFromApi(id) {
    fetch(`https://dummyjson.com/todos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .then(console.log);
}