document.addEventListener('DOMContentLoaded', async function () {
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === '' || password === '') {
            return;
        }
        console.log(email, password);
        try {
            const response = await fetch(`/login?email=${email}&password=${password}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (data.status === 'ok') {
                alert('Logged in successfully');
                // Save the username to a variable
                const loggedInUsername = data.username || "Guest";
                // Redirect to profile.html with the username as a parameter
                window.location.href = `/profile.html?username=${loggedInUsername}`;
            } else {
                alert('Something went wrong');
            }
        } catch (err) {
            console.log(err);
        }
    });
});
