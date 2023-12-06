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

  const commentsContainer = document.getElementById('comments');

  commentsContainer.addEventListener('click', async (e) => {
    const clickedButton = e.target.closest('button');

    if (clickedButton) {
      const buttonId = clickedButton.id;
      if (buttonId) {
        // Check if class is equal to editCommentButton
        if (clickedButton.classList.contains('helpfulButton')) {
          const response = await fetch('/helpfulcomment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              buttonId,
            })
          });

          const data = await response.json();

          if (data.status === 'ok') {
            alert('Review marked as helpful');
            window.location.reload();
          } else {
            console.log('Error');
          }
        } else if (clickedButton.classList.contains('deleteCommentButton')) {
          const response = await fetch('/deletecomment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              buttonId,
            })
          });
  
          const data = await response.json();
  
          if (data.status === 'ok') {
            window.location.reload();
          } else {
            console.log('Error');
          }
        } else if (clickedButton.classList.contains("editCommentButton")) {
          const editedComment = window.prompt("Edit your comment");

          const response = await fetch('/editcomment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              buttonId,
              editedComment,
            })
          });

          const data = await response.json();

          if (data.status === 'ok') {
            window.location.reload();
          } else {
            console.log('Error');
          }
        }
      }
    }
  });
});