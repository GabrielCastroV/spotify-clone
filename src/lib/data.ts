
import { colors } from "./colors";

export interface Playlist {
    id: string;
    albumId: number;
    title: string;
    color: (typeof colors)[keyof typeof colors];
    cover: string;
    artists: string[];
}

export const playlists: Playlist[] = [
    {
        id: '1',
        albumId: 1,
        title: "Chill Lo-Fi Music",
        color: colors.yellow,
        cover:
            "https://www.opnminded.com/wp-content/uploads/2018/06/Studio-Ghibli-01-optimized.jpg",
        artists: ["NoSparks", "Zap"],
    },
    {
        id: '2',
        albumId: 2,
        title: "人生最愛の人",
        color: colors.green,
        cover:
            "https://i.imgur.com/fezrcrL.jpg",
        artists: ["Kupla", "Blue Fox"],
    },
    {
        id: '3',
        albumId: 3,
        title: "Study Session",
        color: colors.rose,
        cover:
            "https://i1.sndcdn.com/artworks-hzC0LkywnS7TZlFt-TLYPIw-t500x500.jpg",
        artists: ["Tenno", "xander", "Team Astro"],
    },
    {
        id: '4',
        albumId: 4,
        title: "Blue Note Study Time",
        color: colors.blue,
        cover:
            "https://i.pinimg.com/736x/78/e1/c0/78e1c052ce978cf5b95ec1b991504eb5.jpg",
        artists: ["Raimu", "Yasumu"],
    },
    {
        id: '5',
        albumId: 5,
        title: "Relax Session",
        color: colors.purple,
        cover:
            "https://media.gq.com.mx/photos/6039588ee77487218ad2c4bc/16:9/w_2560%2Cc_limit/Viaje%2520de%2520Chihiro.jpg",
        artists: ["Shau Saura", "amies", "Tzuyu"],
    },
    {
        id: '6',
        albumId: 6,
        title: "Like a Necessity",
        color: colors.orange,
        cover:
            "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2020%2F03%2Flofi-hip-hop-popularity-criticism-chilledcow-youtube-livestream-1a.jpg?cbr=1&q=90",
        artists: ["WFS", "Nadav Cohen"],
    },
    {
        id: '7',
        albumId: 7,
        title: "Somewhere we know",
        color: colors.purple,
        cover:
            "https://pbs.twimg.com/media/ESpdlv1UwAAn8SW.jpg",
        artists: ["Woo", "Dew", "Yong"],
    },
    {
        id: '8',
        albumId: 8,
        title: "Le Ronronnement",
        color: colors.orange,
        cover:
            "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/08/Jiji.jpg",
        artists: ["Romina", "Miti", "Mat"],
    },
];

export const morePlaylists = playlists.map((item) => ({
    ...item,
    id: item.id + "_more",
}))

export const sidebarPlaylists = playlists.map((item) => ({
    ...item,
    id: item.id + "_side",
}))

export const allPlaylists = [
    ...playlists,
    ...morePlaylists,
    ...sidebarPlaylists,
]

export interface Song {
    id: number;
    albumId: number;
    title: string;
    image: string;
    artists: string[];
    album: string;
    duration: string;
}

