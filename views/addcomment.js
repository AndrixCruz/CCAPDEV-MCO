document.addEventListener("DOMContentLoaded", async function () {
    // Function to populate the second HTML with company data
    function populateCompanyData() {
      // Retrieve company data from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('name');
      const image = urlParams.get('image');
      const description = urlParams.get('description');
      const rating = urlParams.get('rating');
      const location = urlParams.get('location');
      const hyperlink = urlParams.get('hyperlink');
  
      // Update HTML elements with company data
      document.getElementById('companyName').textContent = name;
      document.getElementById('companyNameLink').textContent = name;
      document.getElementById('companyLogo').src = image;
      document.getElementById('companyDescription').textContent = description;
      document.getElementById('companyRating').textContent = rating;
      document.getElementById('companyLocation').textContent = location;
  
      const companyLocationLink = document.getElementById('companyLocation');
  
      // Set the href attribute of the anchor element with the companyHyperlink data
      companyLocationLink.href = hyperlink;
    }
  
    // Function to add a new comment
    async function addComment(companyId, companyName) {
      const ratingInput = document.getElementById("ratingInput");
      const newCommentInput = document.getElementById("newComment");
      const commentsSection = document.getElementById("comments");
  
      const rating = ratingInput.value;
      const commentText = newCommentInput.value;
  
      if (rating.trim() !== "" && commentText.trim() !== "") {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `
          <p><strong>Rating:</strong> ${rating}</p>
          <p>${commentText}</p>
          <button class="editCommentButton">Edit</button>
          <button class="deleteCommentButton">Delete</button>
        `;
  
        // Add the comment to the comments section
        commentsSection.appendChild(commentElement);
  
        // Clear the input fields
        ratingInput.value = "";
        newCommentInput.value = "";
  
        const editCommentButton = commentElement.querySelector(".editCommentButton");
        const deleteCommentButton = commentElement.querySelector(".deleteCommentButton");
  
        editCommentButton.addEventListener("click", async function () {
          const existingComment = commentElement.querySelector("p:last-of-type").textContent;
          const updatedComment = prompt("Edit your comment:", existingComment);
  
          if (updatedComment !== null) {
            commentElement.querySelector("p:last-of-type").textContent = updatedComment;
  
            // Get the comment ID from the server (you need to set the comment ID when adding the comment)
            const commentId = await getCommentIdFromServer();
  
            // Send the updated comment to the server with the company name
            const response = await fetch('/editcomments', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                commentId: commentId,
                company: companyName,
                updatedRating: rating,
                updatedCommentText: updatedComment,
              }),
            });
  
            // Check the response from the server
            const responseData = await response.json();
            if (responseData.status !== 'ok') {
              console.error('Failed to edit comment on the server.');
              // You may want to handle the error case here
            }
          }
        });
  
        deleteCommentButton.addEventListener("click", async function () {
          commentsSection.removeChild(commentElement);
  
          // Get the comment ID from the server (you need to set the comment ID when adding the comment)
          const commentId = await getCommentIdFromServer();
  
          // Send a request to delete the comment from the server with the company name
          const deleteResponse = await fetch('/deletecomment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              commentId: commentId,
            }),
          });
  
          // Check the response from the server
          const deleteData = await deleteResponse.json();
          if (deleteData.status !== 'ok') {
            console.error('Failed to delete comment on the server.');
            // You may want to handle the error case here
          }
        });
  
        // Send the comment to the server with the company name
        const response = await fetch('/addcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyId: companyId,
            company: companyName,
            rating: rating,
            commentText: commentText,
          }),
        });
  
        // Check the response from the server
        const responseData = await response.json();
        if (responseData.status !== 'ok') {
          console.error('Failed to add comment to the server.');
          // You may want to handle the error case here
        }
      }
    }
  
    // Function to fetch comments from the server based on company ID
    async function fetchComments() {
        try {
            const response = await fetch('/getcomments');
            const comments = await response.json();
    
            // Clear existing comments
            commentsSection.innerHTML = '';
    
            // Display fetched comments for the current company
            const urlParams = new URLSearchParams(window.location.search);
            const currentCompanyName = urlParams.get('name');
    
            comments.forEach(comment => {
                // Check if the comment belongs to the current company
                if (comment.company === currentCompanyName) {
                    const commentElement = document.createElement("div");
                    commentElement.id = comment._id;
                    commentElement.classList.add("comment");
                    commentElement.innerHTML = `
                        <p><strong>Rating:</strong> ${comment.rating}</p>
                        <p>${comment.commentText}</p>
                        <button class="editCommentButton">Edit</button>
                        <button class="deleteCommentButton">Delete</button>
                    `;
                    commentsSection.appendChild(commentElement);
    
                    const editCommentButton = commentElement.querySelector(".editCommentButton");
                    const deleteCommentButton = commentElement.querySelector(".deleteCommentButton");
    
                    editCommentButton.addEventListener("click", async function () {
                    });
    
                    deleteCommentButton.addEventListener("click", async function () {
                    });
                }
            });
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    }

  
    async function getCommentIdFromServer() {
      // Send a request to the server to get the comment ID
      const commentIdResponse = await fetch('/getcommentid', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check the response from the server
      const commentIdData = await commentIdResponse.json();
      if (commentIdData.status === 'ok') {
        return commentIdData.commentId;
      } else {
        console.error('Failed to get comment ID from the server.');
        // You may want to handle the error case here
        return null;
      }
    }
  
    const commentSubmitForm = document.getElementById("commentSubmitForm");
    const commentsSection = document.getElementById("comments");
  
    // Call the function to populate the second HTML with company data
    populateCompanyData();
  
    await fetchComments();
  
    commentSubmitForm.addEventListener("submit", async function (event) {
      // Prevent the default form submission behavior
      event.preventDefault();
  
      // Retrieve company data from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const companyId = urlParams.get('companyId');
      const companyName = urlParams.get('name');
  
      // Add a new comment with company ID and name
      await addComment(companyId, companyName);
  
      // Fetch and display comments for the current company
      await fetchComments();
    });
  
  });