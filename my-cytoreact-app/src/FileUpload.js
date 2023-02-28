import {useState} from "react";
import XMLParser from 'react-xml-parser';

function FileUploadButton() {
    const [selectedFile, setSelectedFile] = useState();

    // Target file as selectedFile
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Read in file
    const handleSubmission = () => {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function (e) {
            var preParseData = e.target.result;
            parseData(preParseData);
        };

        // Parse data
        const parseData = (data) => {
            var jsonDataFromXml = new XMLParser().parseFromString(data);
            console.log(jsonDataFromXml);

            iterateJson(jsonDataFromXml);

        }

        function iterateJson(json) {
            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    const value = json[key];

                    if (key === "name") {
                        // If the value is an object, recursively iterate through its keys
                        if (typeof value === "object") {
                            iterateJson(value);
                        } else {
                            // If the value is not an object, it's a leaf node
                            console.log(`Found child element: ${key} = ${value}`);
                            console.log(json.attributes);
                        }
                    } else if (typeof value === "object") {
                        // If the value is an object, recursively iterate through its keys
                        iterateJson(value);
                    }
                }
            }
        }
    };

    return (
        <div>
            <input type="file" name="file" onChange={changeHandler}/>
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    )
}

export default FileUploadButton;