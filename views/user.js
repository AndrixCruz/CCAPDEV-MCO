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
        const AboutMe = document.getElementById("newDescription").value;
        const age = document.getElementById("newAge").value;
        const gender = document.getElementById("newGender").value;
        const food = document.getElementById("newFood").value;
        const username = document.getElementById("newUsername").innerHTML;

        console.log(AboutMe, age, gender, food, username);

        if (AboutMe === "") {
            AboutMe = document.getElementById("userDescription").value;
        } 
        if (age === "") {
            age = document.getElementById("userDetailsAge").value;
        }
        if (gender === "") {
            gender = document.getElementById("userDetailsGender").value;
        }
        if (food === "") {
            food = document.getElementById("userDetailsFood").value;
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
            console.log('Error');
        }
    });
});