function disableOtherCheckboxes(checkboxToKeep) {
    checkboxes.forEach(function(checkbox) {
        if (checkbox !== checkboxToKeep) {
            checkbox.checked = false;
        }
    });

    filterMember = false;
    filterDateCreation = false;
    filterDateFirstAlbum = false;
    filterLocation = false;
}

var checkboxes = document.querySelectorAll('.toggle');

checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            disableOtherCheckboxes(this);
        }
    });
});

function toggleFiltre(filterType) {
    if (filterType === 'member') {
        filterMember = !filterMember;
    } else if (filterType === 'dateCreation') {
        filterDateCreation = !filterDateCreation;
    } else if (filterType === 'dateAlbum') {
        filterDateFirstAlbum = !filterDateFirstAlbum;
    } else if (filterType === 'location') {
        filterLocation = !filterLocation;
    }
}

document.getElementById('checkbox').addEventListener('change', function() {
    toggleFiltre('member');
});
var filterMember = false;

document.getElementById('checkbox2').addEventListener('change', function() {
    toggleFiltre('dateCreation');
});
var filterDateCreation = false;

document.getElementById('checkbox3').addEventListener('change', function() {
    toggleFiltre('dateAlbum');
});
var filterDateFirstAlbum = false;

document.getElementById('checkbox4').addEventListener('change', function() {
    toggleFiltre('location');
});
var filterLocation = false;

function filterArtists() {
    var search = document.querySelector('input').value.toLowerCase();

    var artists = document.querySelectorAll('.artists-list .artist-container');
    artists.forEach(function(artist) {
        if (filterMember==false && filterDateCreation==false && filterDateFirstAlbum==false){
            var nameArtist = artist.querySelector('h1').textContent.toLowerCase();
        } else if (filterMember==true) {
            var nameArtist = artist.querySelector('p1').textContent.toLowerCase();
        } else if (filterDateCreation==true) {
            var nameArtist = artist.querySelector('p3').textContent.toLowerCase();
        } else if (filterDateFirstAlbum==true) {
            var nameArtist = artist.querySelector('p5').textContent.toLowerCase();
        } else if (filterLocation==true) {
            var nameArtist = artist.querySelector('p6').textContent.toLowerCase();
        }

        if (nameArtist.indexOf(search) === -1) {
            artist.classList.add('filtered');
        } else {
            artist.classList.remove('filtered');
        }
    });
}

const searchContainerEl = document.querySelector(".search-container");
const closeBtn = document.querySelector(".fa-times");

searchContainerEl.addEventListener("click", () => {
  searchContainerEl.classList.add("active");
});

closeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    searchContainerEl.classList.remove("active");
    search = document.querySelector('input').value = "";
    filterArtists();
});

document.querySelector('input').addEventListener('input', filterArtists);

function focusOnSearchBar() {
    const urlParams = new URLSearchParams(window.location.search);
    const focusParam = urlParams.get('focus');

    if (focusParam === 'true') {
        searchContainerEl.classList.add("active");
        document.querySelector('input').focus(); 
    }
}

const lettersAlphabet = document.querySelectorAll('.searchAlphabet span');

lettersAlphabet.forEach(letter => {
    letter.addEventListener('click', () => {
        const letterSelect = letter.textContent;
        if (letterSelect === "#") {
            displayAllArtistes();
        } else {
            filterByLetter(letterSelect);
        }
    });
});

function displayAllArtistes() {
    var artists = document.querySelectorAll('.artists-list .artist-container');
    artists.forEach(function(artist) {
        artist.classList.remove('filtered'); 
    });
}

function filterByLetter(letter) {
    var artists = document.querySelectorAll('.artists-list .artist-container');
    artists.forEach(function(artist) {
        var nameArtist = artist.querySelector('h1').textContent.toLowerCase();

        if (nameArtist.startsWith(letter.toLowerCase())) {
            artist.classList.remove('filtered');
        } else {
            artist.classList.add('filtered');
        }
    });
}

