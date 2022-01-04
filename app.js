let playlist = [];
let files;

window.HELP_IMPROVE_VIDEOJS = false;

//setup the player
var player = videojs('my-player', {
    controls: true,
    preload: 'auto',
    playbackRates: [1, 1.25, 1.5, 1.75],
});

// hotkey options (hotkeys plugin)
player.ready(function () {
    this.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableVolumeScroll: false,
        enableModifiersForNumbers: false,
    });
    //resize video container
    resizeVideoContainer();
});

//create custom button => nextButton
var button = videojs.getComponent('Button');
var nextButton = new button(player, {
    clickHandler: function (event) {
        player.playlist.next();
        player.play();
    },
});

nextButton.addClass('vjs-icon-next-item');

// add button to player
player.controlBar.addChild(nextButton, {}, 1);

// on switching to a new content source within a playlist
player.on('playlistitem', function () {
    //clicking the playlist item to make it active (bootstrap active tab-item)
    $('#' + player.playlist.currentIndex())[0].click();
});

window.onresize = () => {
    resizeVideoContainer();
};

// ondrop function
function drop(event) {
    event.stopPropagation();
    event.preventDefault();
    files = event.dataTransfer.files;

    // converting fileList to array to sort by object name
    files = Array.from(files).sort((a, b) =>
        a.name.localeCompare(b.name, navigator.languages[0] || navigator.language, {
            numeric: true,
            ignorePunctuation: true,
        })
    );
    //adding videos to playlist
    files.forEach((element, index) => {
        playlist.push({
            sources: [
                {
                    src: element.path,
                    type: 'video/mp4',
                    name: element.name,
                    // id: index,
                },
            ],
        });
    });
    player.playlist(playlist);

    //play first video on playlist
    player.playlist.autoadvance(1);
    player.play();
    // empty previous playlist
    $('#playlist').empty();

    for (var i = 0; i < files.length; i++) {
        //creating playlist-item and adding to the playlist
        var playlist_item = $('#playlist-header> div ')[0].cloneNode(true);
        playlist_item.classList.remove('active');
        playlist_item.classList.add('d-flex');
        playlist_item.id = i;
        playlist_item.name = files[i].name;
        playlist_item.innerHTML = files[i].name;
        $('#playlist')[0].appendChild(playlist_item);
    }
    $('#playlist> div')[0].classList.add('active');
    $('#playlist-header> div ')[0].classList.add('active');
}

function resizeVideoContainer() {
    let videoContainer = $('#video-container')[0];
    const aspectRatio = 16 / 9;

    if (videoContainer.offsetWidth / videoContainer.offsetHeight < aspectRatio) {
        videoContainer.style.height = parseInt(videoContainer.offsetWidth / aspectRatio) + 'px';
    }
    //line break
    else if (videoContainer.offsetWidth / videoContainer.offsetHeight > aspectRatio) {
        videoContainer.style.height =
            parseInt(videoContainer.offsetWidth / aspectRatio) <= window.innerHeight //if it fits the window
                ? parseInt(videoContainer.offsetWidth / aspectRatio) + 'px' // set video container height according to aspect ratio
                : window.innerHeight + 'px'; //otherwise set it to window heght
    }
}

function play(id) {
    if (id != '') {
        player.playlist.currentItem(parseInt(id));
        player.play();
    }
}