export const songs: Song[] = [
    {
        "id": 1,
        "albumId": 1,
        "title": "Moonlit Walk",
        "image": `https://www.opnminded.com/wp-content/uploads/2018/06/Studio-Ghibli-01-optimized.jpg`,
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "3:12"
    },
    {
        "id": 2,
        "albumId": 1,
        "title": "Coffee Daze",
        "image": `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSwAmYhTrHlhW4GyQWq5Enja_noJvMnPqn3RD5lOOiow&s`,
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "4:07"
    },
    {
        "id": 3,
        "albumId": 1,
        "title": "Skyline Serenade",
        "image": `https://pbs.twimg.com/media/GHSPXICWIAA2WCM?format=jpg&name=4096x4096`,
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "3:50"
    },
    {
        "id": 4,
        "albumId": 1,
        "title": "Urban Echoes",
        "image": `https://thecurrentmsu.com/wp-content/uploads/2021/05/Screenshot-2021-05-09-174400.png`,
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "3:30"
    },
    {
        "id": 5,
        "albumId": 1,
        "title": "Night's End",
        "image": `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxMMHUgfHkmCiZa-O4Uf8wb7OrWDxeNcxWdleyKCKNPA&s`,
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "4:20"
    },
    {
        "id": 1,
        "albumId": 2,
        "title": "Silent Rain",
        "image": `https://vinyl.lofirecords.com/cdn/shop/files/2amsynth-vinyl.png?v=1693312187`,
        "artists": ["Urban Nocturne", "Mr Jackson"],
        "album": "Midnight Tales",
        "duration": "3:40"
    },
    {
        "id": 2,
        "albumId": 2,
        "title": "Lost Pages",
        "image": `https://fotografias-neox.atresmedia.com/clipping/cmsimages02/2022/05/13/46017819-5D11-40AA-B49E-F68ACA2FC756/castillo-ambulante_98.jpg?crop=1845,1038,x40,y0&width=1900&height=1069&optimize=high&format=webply`,
        "artists": ["Urban Nocturne"],
        "album": "Midnight Tales",
        "duration": "3:20"
    },
    {
        "id": 3,
        "albumId": 2,
        "title": "Midnight Tales",
        "image": `https://www.cultture.com/pics/2021/08/studio-ghibli-10-criaturas-que-deseariamos-que-fueran-reales-3.webp`,
        "artists": ["Urban Nocturne"],
        "album": "Midnight Tales",
        "duration": "3:50"
    },
    {
        "id": 4,
        "albumId": 2,
        "title": "City Lights",
        "image": `https://www.informador.mx/__export/1705545008827/sites/elinformador/img/2024/01/17/gahjywcwuaqutfe_crop1705544939960.jpeg_788543494.jpeg`,
        "artists": ["Urban Nocturne"],
        "album": "Midnight Tales",
        "duration": "3:30"
    },
    {
        "id": 5,
        "albumId": 2,
        "title": "Night Drive",
        "image": `https://cinepremiere.com.mx/wp-content/uploads/2022/06/studio-ghibli-mejores-peliculas.jpg`,
        "artists": ["Urban Nocturne"],
        "album": "Midnight Tales",
        "duration": "4:20"
    },
    {
        "id": 1,
        "albumId": 3,
        "title": "Lunar",
        "image": `https://www.ecartelera.com/images/sets/5000/5016.jpg`,
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "3:40"
    },
    {
        "id": 2,
        "albumId": 3,
        "title": "Go go go!",
        "image": `https://mundo-ghibli.com/storage/2023/02/jiji-nicky-bruja.jpg`,
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "3:20"
    },
    {
        "id": 3,
        "albumId": 3,
        "title": "Keep focus!",
        "image": `https://mundo-ghibli.com/storage/2023/02/cat-bus-totoro.jpg`,
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "2:40"
    },
    {
        "id": 4,
        "albumId": 3,
        "title": "JavaScript is the way",
        "image": `https://i0.wp.com/xiahpop.com/wp-content/uploads/2019/11/DkPOd0zUwAAB62D.jpg?fit=850%2C537`,
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "3:10"
    },
    {
        "id": 5,
        "albumId": 3,
        "title": "No more TypeScript for me",
        "image": `https://f4.bcbits.com/img/a1435058381_65.jpg`,
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "2:10"
    },
    {
        "id": 1,
        "albumId": 4,
        "title": "Lunar",
        "image": "https://www.lacasadeel.net/wp-content/uploads/2024/03/Porco-Rosso-741x371.webp",
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "3:40"
    },
    {
        "id": 2,
        "albumId": 4,
        "title": "Go go go!",
        "image": "https://f4.bcbits.com/img/a1962013209_16.jpg",
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "3:20"
    },
    {
        "id": 3,
        "albumId": 4,
        "title": "Keep focus!",
        "image": "https://i.redd.it/97gmj14gdr561.jpg",
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "2:40"
    },
    {
        "id": 4,
        "albumId": 4,
        "title": "JavaScript is the way",
        "image": "https://depor.com/resizer/9d4LxX6HgvVeLgQ87ILmwCkAAVQ=/580x330/smart/filters:format(jpeg):quality(90)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/H3FG2O53UFHEPDFAPTIU5IQESY.png",
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "3:10"
    },
    {
        "id": 5,
        "albumId": 4,
        "title": "No more TypeScript for me",
        "image": "https://cdn.domestika.org/c_fill,dpr_auto,f_auto,q_auto/v1476825543/content-items/001/745/852/06.ghibli-heroines-Fio-Piccolo-porco-rosso-original.jpg?1476825543",
        "artists": ["Tenno"],
        "album": "Study Session",
        "duration": "2:10"
    },
    {
        "id": 1,
        "albumId": 5,
        "title": "Moonlit Walk",
        "image": "https://mundo-ghibli.com/storage/2023/04/shun-kazama-pelicula.webp",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "3:12"
    },
    {
        "id": 2,
        "albumId": 5,
        "title": "Coffee Daze",
        "image": "https://somoskudasai.com/wp-content/uploads/2023/03/portada_ghibli-7.jpg",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "4:07"
    },
    {
        "id": 3,
        "albumId": 5,
        "title": "Skyline Serenade",
        "image": "https://www.geekmi.news/__export/1637429187703/sites/debate/img/2021/11/20/ita_y_fushi1.jpg_1758632412.jpg",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "3:50"
    },
    {
        "id": 4,
        "albumId": 5,
        "title": "Urban Echoes",
        "image": "https://f4.bcbits.com/img/a2793859494_16.jpg",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "3:30"
    },
    {
        "id": 5,
        "albumId": 5,
        "title": "Night's End",
        "image": "https://hips.hearstapps.com/es.h-cdn.co/fotoes/images/peliculas-para-ninos-cine-infantil/5-3-peliculas-ghibli-que-haran-las-delicias-de-los-mas-pequenos/02.-ponyo-en-el-acantilado/99709502-1-esl-ES/02.-Ponyo-en-el-acantilado.png",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "4:20"
    },
    {
        "id": 1,
        "albumId": 6,
        "title": "Moonlit Walk",
        "image": "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2020%2F03%2Flofi-hip-hop-popularity-criticism-chilledcow-youtube-livestream-1a.jpg?cbr=1&q=90",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "3:12"
    },
    {
        "id": 2,
        "albumId": 6,
        "title": "Coffee Daze",
        "image": "https://static01.nyt.com/images/2017/10/15/arts/15GHIBLI-RANKING-A-SPIRITED/10newclassics3-inyt-videoSixteenByNine1050.jpg",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "4:07"
    },
    {
        "id": 3,
        "albumId": 6,
        "title": "Skyline Serenade",
        "image": "https://i.pinimg.com/736x/6d/c6/30/6dc6306a3a7f906961f5cfa39f650d8f.jpg",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "3:50"
    },
    {
        "id": 4,
        "albumId": 6,
        "title": "Urban Echoes",
        "image": "https://f4.bcbits.com/img/a2793859494_16.jpg",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "3:30"
    },
    {
        "id": 5,
        "albumId": 6,
        "title": "Night's End",
        "image": "https://elcomercio.pe/resizer/O4Ii_iTBDlCEDqZi6BcXRF1hX4w=/1200x900/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/ZDPVDIWMHRGIRKOD7MJAEY5JOQ.jpg",
        "artists": ["LoFi Dreamer"],
        "album": "Chill Lo-Fi Music",
        "duration": "4:20"
    },

    {
        "id": 1,
        "albumId": 7,
        "title": "Deep Walk",
        "image": "https://www.indiewire.com/wp-content/uploads/2016/08/jiji-kiki.png?w=800",
        "artists": ["Freaking", 'Dune'],
        "album": "Somewhere we know",
        "duration": "2:29"
    },
    {
        "id": 2,
        "albumId": 7,
        "title": "Bread and Coffee",
        "image": "https://i.pinimg.com/736x/88/ee/14/88ee143e21b62dcd3e09ccd16b2eabff.jpg",
        "artists": ["Jihyo", 'TGG'],
        "album": "Somewhere we know",
        "duration": "1:49"
    },
    {
        "id": 3,
        "albumId": 7,
        "title": "Skyhigh",
        "image": "https://www.looper.com/img/gallery/the-30-best-studio-ghibli-characters-ranked/intro-1667174768.jpg",
        "artists": ["August", "Fredd"],
        "album": "Somewhere we know",
        "duration": "2:36"
    },
    {
        "id": 4,
        "albumId": 7,
        "title": "Drone",
        "image": "https://i.pinimg.com/736x/00/50/a9/0050a998798cc264e82accdc7d95ba5c.jpg",
        "artists": ["Hirai Momo"],
        "album": "Somewhere we know",
        "duration": "2:49"
    },
    {
        "id": 5,
        "albumId": 7,
        "title": "Night's End",
        "image": "https://freefrontend.com/assets/img/css-ghibli-characters/2021-le-voyage-de-chihiro-susuwatari.png",
        "artists": ["FTW", "RaZ"],
        "album": "Somewhere we know",
        "duration": "1:57"
    },
    {
        "id": 1,
        "albumId": 8,
        "title": "M&Ms",
        "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl9MBGQASPgMIh19hD2hJB8bVtqhXVU2Z18D3J2XqLd2If5PI5k5lHgtc6bGsI3YR7C9Q&usqp=CAU",
        "artists": ["Cyan"],
        "album": "Le Ronronnement",
        "duration": "2:54"
    },
    {
        "id": 2,
        "albumId": 8,
        "title": "Sugar Honey Ice Tea",
        "image": "https://i1.sndcdn.com/artworks-000085976582-vonea1-t500x500.jpg",
        "artists": ["ZYZZ"],
        "album": "Le Ronronnement",
        "duration": "1:52"
    },
    {
        "id": 3,
        "albumId": 8,
        "title": "Main Trousers",
        "image": "https://i0.wp.com/higherplainmusic.com/wp-content/uploads/2022/05/rozen-ghibli-secret-hideaway-cover-art.jpg?fit=1200%2C1200&ssl=1",
        "artists": ["Agustin Calderon"],
        "album": "Le Ronronnement",
        "duration": "2:15"
    },
    {
        "id": 4,
        "albumId": 8,
        "title": "Midwest",
        "image": "https://i1.sndcdn.com/artworks-000042547765-eehere-t500x500.jpg",
        "artists": ["Astro Master"],
        "album": "Le Ronronnement",
        "duration": "4:06"
    },
    {
        "id": 5,
        "albumId": 8,
        "title": "End?",
        "image": "https://pbs.twimg.com/media/FCPv12EX0A0YIWx?format=jpg&name=large",
        "artists": ["Bills", "Ocean"],
        "album": "Le Ronronnement",
        "duration": "3:49"
    },

]
