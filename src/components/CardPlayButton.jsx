import { Pause, Play } from "./Player"
import { usePlayerStore } from '../store/playerStore'


export function CardPlayButton({ id, size = 'small', display }) {
    const {
        currentMusic,
        isPlaying,
        setIsPlaying,
        setCurrentMusic
    } = usePlayerStore(state => state)

    const isPlayingPlaylist = isPlaying && currentMusic?.playlist.id === id

    const handleClick = () => {
        if (isPlayingPlaylist) {
            setIsPlaying(false)
            return
        }

        fetch(`/api/get-info-playlist.json?id=${id}`)
            .then(res => res.json())
            .then(data => {
                const { songs, playlist } = data

                setIsPlaying(true)
                setCurrentMusic({ songs, playlist, song: songs[0] })
            })
    }

    const iconClassName = size === 'small' ? 'w-3 h-3' : 'w-5 h-5'

    const displayType = display


    return (
        <button onClick={handleClick} className={`md:flex card-play-button rounded-full bg-green-500 p-2 hover:scale-105 transition hover:bg-green-400 ${displayType}`}>
            {isPlayingPlaylist ? <Pause className={iconClassName} /> : <Play className={iconClassName} />}
        </button>
    )
}