document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (username === '' || email === '' || password === '') {
            return;
        }

        console.log(username, email, password);

        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.status === 'ok') {
            alert('Registered successfully');
            window.location.href = '/login.html';
        } else {
            alert('Something went wrong');
        }
    });
});
