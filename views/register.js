document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const AboutMe = document.getElementById('AboutMe').value;
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const food = document.getElementById('food').value;
        const password = document.getElementById('password').value;
        
        if (username === '' || email === '' || password === '' || AboutMe === '' || age === ''|| gender === ''|| food === '') {
            return;
        }
        console.log(username, email, password);

        try{
            const response = await fetch ('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, AboutMe, age, gender, food, password})
            });
    
            const data = await response.json();
    
            if (data.status === 'ok') {
                alert('Registered successfully');
                window.location.href = '/login.html';
            } else {
                alert('Something went wrong');
            }
        } catch (err) {
            console.log(err);
        }
    });
});
