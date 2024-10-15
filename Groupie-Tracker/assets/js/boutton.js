let slideIndex = 1;

showSlide(slideIndex);

function showSlide(n) {
    let slides = document.getElementsByClassName("slide");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
    updatePlayButtonLink(); 
}

function prevSlide() {
    showSlide(slideIndex -= 1);
}

function nextSlide() {
    showSlide(slideIndex += 1);
}

function getCurrentArtistID() {
    var currentSlideURL = document.querySelector('.id-btn').getAttribute('href');
    var urlParts = currentSlideURL.split('/');                                                          
    return urlParts[urlParts.length - 1];
}

function updatePlayButtonLink() {
    var playBtn = document.getElementById('play-btn');
    var currentArtistID = getCurrentArtistID();
    playBtn.href = "/artists/" + currentArtistID;
}

updatePlayButtonLink();