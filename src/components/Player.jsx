// import { usePlayerStore } from "@/store/playerStore"
// import { useEffect, useRef, useState } from "react"
// import { Slider } from "./Slider"

import { useEffect, useRef, useState } from "react"
import { usePlayerStore } from "../store/playerStore"
import { Slider } from "./Slider"

export const Pause = ({ className }) => (
    <svg className={`${className}`} role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
)

export const Play = ({ className }) => (
    <svg className={`${className} p-0`} role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
)

export const MaxVolume = () => (
    <svg data-encore-id="icon" role="presentation" aria-label="Volume high" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 kcUFwU h-4 w-4"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>
)
export const MediumVolume = () => (
    <svg data-encore-id="icon" role="presentation" aria-label="Volume medium" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 kcUFwU h-4 w-4"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"></path></svg>
)

export const MinVolume = () => (
    <svg fill="currentColor" data-encore-id="icon" role="presentation" aria-label="Volume low" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 kcUFwU h-4 w-4"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path></svg>
)

export const MutedVolume = () => (
    <svg data-encore-id="icon" role="presentation" aria-label="Volume off" aria-hidden="true" id="volume-icon" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 kcUFwU h-4 w-4"><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path></svg>
)

const CurrentSong = ({ image, title, artists }) => {


    const defaultImage = 'https://enablepublicdam.steelcase.com/Original/10005/6130_1000.jpg'
    return (
        <div
            className={`
          flex items-center gap-2 relative
          overflow-hidden
        `}>
            <picture className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-zinc-800 rounded-sm lg:rounded-md shadow-lg overflow-hidden">
                <img src={image ?? defaultImage} alt={title} className=" w-full h-full object-cover" />
            </picture>

            <div className="flex flex-col">
                <h3 className="font-semibold lg:text-sm block text-[8px] md:text-[10px] ">
                    {title}
                </h3>
                <span className="lg:text-xs opacity-80 text-[6px] md:text-[7px]">
                    {artists?.join(', ')}
                </span>
            </div>

        </div>

    )
}

const CurrentSongMobile = ({ image, title, artists }) => {


    const defaultImage = 'https://enablepublicdam.steelcase.com/Original/10005/6130_1000.jpg'
    return (
        <div
            className={`
          flex items-center gap-2 relative
          overflow-hidden w-full h-full
        `}>
            <picture className="w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-zinc-800 rounded-sm lg:rounded-md shadow-lg overflow-hidden">
                <img src={image ?? defaultImage} alt={title} className=" w-full h-full object-cover" />
            </picture>

            <div className="flex flex-col">
                <h3 className="font-bold truncate text-sm">
                    {title}
                </h3>
                <span className="text-xs text-zinc-400 truncate ">
                    {artists?.join(', ')}
                </span>
            </div>
        </div>

    )
}

function VolumeControl() {
    const { volume, setVolume } = usePlayerStore(state => state)
    const previousVolume = useRef(volume)

    const isMuted = volume === 0

    const handleMute = () => {
        if (isMuted) {
            setVolume(previousVolume.current)
        } else {
            previousVolume.current = volume
            setVolume(0)
        }
    }

    return (
        <div className="flex justify-center gap-x-4 items-center" >

            <button onClick={handleMute} className="h-4 w-4 opacity-70 hover:opacity-100">
                {volume === 0 && <MutedVolume />}
                {(volume > 0 && volume < 0.3) && <MinVolume />}
                {(volume >= 0.3 && volume < 0.6) && <MediumVolume />}
                {(volume >= 0.6 && volume <= 1) && <MaxVolume />}
            </button>
            <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                className="w-[95px]"
                value={[volume * 100]}
                onValueChange={(value) => {
                    const [newVolume] = value
                    const volumeValue = newVolume / 100
                    setVolume(volumeValue)

                }}
            />
        </div>
    )

}

