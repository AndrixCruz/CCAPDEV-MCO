document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if ( email === '' || password === '') {
            return;
        }
        
        try{
            const response = await fetch(`/login?email=${email}&password=${password}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            const data = await response.json();
    
            if (data.status === 'ok') {
                alert('logged in successfully');
                window.location.href = '/profile.html';
            } else {
                alert('Something went wrong');
            }
        } catch (err) {
            console.log(err);
        }
    });
});
