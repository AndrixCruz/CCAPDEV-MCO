document.addEventListener("DOMContentLoaded", async function () {
    // Retrieve the username from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const loggedInUsername = urlParams.get('username') || "Guest";

    // Set the username in the header
    document.getElementById("usernameLink").textContent = loggedInUsername;

    const searchBar = document.getElementById('search');

    searchBar.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchBar.value;
            window.location.href = `/search?query=${searchQuery}`;
        }
    });
});


    // Define user objects for all establishments
    const beastUser = {
        name: 'Beast Burger',
        image: 'MrBeast.png',
        background: 'Virtual Dining Concepts, LLC',
        description: 'Beast Burger is an American virtual restaurant founded and developed by internet personality Jimmy Donaldson, in partnership with Virtual Dining Concepts, LLC. There are virtual locations in North America and Europe, with plans to expand to more countries and increase the number of locations significantly.',
        rating: '4.5',
        location: 'JustKitchen PH, Malate, Manila',
        hyperlink: 'https://maps.app.goo.gl/X9Z7nDEFPgWoptWj9',
        comments: 'Great burger!',
    };

    const kalsadaUser = {
        name: 'Kalsada Burger',
        image: 'Kalsada.png',
        background: 'Ramon Miguel Alberto',
        description: 'Kalsada Burger was Established By Ramon Miguel Alberto back in 2015.',
        rating: '3.5',
        location: 'Sta. Ana, Manila',
        hyperlink: 'https://maps.app.goo.gl/k1Rhr4C9kn8MBoELA',
        comments: 'Delicious burgers!',
    };

    const bkUser = {
        name: 'Burger King',
        image: 'BurgerKing.png',
        background: 'Burger King Corporation',
        description: 'Burger King Corporation, restaurant company specializing in flame-broiled fast-food hamburgers...',
        rating: '4',
        location: 'Taft Avenue, Manila',
        hyperlink: 'https://maps.app.goo.gl/njb6dcnMVf3DhNjFA',
        comments: 'Love the Whopper!',
    };

    const zarksUser = {
        name: 'Zark\'s',
        image: 'Zarks.png',
        background: 'Zark\'s Burgers',
        description: 'Zark\’s Burgers is a popular homegrown joint that serves American comfort food, especially huge, greasy burgers  and no other joint can beat them in freshness, size and taste.',
        rating: '5',
        location: 'Taft Avenue, Manila',
        hyperlink: 'https://maps.app.goo.gl/ufEZUWhyxtPoxN5L6',
        comments: 'Best burgers in town!',
    };

    const wendysUser = {
        name: 'Wendy\'s',
        image: 'Wendys.png',
        background: 'Unknown',
        description: 'Wendy\'s is an American international fast food restaurant chain founded by Dave Thomas on November 15, 1969, in Columbus, Ohio.',
        rating: '4.5',
        location: 'Robinson\'s Place Manila',
        hyperlink: 'https://maps.app.goo.gl/uonSaYJRmrjgn8DW8',
        comments: 'Great value for money!',
    };

    // Function to redirect to CompanyProfile.html
    function redirectToCompanyProfile(user) {
        const urlParams = new URLSearchParams();
        urlParams.set('name', user.name);
        urlParams.set('image', user.image);
        urlParams.set('background', user.background);
        urlParams.set('description', user.description);
        urlParams.set('rating', user.rating);
        urlParams.set('location', user.location);
        urlParams.set('hyperlink', user.hyperlink);
        urlParams.set('comments', user.comments);
        window.location.href = `CompanyProfile.html?${urlParams.toString()}`;
    }

    // Event listeners for "More" buttons
    const toggleButtons = document.querySelectorAll('.btn');
    toggleButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const reviewInfo = document.querySelectorAll('.review-info');
            reviewInfo.forEach((info) => {
                info.style.display = 'none';
            });
            reviewInfo[index].style.display = 'block';
        });
    });