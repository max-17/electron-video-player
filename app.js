let playlist = [];
// let url =
//     'http://localhost:8080/django part 2/2-BBuilding RESTful APIs with Django REST Framework/';

window.HELP_IMPROVE_VIDEOJS = false;

//setup the player
var player = videojs('my-player', {
    controls: true,
    preload: 'auto',
    aspectRatio: '16:9',
    fluid: true,
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

// ondrop function
let files;
function drop(event) {
    event.stopPropagation();
    event.preventDefault();
    files = event.dataTransfer.files;

    // converting fileList to array to sort by object name
    files = Array.from(files).sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );

    //adding videos to playlist
    files.forEach((element) => {
        playlist.push({
            sources: [
                {
                    src: element.path,
                    type: 'video/mp4',
                    name: element.name,
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

// function playVideo(name) {
//     if (name != '') {
//         player.src(url + name);
//         player.play();
//     }
// }

function play(id) {
    if (id != '') {
        player.playlist.currentItem(parseInt(id));
        player.play();
    }
}
