# A Scratch Card component for React

## Demo

https://crowdland.github.io/react-scratch-me/

## Sample usage

```
import React from "react";
import ScratchMe from "react-scratch-me";
import foregroundImageSrc from "./foreground.jpg";
import backgroundImageSrc from "./background.jpg";

const MyPage = () => (
	<ScratchMe
		width={400}
		height={300}
		foregroundImageSrc={foregroundImageSrc}
		backgroundImageSrc={backgroundImageSrc}
		strokeWidth={20}
		onProgress={percent => console.log(`${percent}% cleared`)}
		onCompleted={() => console.log(`Scratch Card Completed!`)}
		completedAt={30}
	/>
);

export default MyPage;
```

## Properties

| Name | Type | Description | Default value | Required |
| - | - | - | - | - |
| width | int | The width of the component | none | yes |
| height | int | The height of the component | none | yes |
| foregroundImageSrc | string | Image to use as foreground | none | yes |
| backgroundImageSrc | string | Image to use as background | none | yes |
| strokeWidth | int | The width of the stroke as you erase the foreground image | 20 | no |
| onProgress | function | You can provide a function to be executed as the scratching progresses. It will return the current cleared percentage. | none | no |
| onCompleted | function | Function to execute when the scratch card has been completed | none | no |
| completedAt | int | Percentage to consider the scratch card to be completed | 50 | no |