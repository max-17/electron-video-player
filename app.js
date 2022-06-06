let files = [];
let rate = 1;

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

player.ready(() => {
    // check if files were opened using 'open with...' option
    if (window.myAPI) {
        /*
        The process.argv property returns an array containing the command-line arguments
         passed when the Node.js process was launched. The first element will be process.execPath.
         The remaining elements will be any additional command-line arguments. (files' path)
        */
        let droppedFiles = [...window.myAPI.data];
        droppedFiles.shift();

        // creating playlist and adding it to player
        player.playlist(makePlaylist(droppedFiles));

        //play first video on playlist
        player.playlist.autoadvance(1);
        $('#playlist-header> div')[0].classList.add('active');
        $('#playlist> div ')[0].click();
    }
    // player.hotkeys() enables keyboard hotkeys when the player has focus.
    // setting hotkey options (hotkeys plugin)
    player.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableVolumeScroll: false,
        enableModifiersForNumbers: false,
    });
    //resize video container
    resizeVideoContainer();
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
    clickHandler: (event) => {
        //some actions
        $('.playlist-container')[0].classList.toggle('d-none');
        resizeVideoContainer();
    },
});

// adding icons to the buttons
nextBtn.$('.vjs-icon-placeholder').classList.add('vjs-icon-next-item');
playlsitToggleBtn.$('.vjs-icon-placeholder').classList.add('vjs-icon-chapters');

// adding buttons to player
player.controlBar.addChild(nextBtn, {}, 1);
player.controlBar.addChild(playlsitToggleBtn, {});

// saving rate when playbackrate changes
player.on('ratechange', () => {
    // console.log('ratechange event', player.playbackRate());
    rate = player.playbackRate();
});

// on switching to a new content source within a playlist
player.on('playlistitem', () => {
    //clicking the playlist item to make it active (bootstrap active tab-item)
    $('#' + player.playlist.currentIndex())[0].click();
    // setting playbackrate
    player.playbackRate(rate);
});

// ondrop function for native desktop drag and drop
function drop(event) {
    event.stopPropagation();
    event.preventDefault();
    let fileObjects = [...event.dataTransfer.files];

    // converting fileList to array to sort by object name
    files = fileObjects.map((element) => {
        return element.path;
    });

    // empty previous playlist
    $('#playlist').empty();
    // creating playlist and adding it to player
    player.playlist(makePlaylist(files));

    //play first video on playlist
    player.playlist.autoadvance(1);

    $('#playlist-header> div')[0].classList.add('active');
    $('#playlist> div')[0].click();
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
    let lastSlashIndex = path.lastIndexOf('\\');
    return path.slice(lastSlashIndex + 1, path.length);
}

function makePlaylist(filePathArray) {
    //clearing playlist
    let playList = [];
    $('#playlist').empty();

    //natural sorting
    filePathArray.sort((a, b) =>
        a.localeCompare(b, navigator.languages[0] || navigator.language, {
            numeric: true,
            ignorePunctuation: true,
        })
    );
    filePathArray.forEach((element, i) => {
        //adding videos to playlist
        playList.push({
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
        let playlist_item = $('#playlist-header> div ')[0].cloneNode(true);
        playlist_item.classList.remove('active');
        playlist_item.classList.add('d-flex');
        playlist_item.id = i;
        playlist_item.name = fileNameFromPath(element);
        playlist_item.innerHTML = fileNameFromPath(element);
        $('#playlist')[0].appendChild(playlist_item);
    });

    return playList;
}
