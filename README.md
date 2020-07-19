# A Scratch Card component for React

## Demo

https://crowdland.github.io/react-scratch-me/

## Installation

```
// using npm
npm install react-scratch-me --save
// using yarn
yarn add react-scratch-me
```

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
| width | number | Width of the component | none | yes |
| height | number | Height of the component | none | yes |
| foregroundImageSrc | string | The image to use as foreground (what the user will scratch) | none | yes |
| backgroundImageSrc | string | The image to use as background (what will be revealed) | none | yes |
| strokeWidth | number | Width of the stroke as you erase the foreground image | 20 | no |
| onProgress | function | Function to be executed as the scratching progresses. It will return the current cleared percentage. | none | no |
| onCompleted | function | Function to execute when the scratch card has been completed | none | no |
| completedAt | number | Percentage to consider the scratch card to be completed | 50 | no |