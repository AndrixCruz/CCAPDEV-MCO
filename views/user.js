document.addEventListener("DOMContentLoaded", function () {
    // Edit Profile functionality
    const editProfileForm = document.getElementById("editProfileForm");
    const editProfileButton = document.getElementById("editProfileButton");
    const saveProfileButton = document.getElementById("saveProfileButton");
    const cancelEditButton = document.getElementById("cancelEditButton");

    editProfileButton.addEventListener("click", function () {
        editProfileForm.style.display = "block";
        document.getElementById("desc").style.display = "none";
    });

    cancelEditButton.addEventListener("click", function () {
        editProfileForm.style.display = "none";
        document.getElementById("desc").style.display = "block";
    });

    saveProfileButton.addEventListener("click", async function () {
        let AboutMe = document.getElementById("newDescription").value;
        let age = document.getElementById("newAge").value;
        let gender = document.getElementById("newGender").value;
        let food = document.getElementById("newFood").value;
        let username = document.getElementById("newUsername").innerHTML;
        const loggedUsername = document.getElementById("usernameInput").value;

        if (AboutMe === "") {
            AboutMe = document.getElementById("oldDescription").value;
        } 
        if (age === "") {
            age = document.getElementById("oldAge").value;
        }
        if (gender === "") {
            gender = document.getElementById("oldGender").value;
        }
        if (food === "") {
            food = document.getElementById("oldFood").value;
        }

        const response = await fetch("/edituser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                AboutMe,
                age,
                gender,
                food,
                username,
            }),
        });

        const data = await response.json();

        if (data.status === 'ok') {
            alert('Profile updated!');
            window.location.reload();
        } else {
            alert(data.message);
        }
    });
});