import React, { useState } from "react";
import { render } from "react-dom";
import ScratchMe from "../../src";
import foregroundImageSrc from "./placeimg_400_300_arch.jpg";
import backgroundImageSrc from "./placeimg_400_300_people.jpg";

const App = () => {
	const [completed, setCompleted] = useState(false);
	const [progress, setProgress] = useState(0);

	return (
		<div>
			<h1>Scratch Me! Demo</h1>
			<ScratchMe
				width={400}
				height={300}
				foregroundImageSrc={foregroundImageSrc}
				backgroundImageSrc={backgroundImageSrc}
				onCompleted={() => setCompleted(true)}
				completedAt={30}
				onProgress={percent => setProgress(percent)}
			/>
			<p>
				Completed: {completed ? "Yes" : "No"}
				<br />
				Progress: {progress}%
			</p>
		</div>
	);
};

render(<App />, document.getElementById("root"));
