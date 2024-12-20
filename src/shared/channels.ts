import { BroadcastChannel } from "broadcast-channel";

export const googleAuthChannel = new BroadcastChannel<GoogleAuthChannel>(
    "google-auth-channel",
);

export const spotifyAuthChannel = new BroadcastChannel<SpotifyAuthChannel>(
    "spotify-auth-channel",
);
