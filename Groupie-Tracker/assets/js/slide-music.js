document.addEventListener('DOMContentLoaded', function () {
    var audio = new Audio();
    var currentAudioURL = '';

    var artistURLs = {
     "Queen": "https://cdns-preview-1.dzcdn.net/stream/c-17597947a0fdd6e8ea971f146755cd34-13.mp3",
     "SOJA": "https://cdns-preview-b.dzcdn.net/stream/c-b4d1883a79096f4e5c73870af0b30861-4.mp3",
     "Pink Floyd": "https://cdns-preview-a.dzcdn.net/stream/c-a1a592f0d70f7e944b088f0070be9342-4.mp3",
     "Scorpions": "https://cdns-preview-3.dzcdn.net/stream/c-38fc0c44aa0880cf58163dce12a2a5b4-9.mp3",
     "XXXTentacion": "https://cdns-preview-f.dzcdn.net/stream/c-f3261b9791943a1c7387779fb4c36292-7.mp3",
     "Mac Miller": "https://cdns-preview-e.dzcdn.net/stream/c-ee17b8173a136ae0f5469b6a3d522dbe-3.mp3",
     "Joyner Lucas": "https://cdns-preview-1.dzcdn.net/stream/c-146df1f99776b41d773eb8c1bccd52bf-4.mp3",
     "Kendrick Lamar": "https://cdns-preview-d.dzcdn.net/stream/c-df72f6c1e55884dd25961fa3195c2f1f-7.mp3",
     "ACDC": "https://cdns-preview-c.dzcdn.net/stream/c-c9dcc5dffa3210c0a7dd4d7c37f84540-3.mp3",
     "Pearl Jam": "https://cdns-preview-d.dzcdn.net/stream/c-d16f560566e73a6e07bce96bd3c70090-6.mp3",
     "Katy Perry": "https://cdns-preview-2.dzcdn.net/stream/c-26d073cd8e482b92c18caa4918461de1-7.mp3",
     "Rihanna": "https://cdns-preview-5.dzcdn.net/stream/c-5581559e0c31b7f329ded7814d50ed52-6.mp3",
     "Genesis": "https://cdns-preview-1.dzcdn.net/stream/c-10f96180c2d5dc895b3d6ed148ae01c0-9.mp3",
     "Phil Collins": "https://cdns-preview-2.dzcdn.net/stream/c-2506e0bbca0e2237f44f41a6199bd1e8-6.mp3",
     "Led Zeppelin": "https://cdns-preview-0.dzcdn.net/stream/c-00bd440c9ec8b85f26d638febfda5e7c-6.mp3",
     "The Jimi Hendrix Experience": "https://cdns-preview-5.dzcdn.net/stream/c-5b551b867b1b2884e1d67ea487696382-4.mp3",
     "Bee Gees": "https://cdns-preview-e.dzcdn.net/stream/c-e3c0a3ed11bc8c6bb83da45dd8c3724f-8.mp3",
     "Deep Purple": "https://cdns-preview-5.dzcdn.net/stream/c-5e20de4ba78f9344ee72fcde6d45755c-5.mp3",
     "Aerosmith": "https://cdns-preview-0.dzcdn.net/stream/c-0a15bf74a86c2d1cd7aeda7285bdc844-4.mp3",
     "Dire Straits": "https://cdns-preview-1.dzcdn.net/stream/c-117fa7060e248dc8080ba2040db7d527-7.mp3",
     "Mamonas Assassinas": "https://cdns-preview-6.dzcdn.net/stream/c-68d3f95b019bedcbbac8c05b80c012fe-6.mp3",
     "Thirty Seconds to Mars": "https://cdns-preview-7.dzcdn.net/stream/c-787d0c1a3c41240aa5a347788a6960af-16.mp3",
     "Imagine Dragons": "https://cdns-preview-0.dzcdn.net/stream/c-0240787bdb9f62b6be064e9c3ef7fee6-6.mp3",
     "Juice Wrld": "https://cdns-preview-d.dzcdn.net/stream/c-d5a91f3cf9c2b399c9734223623a3c67-6.mp3",
     "Logic": "https://cdns-preview-3.dzcdn.net/stream/c-38ea65b1197a2981a139ffc23ea1285a-6.mp3",
     "Alec Benjamin": "https://cdns-preview-f.dzcdn.net/stream/c-fac34b0cefa663b53a312316a9af8c29-5.mp3",
     "Bobby McFerrins": "https://cdns-preview-b.dzcdn.net/stream/c-b31eb5bbcf97aca7a2c74b26ac669d1c-1.mp3",
     "R3HAB": "https://cdns-preview-7.dzcdn.net/stream/c-7c1c589686125dcd0682118f8b43ad26-3.mp3",
     "Post Malone": "https://cdns-preview-d.dzcdn.net/stream/c-d585a571fbe901975314532f05452367-5.mp3",
     "Travis Scott": "https://cdns-preview-d.dzcdn.net/stream/c-d9665c1cba1e786ba5f2ffe6611f12e4-4.mp3",
     "J. Cole": "https://cdns-preview-f.dzcdn.net/stream/c-f29c6c8e9ba389091119d4540c5e4c00-4.mp3",
     "Nickelback": "https://cdns-preview-5.dzcdn.net/stream/c-5cb349da32ae1b85b840316468b46d3f-5.mp3",
     "Mobb Deep": "https://cdns-preview-8.dzcdn.net/stream/c-81b4bfa521543267184c3b4076424b59-7.mp3",
     "Guns N' Roses": "https://cdns-preview-9.dzcdn.net/stream/c-9655c46e463961b93d8f9733de00b0d2-6.mp3",
     "NWA": "https://cdns-preview-7.dzcdn.net/stream/c-7e8c2c13d35d41a5dc59b752a998cf71-3.mp3",
     "U2": "https://cdns-preview-b.dzcdn.net/stream/c-b326f0ee611077f4986866b1bdad697b-6.mp3",
     "Arctic Monkeys": "https://cdns-preview-a.dzcdn.net/stream/c-a1a6bfb26c3ba1b14020b1f6873d1677-7.mp3",
     "Fall Out Boy": "https://cdns-preview-e.dzcdn.net/stream/c-edc9ee527b8e449038b5ba034761b7c3-8.mp3",
     "Gorillaz": "https://cdns-preview-8.dzcdn.net/stream/c-88e048997f12d2e0ee67589307270507-8.mp3",
     "Eagles": "https://cdns-preview-8.dzcdn.net/stream/c-8af9cfb9a0454481e21989618e7c5779-4.mp3",
     "Linkin Park": "https://cdns-preview-1.dzcdn.net/stream/c-179888dacdd6a28871ead1caebf86c79-8.mp3",
     "Red Hot Chili Peppers": "https://cdns-preview-c.dzcdn.net/stream/c-cc72b44cdc562435438c87d94188faa6-15.mp3",
     "Eminem": "https://cdns-preview-c.dzcdn.net/stream/c-cca63b2c92773d54e61c5b4d17695bd2-8.mp3",
     "Green Day": "https://cdns-preview-8.dzcdn.net/stream/c-8518dd3ae3f2c754a4e285546e28f697-10.mp3",
     "Metallica": "https://cdns-preview-b.dzcdn.net/stream/c-bd4c3e7cd1a7ed330ffe5e212af5815e-6.mp3",
     "Coldplay": "https://cdns-preview-b.dzcdn.net/stream/c-b2a9b8a5b6dd033ce39a76a7f628bb54-3.mp3",
     "Maroon 5": "https://cdns-preview-4.dzcdn.net/stream/c-4cf54e97675b92dcfbaaee8cfaa840c8-16.mp3",
     "Twenty One Pilots": "https://cdns-preview-b.dzcdn.net/stream/c-be897cd6f8f1c730f02fa9b5a11f6bb6-7.mp3",
     "The Rolling Stones": "https://cdns-preview-5.dzcdn.net/stream/c-53f85fa7f1f17d8bca2b4cab502abb06-5.mp3",
     "Muse": "https://cdns-preview-5.dzcdn.net/stream/c-542bc143639afd52397bb7e84cb16cee-7.mp3",
     "Foo Fighters": "https://cdns-preview-9.dzcdn.net/stream/c-921fd44bf4a984c333e7caa7b8f7ee7d-5.mp3",
     "The Chainsmokers": "https://cdns-preview-c.dzcdn.net/stream/c-c7f32280916bc10e989ca5f4ed3b8afb-7.mp3",
    };

    function playMusic() {
        var slide = document.querySelector('.slide');
        var artistName = slide.querySelector('p').textContent.trim();
        var deezerURL = artistURLs[artistName];
        if (deezerURL) {
            if (audio) {
              audio.src = deezerURL;
              audio.play();
            }
        }
    }

    function pauseMusic() {
        var slide = document.querySelector('.slide');
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
    }

    var playButton = document.querySelector('.play-btn');

    playButton.addEventListener('mouseover', function () {
        playMusic();
    });
  
    playButton.addEventListener('mouseout', function () {
        pauseMusic();
    });

});