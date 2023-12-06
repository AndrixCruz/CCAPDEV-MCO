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
});