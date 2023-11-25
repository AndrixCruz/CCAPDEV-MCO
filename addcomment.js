document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('addCommentButton');

    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value; // bug here
        const time = document.getElementById('time').value; // bug here
        const restaurant = document.getElementById('password').value; // bug here
        const rating = document.getElementById('ratingInput').value;
        const comment = document.getElementById('newComment').value;
        const email = document.getElementById('email').value; // bug here

        if (username === '' || time === '' || restaurant === '' || rating === '' || comment === '' || email === '') {
            return;
        }

        console.log(username, time, restaurant, rating, comment, email);

        try{
            const response = await fetch ('/addreview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, time, restaurant, rating, comment, email })
            });
    
            const data = await response.json();
    
            if (data.status === 'ok') {
                alert('Comment added successfully');
                window.location.href = '/login.html'; // not sure if this is correct
            } else {
                alert('Something went wrong');
            }
        } catch (err) {
            console.log(err);
        }
    });
});