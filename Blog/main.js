document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('post.html')) {
        // On the post page, display the selected post's content
        displaySelectedPost();
    } else {
        // Fetch blog data from JSON file and display all posts
        fetch('blogs.json')
            .then(response => response.json())
            .then(data => displayAllPosts(data))
            .catch(error => console.error('Error fetching blog data:', error));
    }

    // Change the header background on scroll
    let header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scroll-header', window.scrollY > 0);
    });
});

function displayAllPosts(data) {
    const postContainer = document.querySelector('.post.container');
    postContainer.innerHTML = ''; // Clear the existing posts

    data.forEach((post, index) => {
        const postBox = document.createElement('div');
        postBox.classList.add('post-box', post.category.toLowerCase());

        postBox.innerHTML = `
            <img src="${post.imgSrc}" alt="" class="post-img">
            <h2 class="category">${post.category}</h2>
            <a href="post.html?id=${index}" class="post-title">${post.title}</a>
            <span class="post-date">${post.date}</span>
            <p class="post-detail-description" style="font-weight: 100;">${post.description}</p>
            <div class="profile">
                <img src="${post.profileImgSrc}" alt="" class="profile-img">
                <span class="profile-name">${post.profileName}</span>
            </div>
        `;

        postContainer.appendChild(postBox);
    });
}

function displaySelectedPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    fetch('blogs.json')
        .then(response => response.json())
        .then(data => {
            const postContent = data[postId];
            if (postContent) {
                document.querySelector('.post-img').src = postContent.imgSrc;
                document.querySelector('.category').innerText = postContent.category;
                document.querySelector('.post-title').innerText = postContent.title;
                document.querySelector('.post-date').innerText = postContent.date;
                document.querySelector('.post-detail-description').innerText = postContent.description;
                document.querySelector('.profile-img').src = postContent.profileImgSrc;
                document.querySelector('.profile-name').innerText = postContent.profileName;
            } else {
                document.querySelector('.post').innerHTML = '<p>Post not found.</p>';
            }
        })
        .catch(error => console.error('Error fetching post data:', error));
}


// nav background
let header = document.querySelector("header");

window.addEventListener("scroll", () => {
    header.classList.toggle("shadow", window.scrollY > 0)
})

//Filter
$(document).ready(function () {
    $(".filter-item").click(function () {
        const value = $(this).attr("data-filter");
        if (value == "all"){
            $(".post-box").show("1000")
        } else{
            $(".post-box")
                .not("." + value)
                .hide(1000);
            $(".post-box")
            .filter("." + value)
            .show("1000")
        }
    });
    $(".filter-item").click(function () {
        $(this).addClass("active-filter").siblings().removeClass("active-filter")
    });
});