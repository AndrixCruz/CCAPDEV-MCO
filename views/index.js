document.addEventListener("DOMContentLoaded", async function () {
    // Retrieve the username from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const loggedInUsername = urlParams.get('username') || "Guest";

    // Set the username in the header
    document.getElementById("usernameLink").textContent = loggedInUsername;

    const searchBar = document.getElementById('search');

    searchBar.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchBar.value;
            window.location.href = `/search?query=${searchQuery}`;
        }
    });
});