import './App.css';
import { useEffect, useState } from "react";
import { videoDivider } from "./frameworks/videoDivider";
import {transcribeAudio} from "./frameworks/transcribeAudio";

function App() {
    const [file, setFile] = useState(null);
    const [isSpinnerVisible, setSpinner] = useState(false);
    const [state, setState] = useState("pending");
    const [isVisibleError, setVisibleError] = useState(false);

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    }

    async function transcribe() {
        if (file !== null) {
            if (file.type.startsWith("video/mp4")) {
                setState("pending");

                try {
                    const audio = await videoDivider(file);

                    console.log(audio);

                    setState("fulfilled");
                } catch (error) {
                    setState("rejected");
                    setVisibleError(true);
                    console.error("Ошибка транскрипции:", error);
                }
            } else {
                transcribeAudio(file, setFile);
            }
        }
    }

    useEffect(() => {
        setSpinner(state === "pending");
        if (state === "fulfilled") {
            transcribeAudio(file, setFile);
            setSpinner(true)
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
        </div>
    );
}

export default App;