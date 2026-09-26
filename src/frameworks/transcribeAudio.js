import { pipeline } from "@huggingface/transformers";

let transcriber = null;

async function getTranscriber(transcribeMode) {
    if (!transcriber) {
        transcriber = await pipeline(
            "automatic-speech-recognition",
            `Xenova/whisper-base`,
            {
                device: "wasm"
            }
        );
    }

    return transcriber;
}

export async function transcribeAudio(audioData, language = "russian") {
    const whisper = await getTranscriber();

    const audioBlob = new Blob(
        [audioData],
        {
            type: "audio/wav"
        }
    );

    const arrayBuffer = await audioBlob.arrayBuffer();

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    const audioContext = new AudioContext();

    try {
        const audioBuffer =
            await audioContext.decodeAudioData(arrayBuffer);

        let audio = audioBuffer.getChannelData(0);

        const targetSampleRate = 16000;

        if (audioBuffer.sampleRate !== targetSampleRate) {
            const targetLength = Math.round(
                audio.length *
                targetSampleRate /
                audioBuffer.sampleRate
            );

            const offlineContext =
                new OfflineAudioContext(
                    1,
                    targetLength,
                    targetSampleRate
                );

            const buffer =
                offlineContext.createBuffer(
                    1,
                    audio.length,
                    audioBuffer.sampleRate
                );

            buffer.copyToChannel(audio, 0);

            const source =
                offlineContext.createBufferSource();

            source.buffer = buffer;
            source.connect(offlineContext.destination);
            source.start(0);

            const rendered =
                await offlineContext.startRendering();

            audio = rendered.getChannelData(0);
        }

        const chunkDuration = 10;
        const chunkSize = targetSampleRate * chunkDuration;

        const chunks = [];

        for (
            let start = 0;
            start < audio.length;
            start += chunkSize
        ) {
            const end = Math.min(
                start + chunkSize,
                audio.length
            );

            chunks.push(
                audio.slice(start, end)
            );
        }

        const results = new Array(chunks.length);

        const maxConcurrent = 1;

        for (
            let i = 0;
            i < chunks.length;
            i += maxConcurrent
        ) {
            const currentChunks =
                chunks.slice(
                    i,
                    i + maxConcurrent
                );

            const currentResults =
                await Promise.all(
                    currentChunks.map(
                        async (chunk) => {
                            const result =
                                await whisper(
                                    chunk,
                                    {
                                        language,
                                        task: "transcribe",
                                        return_timestamps: false
                                    }
                                );

                            return result.text || "";
                        }
                    )
                );

            currentResults.forEach(
                (text, index) => {
                    results[i + index] =
                        text.trim();
                }
            );
        }

        return results
            .filter(Boolean)
            .join(" ");

    } finally {
        await audioContext.close();
    }
}