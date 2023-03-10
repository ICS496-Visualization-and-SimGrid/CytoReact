import {useState} from "react";
import XMLParser from 'react-xml-parser';

function FileUploadButton(props) {
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
            const jsonDataFromXml = new XMLParser().parseFromString(data);

            // main item to be passed
            const elements = [];
            const elementsData = [];


            iterateJson(jsonDataFromXml, elements, elementsData);
            console.log(elements);

            props.handleElements(elements);
        }

        function iterateJson(json, elements, elementsData) {
            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    const value = json[key];

                    switch (key) {
                        case "name":
                            if (typeof value === "object") {
                                iterateJson(value, elements, elementsData);
                            } else {
                                if (!["DOCTYPE", "--", "---", "platform"].includes(value)) {
                                    const element = {
                                        name: value,
                                        attributes: json.attributes,
                                    };
                                    switch (element.name) {
                                        case "host":
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    label: json.attributes.id,
                                                    name: element.name,
                                                    speed: json.attributes.speed,
                                                    type: "rectangle",
                                                },
                                            });
                                            break;
                                        case "link":
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    label: "link " + json.attributes.id,
                                                    name: element.name,
                                                    bandwidth: json.attributes.bandwidth,
                                                    latency: json.attributes.latency,
                                                    type: "rhomboid",
                                                },
                                            });
                                            break;
                                        case "router":
                                            elements.push({
                                                data: {
                                                    id: json.attributes.id,
                                                    name: element.name,
                                                    label: json.attributes.id,
                                                },
                                            })
                                        case "route":
                                            if (json.children && json.children.length > 1) {
                                                // Connect the source to the first child
                                                const source = json.attributes.src;
                                                const target = json.children[0].attributes.id;
                                                elements.push({
                                                    data: {
                                                        id: `${source}-${target}`,
                                                        label: `${source} to ${target}`,
                                                        name: element.name,
                                                        source: source,
                                                        target: target,
                                                    },
                                                });

                                                // Connect each child to the next child
                                                for (let i = 0; i < json.children.length - 1; i++) {
                                                    const sourceId = json.children[i].attributes.id;
                                                    const targetId = json.children[i + 1].attributes.id;
                                                    if (sourceId && targetId) {
                                                        elements.push({
                                                            data: {
                                                                id: `${sourceId}-${targetId}`,
                                                                label: `${sourceId} to ${targetId}`,
                                                                name: element.name,
                                                                source: sourceId,
                                                                target: targetId,
                                                            },
                                                        });
                                                    }
                                                }

                                                // Connect the last child to the destination
                                                const lastChild = json.children[json.children.length - 1];
                                                const lastChildId = lastChild.attributes.id;
                                                if (lastChildId && json.attributes.dst) {
                                                    elements.push({
                                                        data: {
                                                            id: `${lastChildId}-${json.attributes.dst}`,
                                                            label: `${lastChildId} to ${json.attributes.dst}`,
                                                            name: element.name,
                                                            source: lastChildId,
                                                            target: json.attributes.dst,
                                                        },
                                                    });
                                                }
                                            } else if (json.children && json.children.length === 1) {
                                                // If there's only one child, connect the source to the child and the child to the destination
                                                const source = json.attributes.src;
                                                const target = json.children[0].attributes.id;
                                                if (source && target) {
                                                    elements.push({
                                                        data: {
                                                            id: `${source}-${target}`,
                                                            label: `${source} to ${target}`,
                                                            name: element.name,
                                                            source: source,
                                                            target: target,
                                                        },
                                                    });
                                                }
                                                const child = json.children[0];
                                                const childId = child.attributes.id;
                                                if (childId && json.attributes.dst) {
                                                    elements.push({
                                                        data: {
                                                            id: `${childId}-${json.attributes.dst}`,
                                                            label: `${childId} to ${json.attributes.dst}`,
                                                            name: element.name,
                                                            source: childId,
                                                            target: json.attributes.dst,
                                                        },
                                                    });
                                                }
                                            } else {
                                                // If there are no children, connect the source to the destination
                                                const source = json.attributes.src;
                                                const target = json.attributes.dst;
                                                if (source && target) {
                                                    elements.push({
                                                        data: {
                                                            id: `${source}-${target}`,
                                                            label: `${source} to ${target}`,
                                                            name: element.name,
                                                            source: source,
                                                            target: target,
                                                        },
                                                    });
                                                }
                                            }
                                            break;
                                        default:
                                            // elements.push({
                                            //     data: {
                                            //         id: json.attributes.id,
                                            //         name: element.name,
                                            //         label: element.name,
                                            //     },
                                            // });
                                            break;
                                    }
                                }
                            }
                            break;
                        default:
                            // If the value is an object, recursively iterate through its keys
                            if (typeof value === "object") {
                                iterateJson(value, elements, elementsData);
                            }
                            break;
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