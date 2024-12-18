import spotify from "@src/assets/images/Spotify_Primary_Logo_RGB_Green.png";
import youtube from "@src/assets/images/youtube-music-seeklogo.png";

export const providers: Array<{
    provider: Provider;
    img: string;
}> = [
    {
        provider: "spotify",
        img: spotify,
    },
    {
        provider: "youtube",
        img: youtube,
    },
];

export const capitalize = (word: string) =>
    word[0].toLocaleUpperCase() + word.slice(1, word.length);

export const findProviderIcon = (provider: Provider) =>
    providers.find((logo) => logo.provider === provider)?.img;
