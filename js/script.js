let states = {
    'INIT_BEFORE_MAP_LOADED': {
        count: 0,
        done: 0
    },
    'MAP': {
        count: 0,
        done: 0
    },
    'INIT_AFTER_MAP_LOADED': {
        count: 0,
        done: 0
    },
    'INIT_SESSION': {
        count: 0,
        done: 0
    }
};
let last = 0;

window.addEventListener('message', (e) => ({
    startInitFunctionOrder: (data) => {
        if (data.type == 'INIT_SESSION' && states['INIT_BEFORE_MAP_LOADED'].count < 1) {
            states['INIT_BEFORE_MAP_LOADED'].count = 1;
            states['INIT_BEFORE_MAP_LOADED'].done = 1;
            states['MAP'].count = 1;
            states['MAP'].done = 1;
            states['INIT_AFTER_MAP_LOADED'].count = 1;
            states['INIT_AFTER_MAP_LOADED'].done = 1;
        }

        states[data.type].count += data.count;
    },
    initFunctionInvoked: (data) => states[data.type].done++,
    startDataFileEntries: (data) => states['MAP'].count = data.count,
    performMapLoadFunction: (data) => states['MAP'].done++
}[e.data.eventName] || (() => { }))(e.data));

setInterval(() => {
    let progress = 0;
    for (let type in states) {
        if (states[type].done < 1 || states[type].count < 1) continue;
        progress += (states[type].done / states[type].count) * 100;
    }

    let total = Math.min(Math.round(progress / Object.keys(states).length), 100);
    if (total < last) total = last;
    last = total;

    const fillLogo = $('.filled-logo');
    fillLogo.css('clip-path', `polygon(0 100%, 100% 100%, 100% ${100 - total}%, 0 ${100 - total}%)`);
    $('.loadbar .bar').css('width', `${total}%`);
}, 100);

let audio = $('audio')[0]
let currentIndex = 0;