function FilterGrowDateCreation() {
    var artistsList = document.querySelector('.artists-list');
    var artistContainers = artistsList.querySelectorAll('.artist-container');

    var artistArray = Array.from(artistContainers);

    artistArray.sort(function(a, b) {
        var dateArtisteA = new Date(a.querySelector('p3').textContent);
        var dateArtisteB = new Date(b.querySelector('p3').textContent);
        return dateArtisteA - dateArtisteB;
    });

    artistsList.innerHTML = '';

    artistArray.forEach(function(artist) {
        artistsList.appendChild(artist);
    });
}

function FilterDownDateCreation() {
    var artistsList = document.querySelector('.artists-list');
    var artistContainers = artistsList.querySelectorAll('.artist-container');

    var artistArray = Array.from(artistContainers);

    artistArray.sort(function(a, b) {
        var dateArtisteA = new Date(a.querySelector('p3').textContent);
        var dateArtisteB = new Date(b.querySelector('p3').textContent);
        return dateArtisteB - dateArtisteA;
    });

    artistsList.innerHTML = '';

    artistArray.forEach(function(artist) {
        artistsList.appendChild(artist);
    });
}

function FilterAlphabet() {
    var artistsList = document.querySelector('.artists-list');
    var artistContainers = artistsList.querySelectorAll('.artist-container');

    var artistArray = Array.from(artistContainers);

    artistArray.sort(function(a, b) {
        var nameArtistA = a.querySelector('h1').textContent.toLowerCase();
        var nameArtistB = b.querySelector('h1').textContent.toLowerCase();
        return nameArtistA.localeCompare(nameArtistB);
    });

    artistsList.innerHTML = '';

    artistArray.forEach(function(artist) {
        artistsList.appendChild(artist);
    });
}

FilterAlphabet();

function FilterGrowDateFirstAlbum() {
    var artistsList = document.querySelector('.artists-list');
    var artistContainers = artistsList.querySelectorAll('.artist-container');

    var artistArray = Array.from(artistContainers);

    artistArray.sort(function(a, b) {
        var dateAlbumA = parseInt(a.querySelector('p4').textContent);
        var dateAlbumB = parseInt(b.querySelector('p4').textContent); 
        return dateAlbumA - dateAlbumB;
    });

    artistsList.innerHTML = '';

    artistArray.forEach(function(artist) {
        artistsList.appendChild(artist);
    });
}

function FilterDownDateFirstAlbum() {
    var artistsList = document.querySelector('.artists-list');
    var artistContainers = artistsList.querySelectorAll('.artist-container');

    var artistArray = Array.from(artistContainers);

    artistArray.sort(function(a, b) {
        var dateAlbumA = parseInt(a.querySelector('p4').textContent);
        var dateAlbumB = parseInt(b.querySelector('p4').textContent); 
        return dateAlbumB - dateAlbumA;
    });

    artistsList.innerHTML = '';

    artistArray.forEach(function(artist) {
        artistsList.appendChild(artist);
    });
}

function filterMemberNumber() {
    var artistsList = document.querySelector('.artists-list');
    var artistContainers = artistsList.querySelectorAll('.artist-container');

    var artistArray = Array.from(artistContainers);

    artistArray.sort(function(a, b) {
        var nombreMembresA = parseInt(a.querySelector('p2').textContent);
        var nombreMembresB = parseInt(b.querySelector('p2').textContent);
        return nombreMembresA - nombreMembresB;
    });

    artistsList.innerHTML = '';

    artistArray.forEach(function(artist) {
        artistsList.appendChild(artist);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('Order-select').addEventListener('change', function() {
        var selectedValue = this.value;
        switch (selectedValue) {
            case 'displayAlphabet':
                FilterAlphabet();
                break;
            case 'displayDownDateCreation':
                FilterDownDateCreation();
                break;
            case 'displayGrowDateCreation':
                FilterGrowDateCreation();
                break;
            case 'displayDownDateAlbum':
                FilterDownDateFirstAlbum();
                break;
            case 'displayGrowDateAlbum':
                FilterGrowDateFirstAlbum();
                break;
            case 'displayMemberNumber':
                filterMemberNumber();
                break;
            default:
                break;
        }
    });
});
