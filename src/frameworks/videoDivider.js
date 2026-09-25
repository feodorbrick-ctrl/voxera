import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();
let loaded = false;

export async function videoDivider(videoData) {
    if (!loaded) {
        await ffmpeg.load();
        loaded = true;
    }

    const file = await fetchFile(videoData);

    await ffmpeg.writeFile("video.mp4", file);

    await ffmpeg.exec([
        "-i", "video.mp4",
        "-vn",
        "audio.wav"
    ]);

    const audioData = await ffmpeg.readFile("audio.wav");

    return audioData;
}