$(function () {
    const content = $('.overlay');
    const BGContainer = $('#bg-container')
    let player;

    audio.volume = Config.Sounds.Volume / 100

    $('.volume-bar').val(Config.Sounds.Volume);
    $('.volume-bar').css('background', `linear-gradient(to right, var(--themeColor) ${Config.Sounds.Volume}%, rgba(255, 255, 255, .2) ${Config.Sounds.Volume}%)`);

    $(".logo").attr("src", Config.Options.Logo)
    $(".server-name").text(Config.Options.SeverName)
    $(".filled-logo").attr("src", Config.Options.Logo)

    $(':root').css({
        '--themeColor': Config.Options.ThemeColor,
        '--FontColor': Config.Options.TextColor,
    });

    switch (Config.BG.Type) {
        case 'BG':
            let currentImgIndex = 1;
            if (Config.BG.IMGs.length === 1) {
                BGContainer.css({
                    background: `url(${Config.BG.IMGs[0]}) no-repeat center`,
                    backgroundSize: `cover`,
                }).addClass("bg-img");
            } else {
                BGContainer.css({
                    background: `url(${Config.BG.IMGs[0]}) no-repeat center`,
                    backgroundSize: `cover`,
                }).addClass("bg-img");

                setInterval(() => {
                    const IMG = Config.BG.IMGs[currentImgIndex];
                    BGContainer.css({
                        background: `url(${IMG}) no-repeat center`,
                        backgroundSize: `cover`,
                    }).addClass("bg-img");
                    currentImgIndex = (currentImgIndex + 1) % Config.BG.IMGs.length;
                }, Config.BG.ChangeImgAfter);
            }
            break;
        case 'Video':
            BGContainer.html(`
                <video autoplay muted loop class="bgVideo">
                    <source src="${Config.BG.Link}" type="video/mp4">
                </video>
            `);
            break;
        case 'YT':
            player = new YT.Player('bg-container', {
                videoId: Config.BG.VideoID,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 0,
                    loop: 1,
                    fs: 0,
                    cc_load_policy: 0,
                    iv_load_policy: 3,
                    autohide: 0,
                    rel: 0,
                    mute: 1
                },
                events: {
                    onReady: function (e) {
                        e.target.setVolume(5);
                    }
                }
            });
    }

    if (Config.Options.Tips.enable) {
        const LoadContainer = $('.tips');
        let currentTipIndex = 0;

        setInterval(function () {
            const tip = Config.Options.Tips.Tips[currentTipIndex];
            LoadContainer.empty();

            gsap.to(LoadContainer, {
                duration: .5,
                text: tip,
                ease: "none",
            });
            currentTipIndex = (currentTipIndex + 1) % Config.Options.Tips.Tips.length;
        }, Config.Options.Tips.ChangeTipAfter);
    }


    for (const accKey in Config.Options.Accounts) {
        const acc = Config.Options.Accounts[accKey];
        const AccLink = $("<a>").attr({
            href: acc.link,
            target: "_blank"
        }).addClass("acc").html(`
                <i class="${acc.icon}"></i>
            `);
        $(".accounts").append(AccLink)
    }

    $(document).keyup(function (e) {
        if (e.key === 'F1') {
            if (content.css("backdrop-filter") == "none") {
                content.css({
                    'backdrop-filter': "blur(10px)",
                });
                content.children().show()
            } else {
                content.css({
                    'backdrop-filter': "none",
                });
                content.children().hide()
            }
        } else if (e.key === 'F2') {
            if (Config.BG.Type === 'Video') {
                const videoElement = $('.bgVideo')[0];
                if (videoElement.paused) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            } else if (Config.BG.Type === 'YT' && player) {
                if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                    player.pauseVideo();
                } else if (player.getPlayerState() === YT.PlayerState.PAUSED) {
                    player.playVideo();
                }
            }
        }
    });

    $(".music-player").click(function (e) {
        e.preventDefault();
        $(".music-player").toggleClass('opened');
        if ($(".music-player").hasClass('opened')) {
            $(".fa-music").hide();
            $(".music-content").show();
        } else {
            $(".fa-music").show();
            $(".music-content").hide();
        }
    });


    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function updatePlayer() {
        const currentSong = Config.Sounds.AlbumSongs[currentIndex];
        $('.music-title').text(currentSong.name);
        $(".audio-src").attr("src", currentSong.src);
        audio.load();
    }

    setInterval(() => {
        $('.music-length').val(audio.currentTime / audio.duration * 100);

        const currentTime = formatTime(audio.currentTime);
        const duration = formatTime(audio.duration);

        $('.current-time').text(currentTime);
        $('.song-duration').text(duration);

        $(".music-length").css('background', `linear-gradient(to right, var(--themeColor) ${audio.currentTime / audio.duration * 100}%, rgba(255, 255, 255, .2) ${audio.currentTime / audio.duration * 100}%)`);
    }, 1000);


    $('.fa-play-pause').click(function () {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });


    $('.fa-forward-step').click(function () {
        currentIndex = (currentIndex + 1) % Config.Sounds.AlbumSongs.length;
        console.log('Next button clicked. New currentIndex:', currentIndex);
        updatePlayer();
        audio.play();
    });

    $('.fa-backward-step').click(function () {
        currentIndex = (currentIndex - 1 + Config.Sounds.AlbumSongs.length) % Config.Sounds.AlbumSongs.length;
        console.log('Previous button clicked. New currentIndex:', currentIndex);
        updatePlayer();
        audio.play();
    });

    audio.addEventListener('ended', function () {
        currentIndex = (currentIndex + 1) % Config.Sounds.AlbumSongs.length;
        updatePlayer();
        audio.play();
    });

    $('.music-length').on('input', function () {
        $(this).css('background', `linear-gradient(to right, var(--themeColor) ${$(this).val()}%, rgba(255, 255, 255, .2) ${$(this).val()}%)`);
        const seekTime = (audio.duration * ($(this).val() / 100));
        audio.currentTime = seekTime;
        audio.play();
    });

    $('.volume-bar').on('input', function () {
        $(this).css('background', `linear-gradient(to right, var(--themeColor) ${$(this).val()}%, rgba(255, 255, 255, .2) ${$(this).val()}%)`);
        audio.volume = $(this).val() / 100
    });

    $('.toggle-sidebar').click(function () {
        if ($('.sidebar-content').css("left") === "0px") {
            $('.sidebar-content').css({
                left: "-100%"
            });
            $('.toggle-sidebar').css({
                left: "15px"
            });
        } else {
            $('.toggle-sidebar').css({
                left: "26%"
            });
            $('.sidebar-content').css({
                left: "0"
            });
        }
    });

    if (Config.Options.ChangeLog.enable) {
        $('.sidebar').css("display", "block")
        for (const changelog of Config.Options.ChangeLog.New) {
            const log = $("<li>").html(`<span class="new">[NEW]</span> - ${changelog}`)
            $('.changelog-list').append(log)
        }

        for (const changelog of Config.Options.ChangeLog.Removed) {
            const log = $("<li>").html(`<span class="remove">[REMOVED]</span> - ${changelog}`)
            $('.changelog-list').append(log)
        }
        
        for (const changelog of Config.Options.ChangeLog.UpComing) {
            const log = $("<li>").html(`<span class="upcoming">[UPCOMING]</span> - ${changelog}`)
            $('.changelog-list').append(log)
        }
    }

    if (Config.BG.Sparks.enable) {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": Config.BG.Sparks.Density,
                },
                "color": {
                    "value": Config.BG.Sparks.Color
                },
                "opacity": {
                    "random": true,
                },
                "size": {
                    "value": 1.5,
                },
                "line_linked": {
                    "enable": false,
                },
                "move": {
                    "enable": true,
                    "speed": 7,
                    "direction": Config.BG.Sparks.Direction,
                }
            },
            "interactivity": {
                "events": {
                    "onhover": {
                        "enable": false,
                    },
                }
            },
        })
    }

    updatePlayer()
});