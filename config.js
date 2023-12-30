const Config = {
    Options: {
        Logo: "assests/media/logo.png", // Server logo path or link
        SeverName: "TopX Roleplay", // Server name
        ThemeColor: "#800020", // Theme color
        TextColor: "#fff", // Font color
        Tips: {
            enable: true,
            Tips: ["Welcome To TopX City", "This is TopXLoadingScreen"],
            ChangeTipAfter: 3000 // In MS
        },
        Accounts: [
            {
                icon: "fa-brands fa-github", // https://fontawesome.com/icons
                link: "https://github.com/TopXDevTeam/" // link or #
            },
            {
                icon: "fa-brands fa-discord", // https://fontawesome.com/icons
                link: "https://discord.gg/vuJQnbEMyu" // link or #
            },
            {
                icon: "fa fa-laptop-code", // https://fontawesome.com/icons
                link: "https://forum.cfx.re/u/topxdevelopment/summary/" // link or #
            }
        ],
        ChangeLog: {
            enable: true,
            New: [
                "new loading screen by topx",
                "new killfeed by topx",
            ],
            Removed: [
                "old hud",
                "old vehicle shop"
            ],
            UpComing: [
                "admin menu by topx",
                "vip menu by topx"
            ]
        }
    },
    BG: {
        Type: "Video", // BG | Video | YT,
        IMGs: ["assests/BG/BG1.png", "assests/BG/BG2.jpg", "assests/BG/BG3.jpg", "assests/BG/BG4.jpg"], // If Type = BG insert imgs paths or link
        Link: "assests/BG/Video.mp4", // If Type = Video insert Video path or link 
        VideoID: "5P7i9jV9jew", // if Type = YT insert Video id
        ChangeImgAfter: 3000, // In MS
        Sparks: { // Small sparks floating
            enable: true,
            Density: 250, // Number of sparks
            Color: "#ff0000", // Color of sparks
            Direction: "top" // top | bottom | left | right | none
        }
    },
    Sounds: {
        Volume: 50, // 0 - 100
        AlbumSongs: [
            {
                name: "Lil Nas X - Old Town Road", // Song Title
                src: "assests/media/song.mp3" // Song Path or link
            },
            {
                name: "QBCore Loading Screen", // Song Title
                src: "assests/media/song2.mp3" // Song Path or link
            },
            {
                name: "Rockroll", // Song Title
                src: "assests/media/song3.mp3" // Song Path or link
            }
        ],
    }
}