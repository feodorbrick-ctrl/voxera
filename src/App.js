import './App.css';
import {useEffect, useState} from "react";
import {videoDivider} from "./frameworks/videoDivider";
import {transcribeAudio} from "./frameworks/transcribeAudio";
import CustomSelect from "./components/CustomSelect/customSelect";
import {languages} from "./components/data/languages";
import Spinner from "./components/spinner/spinner";

function App() {
    const [file, setFile] = useState(null);
    const [isSpinnerVisible, setSpinner] = useState(false);
    const [state, setState] = useState("pending");
    const [isVisibleError, setVisibleError] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [language, setLanguage] = useState('russian')

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    }

    async function transcribeAudioFun() {
        const audioData = await videoDivider(file);

        return await transcribeAudio(audioData, language);
    }

    async function transcribe() {
        setState("pending");
        if (file !== null) {
            if (!file.type.startsWith("audio/wav")) {

                try {
                    setSpinner(true);
                    const audio = await videoDivider(file);

                    console.log("Аудио получено");

                    const text = await transcribeAudio(audio, language);

                    setTranscription(text);

                    setState("fulfilled");
                    setSpinner(false);
                } catch (error) {
                    setVisibleError(true);
                    setTimeout(() => setVisibleError(false), 5000);
                    console.error("Ошибка транскрипции:", error);
                }
            } else {
                await setTranscription(transcribeAudioFun())

            }
        } else {
            setVisibleError(true)
            setTimeout(() => setVisibleError(false), 2000)
        }
        setState("rejected");
    }

    useEffect(() => {
        setSpinner(state === "pending");
        if (state === "fulfilled") {
            setTranscription(transcribeAudioFun())
            setSpinner(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        setSpinner(false)
    }, [file])

    return (
        <div className="App">
            <div className='inputZone'>
                <h1 className='input__text'>choose file</h1>
                <input className='input' type="file" onChange={handleFileChange}/>
            </div>

            <div className='infoZone'>
                {file ?
                    <div className='fileInfo'>
                        <h1>name: {file.name}</h1>
                        <h1>type: {file.type}</h1>
                        <h1>size: {file.size}</h1>
                    </div>
                    :
                    <div className='fileInfo'>
                        <h1>name: choose file</h1>
                        <h1>type: choose file</h1>
                        <h1>size: choose file</h1>
                    </div>
                }

            </div>

            <button className='transcribeBtn' onClick={transcribe}>
                transcribe
            </button>
            <Spinner isSpinnerVisible={isSpinnerVisible}/>
            <h1>{transcription}</h1>
            <div className='infoZone'>
                <CustomSelect
                    onChange={setLanguage}
                    placeholder='Select please a language of subtitles'
                    value={language}
                    options={languages}
                />
            </div>
            {isVisibleError &&
                <h1 className='error'>some error</h1>
            }
        </div>
    );
}

export default App;