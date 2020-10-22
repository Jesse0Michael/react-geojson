import React, { useEffect, useRef } from "react";
import "./output.css";

export function WebsocketOutput(props) {
    const textArea = useRef(null);

    useEffect(() => {
        textArea.current.scrollTop = textArea.current.scrollHeight
    }, [textArea, props]);

    return (
        <textarea ref={textArea} className="output-area" readOnly value={props.output.join("\n")} />
    );
}

export default WebsocketOutput;
