console.log("lets writing javascript")
let currentSong = new Audio()
let songs=[];
let currFolder;

function formatTime(seconds) {
    if (isNaN(seconds)) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${paddedMinutes}:${paddedSeconds}`;

}

function playNextSong() {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1].replaceAll("%20", " "));
    }
}

function openHamburgerMenu() {
    document.querySelector(".left").style.left = 0+"%";
}



async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`songs/${folder}/`)
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let sgul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    sgul.innerHTML=""
   
   
    for (const song of songs) {
        sgul.innerHTML = sgul.innerHTML+ `
            <li>
                <img src="music.svg">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                </div>
                <img src="p.svg">
            </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",()=> {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs


}
const playMusic = (track) => {
    console.log(track)
    currentSong.src = `songs/${currFolder}/` + track
    currentSong.play()
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}



async function main() {
    await getsongs("cs1")


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }

        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    currentSong.addEventListener("ended",()=>
    {
        playNextSong()
    }
    )

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime
            (currentSong.currentTime)

            }/ ${formatTime(currentSong.duration)}`

        document.querySelector(".circle").style.left =
            (currentSong.currentTime) / (currentSong.duration) * 100 + "%"
    })
    document.querySelector(".seek").addEventListener("click", e => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%"
        currentSong.currentTime = [currentSong.duration * (e.offsetX / e.target.getBoundingClientRect().width) * 100] / 100
    }
    )

    document.querySelector(".ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + "%"

    }
    )
   

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + "%"
    })

    nxt.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1].replaceAll("%20", " "));
        }
    });

    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1].replaceAll("%20", " "));
        }
    })
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
         await getsongs(`${item.currentTarget.dataset.folder}`)
         console.log(songs)
         playMusic(songs[0].replaceAll("%20"," "))

         openHamburgerMenu()
        // console.log(item.currentTarget.dataset.folder)
        
          
        }
        )

  







})

}

main()
