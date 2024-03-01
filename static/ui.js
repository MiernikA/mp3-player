const option_list = []



async function getFileList(file) {
    try {
        const response = await fetch('/getFiles?folder=' + file)
        const data = await response.json()
        return data
    }

    catch (error) {
        console.error('Error fetching files:', error)
    }
}


function setupHeader() {

    const result = document.createElement("div")

    result.classList.add("header")

    const album_header = document.createElement("div")
    album_header.classList.add("album-header")
    album_header.textContent = "ALBUMS AVAILABLE"

    const song_header = document.createElement("div")
    song_header.classList.add("song-header")
    song_header.textContent = "SONGS"

    result.appendChild(album_header)
    result.appendChild(song_header)

    return result

}

function setupSideBar() {

    const result = document.createElement("div")
    result.classList.add("list-group")
    result.classList.add("album-list")

    return result
}

function setupPlaybar() {

    const result = document.createElement("div")
    result.classList.add("play-bar")

    return result
}



async function buildSite() {


    const file_list = await getFileList("mp3")
    const album_list = file_list.files

    const header = setupHeader()
    const sidebar = setupSideBar()
    const playbar = setupPlaybar()

    const container = document.createElement("div")
    container.classList.add("container")

    const audioPlayer = document.createElement("audio");
    audioPlayer.style.display = "none"


    album_list.forEach(async element => {

        const album_element = document.createElement("div")
        const songs = await getFileList("mp3/" + element);

        const title = document.createElement("p")
        const title_to_print = element.replace("-", '<br/>');
        const cover = document.createElement("img")


        album_element.classList.add("list-group-item")
        album_element.classList.add("list-group-item-action")
        title.classList.add("title")
        cover.classList.add("album-cover")


        cover.src = "/static/mp3/" + element + "/front.jpg"
        title.innerHTML = title_to_print



        album_element.onclick = function () {
            let tmp = document.getElementsByClassName('play-bar')[0]

            while (tmp.firstChild) {
                tmp.removeChild(tmp.firstChild);
            }

            isPlaying = true
            let controls = document.getElementsByClassName('controls')

            if (controls.length > 0) {
                controls[1].src = "/static/img/play_bt.png"
                isPlaying = false
            }
            container.textContent = ""

            const timer = document.createElement("p")

            playbar.appendChild(timer)
            audioPlayer.pause()

            const all_albums = document.getElementsByClassName("list-group-item")
            const all_albums_array = Array.from(all_albums)

            all_albums_array.forEach(alb => {
                alb.classList.remove("currently-playing")
            })

            album_element.classList.add('currently-playing');



            songs.files.forEach(song_name => {

                if (song_name.includes(".mp3")) {

                    const option_holder = document.createElement("div")
                    option_holder.classList.add("option_holder")
                    const song_name_to_print = song_name.replace(/\.mp3$/, '');
                    const option = document.createElement("a")

                    option.href = "/static/mp3/" + element + "/" + song_name
                    option.textContent = song_name_to_print
                    const play_mini = document.createElement("img")
                    play_mini.src = "/static/img/playmini.png"
                    play_mini.classList.add("mini")

                    option.classList.add("option_link")

                    option_holder.appendChild(play_mini)
                    option_holder.appendChild(option)
                    option_list.push(option_holder)
                    option_holder.onclick = function (event) {


                        option_list.forEach(element => {
                            element.children[0].src = "/static/img/playmini.png"
                            element.children[1].classList.remove('currently-playing-song')
                        })

                        option.classList.add('currently-playing-song');
                        play_mini.src = "/static/img/miniplaying.png"
                        event.preventDefault();
                        audioPlayer.src = option.href;
                        audioPlayer.play();
                        isPlaying = true
                        playBarSetUp(audioPlayer, songs.files, "/static/mp3/" + element + "/", song_name)
                    };

                    option_holder.classList.add("fade-in");
                    container.appendChild(option_holder)

                }

            });




        }
        album_element.appendChild(cover)
        album_element.appendChild(title)
        sidebar.appendChild(album_element)
    });

    document.body.appendChild(playbar)
    document.body.appendChild(header)
    document.body.appendChild(sidebar)
    document.body.appendChild(container)
    document.body.appendChild(audioPlayer)
}
