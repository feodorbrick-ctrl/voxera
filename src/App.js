import './App.css';
import {useEffect, useState} from "react";
import {videoDivider} from "./frameworks/videoDivider";
import {transcribeAudio} from "./frameworks/transcribeAudio";

function App() {
    const [file, setFile] = useState(null);
    const [isSpinnerVisible, setSpinner] = useState(false);
    const [state, setState] = useState("pending");
    const [isVisibleError, setVisibleError] = useState(false);
    const [transcription, setTranscription] = useState('');
    const language = 'russian'
    
    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    }

    async function transcribeAudioFun () {
        const audioData = await videoDivider(file);

        return await transcribeAudio(audioData, language);
    }

    async function transcribe() {
        if (file !== null) {
            if (file.type.startsWith("video/mp4")) {
                setState("pending");

                try {
                    setSpinner(true);
                    const audio = await videoDivider(file);

                    console.log("Аудио получено");

                    const text = await transcribeAudio(audio, language);

                    setTranscription(text);

                    setState("fulfilled");
                    setSpinner(false);
                } catch (error) {
                    setState("rejected");
                    setVisibleError(true);
                    setTimeout(() => setVisibleError(false), 5000);
                    console.error("Ошибка транскрипции:", error);
                }
            } else {

                setTranscription(transcribeAudioFun())
            }
        }
    }

    useEffect(() => {
        setSpinner(state === "pending");
        if (state === "fulfilled") {
            setTranscription(transcribeAudioFun())
            setSpinner(false)
        }
    }, [state]);

    useEffect(() => {
        setSpinner(false)
    },file)

    return (
        <div className="App">
            <input type="file" onChange={handleFileChange}/>

            {file && (
                <>
                    <h1>name: {file.name}</h1>
                    <h1>type: {file.type}</h1>
                    <h1>size: {file.size}</h1>
                </>
            )}

            <button onClick={transcribe}>
                transcribe
            </button>

            <div
                className="spinner"
                style={{
                    display: isSpinnerVisible ? "block" : "none"
                }}
            />
            {isVisibleError &&
                <h1>some error</h1>
            }
            <h1>{transcription}</h1>
        </div>
    );
}

export default App;