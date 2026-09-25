import './App.css';
import {useState} from "react";

function App() {
    const [file, setFile] = useState([]);

    function handleFileChange(event) {
        const selectedFile = event.target.files[0];

        setFile(selectedFile);
    }

    return (
        <div className="App">
            <input type="file" onChange={handleFileChange}/>
            {file &&
                <>
                    <h1>name: {file.name}</h1>
                    <h1>type: {file.type}</h1>
                    <h1>size: {file.size}</h1>
                </>
            }
        </div>
    );
}

export default App;