function SongControl({ audio }) {
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        audio.current.addEventListener('timeupdate', handleTimeUpdate)
        return () => {
            audio.current.removeEventListener('timeupdate', handleTimeUpdate)
        }
    }, [])

    const handleTimeUpdate = () => {
        setCurrentTime(audio.current.currentTime)
    }

    const formatTime = (time) => {
        if (time == null) return `00:00`

        const seconds = Math.floor(time % 60)
        const minutes = Math.floor(time / 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`

    }
    const duration = audio?.current?.duration ?? 0
    return (
        <div className="flex gap-x-2 w-full justify-center items-center">
            <span className="lg:block hidden">{formatTime(currentTime)}</span>
            <Slider
                defaultValue={[0]}
                value={[currentTime]}
                max={audio?.current?.duration ?? 0}
                min={0}
                className="w-full lg:w-1/2 "
                onValueChange={(value) => {
                    audio.current.currentTime = value
                }}
            />
            <span className="lg:block hidden">{duration ? formatTime(duration) : "0:00"}</span>

        </div>
    )
}

export function Player() {
    const { currentMusic, isPlaying, setIsPlaying, volume } = usePlayerStore(state => state)
    const audioRef = useRef()
    const hasMusic = currentMusic?.song != null ? '' : 'translate-y-16'

    useEffect(() => {
        const playAudio = async () => {
            try {
                if (isPlaying) {
                    await audioRef.current.play();
                } else {
                    await audioRef.current.pause();
                }
            } catch (error) {
                console.error('Error al reproducir el audio:', error);
            }
        };

        playAudio();
    }, [isPlaying]);


    useEffect(() => {
        audioRef.current.volume = volume
    }, [volume])

    useEffect(() => {
        const loadAndPlayAudio = async () => {
            const { song, playlist } = currentMusic;

            if (song) {
                const src = `/music/${playlist?.id}/0${song.id}.mp3`;
                audioRef.current.src = src;
                audioRef.current.volume = volume;

                try {
                    await audioRef.current.play();
                    console.log('Reproduciendo:', song.title);
                } catch (error) {
                    console.error('Error al reproducir el audio:', error);
                }
            }
        };

        loadAndPlayAudio();
    }, [currentMusic]);


    const handleClick = () => {
        if (!currentMusic.song) return
        setIsPlaying(!isPlaying)
    }

    return (<>

        <div className="md:flex hidden justify-between items-center w-full px-2 lg:px-4 bg-black text-white absolute top-0 z-50  bottom-0 left-0 right-0 lg:py-5">
            <div audio={audioRef} className="w-24 md:w-32 lg:w-60">

                <CurrentSong {...currentMusic.song} />

            </div>
            <div className="flex justify-center items-center gap-4 flex-1">
                <div className="flex justify-center flex-col items-center gap-2  w-full md:px-10">
                    <button className="lg:bg-white lg:fill-black fill-white rounded-full p-2 disabled:cursor-not-allowed" onClick={handleClick} >
                        {
                            isPlaying ? <Pause className={``} /> : <Play className={``} />
                        }
                    </button>
                    <SongControl audio={audioRef} />
                </div>
            </div>
            <div className="md:flex  items-center justify-between gap-2 fill-white text-white hidden">
                <VolumeControl />
            </div>

        </div>

        <div className={`flex md:hidden flex-col w-full transition-all ease-in-out duration-500 z-10 absolute ${hasMusic}`}>
            <div className="flex gap-2 justify-between items-center mb-1" >
                <div audio={audioRef} className="text-white lg:w-60">

                    <CurrentSongMobile {...currentMusic.song} />

                </div>
                <div>
                    <button className="lg:bg-white lg:fill-black fill-white rounded-full p-4 disabled:cursor-not-allowed" onClick={handleClick}>
                        {
                            isPlaying ? <Pause className={``} /> : <Play className={``} />
                        }
                    </button>
                </div>
            </div>
            <SongControl audio={audioRef} />
            <nav></nav>
        </div>
        <audio ref={audioRef}></audio>
    </>
    )
}