let playlist = [];
let files = [];

window.HELP_IMPROVE_VIDEOJS = false;

window.onresize = () => {
    resizeVideoContainer();
};

//setup the player
var player = videojs('my-player', {
    controls: true,
    preload: 'auto',
    playbackRates: [1, 1.25, 1.5, 1.75],
});

player.ready(function () {
    // hotkey options (hotkeys plugin)
    this.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableVolumeScroll: false,
        enableModifiersForNumbers: false,
    });
    //resize video container
    resizeVideoContainer();
    if (window.myAPI) {
        let droppedFiles = [...window.myAPI.data];
        droppedFiles.shift();

        createPlaylist(droppedFiles, playlist);

        this.playlist(playlist);

        //play first video on playlist
        this.playlist.autoadvance(1);
        this.play();
        // empty previous playlist
    }
});

//create custom button => nextBtn
var button = videojs.getComponent('Button');
var nextBtn = new button(player, {
    clickHandler: function (event) {
        player.playlist.next();
        player.play();
    },
});
var playlsitToggleBtn = new button(player, {
    clickHandler: function (event) {
        //some actions
        $('.playlist-container')[0].classList.toggle('d-none');
        resizeVideoContainer();
    },
});

// adding buttons to player
player.controlBar.addChild(nextBtn, {}, 1);
player.controlBar.addChild(playlsitToggleBtn, {});

// adding icons to the buttons
nextBtn.$('.vjs-icon-placeholder').classList.add('vjs-icon-next-item');
playlsitToggleBtn.$('.vjs-icon-placeholder').classList.add('vjs-icon-chapters');

// on switching to a new content source within a playlist
player.on('playlistitem', function () {
    //clicking the playlist item to make it active (bootstrap active tab-item)
    $('#' + player.playlist.currentIndex())[0].click();
});

// ondrop function for native desktop drag and drop
function drop(event) {
    event.stopPropagation();
    event.preventDefault();
    // getting files
    let fileObjects = [...event.dataTransfer.files];

    // converting fileList to array to sort by object name
    fileObjects.forEach((element) => {
        files.push(element.path);
    });

    createPlaylist(files, playlist);

    player.playlist(playlist);
    //play first video on playlist
    player.playlist.autoadvance(1);
    player.play();
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

function fileNameFromPath(path) {
    let lastSlashIndex = path.lastIndexOf('\\') + 1;
    return path.slice(lastSlashIndex, path.length);
}

function createPlaylist(filePathArray, playlist) {
    //natural sorting
    filePathArray.sort((a, b) =>
        a.localeCompare(b, navigator.languages[0] || navigator.language, {
            numeric: true,
            ignorePunctuation: true,
        })
    );

    //clearing playlist in DOM
    $('#playlist').empty();

    filePathArray.forEach((element, i) => {
        //adding videos to playlist
        playlist.push({
            sources: [
                {
                    src: element,
                    type: 'video/mp4',
                    name: fileNameFromPath(element),
                    // id: index,
                },
            ],
        });

        //creating playlist-item and adding to the playlist in DOM
        var playlist_item = $('#playlist-header> div ')[0].cloneNode(true);
        playlist_item.classList.remove('active');
        playlist_item.classList.add('d-flex');
        playlist_item.id = i;
        playlist_item.name = fileNameFromPath(element);
        playlist_item.innerHTML = fileNameFromPath(element);
        $('#playlist')[0].appendChild(playlist_item);
    });

    $('#playlist> div')[0].classList.add('active');
    $('#playlist-header> div ')[0].classList.add('active');
}
