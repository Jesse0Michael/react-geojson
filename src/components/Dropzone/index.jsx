import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./dropzone.css";

function DropZone({ onLoad, onError }) {
	const [state, setState] = useState({
		drag: false,
	});

	const onDrop = useCallback(
		(acceptedFiles) => {
			setState({ drag: false });
			acceptedFiles.forEach((file) => {
				const reader = new FileReader();

				reader.onabort = () => onError("file reading was aborted");
				reader.onerror = () => onError("file reading has failed");
				reader.onload = () => {
					var json;
					try {
						json = JSON.parse(reader.result);
					} catch {
						onError("cannot parse geoJSON from file");
						return;
					}
					onLoad(json);
				};
				reader.readAsText(file);
			});
		},
		[onLoad, onError]
	);

	const onDrag = () => {
		setState({ drag: true });
	};
	const onLeave = () => {
		setState({ drag: false });
	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		noClick: true,
	});

	return (
		<div
			className={state.drag ? "dropzone dropzone-drag" : "dropzone"}
			{...getRootProps()}
			onDragOver={(e) => onDrag(e)}
			onDragEnter={(e) => onDrag(e)}
			onDragLeave={(e) => onLeave(e)}
		>
			<p style={{ pointerEvents: "none" }}>Drag geo JSON files here, or click to select files</p>
			<input className="button" {...getInputProps()} style={{ display: "block" }} />
		</div>
	);
}

export default DropZone;
