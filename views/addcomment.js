document.addEventListener("DOMContentLoaded", async function () {
  const addComment = document.getElementById('addCommentButton');

  addComment.addEventListener('click', async (e) => {
    e.preventDefault();

    const rating = document.getElementById('ratingInput').value;
    const comment = document.getElementById('newComment').value;
    const company = document.getElementById('companyNameInput').value;

    const response = await fetch('/addcomment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rating,
        comment,
        company
      })
    });

    const data = await response.json();

    if (data.status === 'ok') {
      window.location.reload();
    } else {
      console.log('Error');
    }
  });
});