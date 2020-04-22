import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import "./dropzone.css";

function DropZone({ onLoad }) {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(binaryStr)
            }
            reader.readAsArrayBuffer(file)

            onLoad("yolo");
        })

    }, [onLoad])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <div className="dropzone" {...getRootProps()}>
            <p>Drag geo JSON files here, or click to select files</p>
            <input className="button" {...getInputProps()} style={{ display: "block" }} />
        </div>
    )
}

export default DropZone;
