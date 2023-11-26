document.addEventListener('DOMContentLoaded', function() {
    const addCommentButton = document.getElementById('addCommentButton');

    addCommentButton.addEventListener('click', async function(e) {
        e.preventDefault();

        //const username = document.getElementById('username').value; // bug here
        //const time = document.getElementById('time').value; // bug here
        //const restaurant = document.getElementById('password').value; // bug here
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;
        //const email = document.getElementById('email').value; // bug here

        if (rating === '' || comment === '' ) {
            return;
        }

        console.log( rating, comment );

        try{
            const response = await fetch ('/addreview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comment })
            });
    
            const data = await response.json();
    
            if (data.status === 'ok') {
                alert('Comment added successfully');
               location.reload();// not sure if this is correct
            } else {
                alert('Something went wrong');
            }
        } catch (err) {
            console.log(err);
        }
    });
});