document.addEventListener('DOMContentLoaded', async function () {
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === '' || password === '') {
            return;
        }
        
        try {
            const response = await fetch(`/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Logged in successfully');
                window.location.href = `/`;
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.log(err);
        }
    });
});
