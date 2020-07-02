import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ScratchMe = ({
	width,
	height,
	backgroundImageSrc,
	foregroundImageSrc,
	strokeWidth,
	onProgress,
	onCompleted,
	completedAt,
}) => {
	const backgroundCanvasRef = useRef(null);
	const foregroundCanvasRef = useRef(null);

	const [isCompleted, setIsCompleted] = useState(completedAt === 0);

	useEffect(() => {
		rascaInit();
	}, []);

	const rascaInit = () => {
		// Set up both canvases and get the 2d contexts

		const foregroundCanvas = foregroundCanvasRef.current;
		const foregroundContext = foregroundCanvas.getContext("2d");
		const backgroundCanvas = backgroundCanvasRef.current;
		const backgroundContext = backgroundCanvas.getContext("2d");

		// Load foreground image and set the cursor to erase mode

		const foregroundImage = new Image();
		foregroundImage.onload = function () {
			foregroundContext.drawImage(this, 0, 0);
			foregroundContext.globalCompositeOperation = "destination-out";
			foregroundContext.lineWidth = strokeWidth;
			backgroundImage.src = backgroundImageSrc;
		};
		const backgroundImage = new Image();
		backgroundImage.onload = function () {
			backgroundContext.drawImage(this, 0, 0);
		};
		foregroundImage.src = foregroundImageSrc;

		// Set up mouse events for drawing

		var drawing = false;
		var mousePos = {
			x: 0,
			y: 0,
		};
		var lastPos = mousePos;

		// Mouse events on the canvas

		foregroundCanvas.addEventListener(
			"mousedown",
			e => {
				drawing = true;
				lastPos = getMousePos(foregroundCanvas, e);
			},
			false,
		);

		foregroundCanvas.addEventListener(
			"mouseup",
			() => {
				drawing = false;
			},
			false,
		);

		foregroundCanvas.addEventListener(
			"mousemove",
			e => {
				mousePos = getMousePos(foregroundCanvas, e);
			},
			false,
		);

		// Get the position of the mouse relative to the canvas

		const getMousePos = (canvasDom, mouseEvent) => {
			const rect = canvasDom.getBoundingClientRect();
			return {
				x: mouseEvent.clientX - rect.left,
				y: mouseEvent.clientY - rect.top,
			};
		};

		// Get a regular interval for drawing to the screen

		window.requestAnimFrame = (function (callback) {
			return (
				window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimaitonFrame ||
				function (callback) {
					window.setTimeout(callback, 1000 / 60);
				}
			);
		})();

		const getFilledInPixels = stride => {
			if (!stride || stride < 1) stride = 1;
			const pixels = foregroundContext.getImageData(0, 0, width, height);
			const total = pixels.data.length / stride;
			let count = 0;
			for (let i = 0; i < pixels.data.length; i += stride) {
				if (parseInt(pixels.data[i], 10) === 0) count++;
			}
			return Math.round((count / total) * 100);
		};

		// Draw to the canvas

		const renderCanvas = () => {
			if (drawing) {
				foregroundContext.moveTo(lastPos.x, lastPos.y);
				foregroundContext.lineTo(mousePos.x, mousePos.y);
				foregroundContext.stroke();
				lastPos = mousePos;
				const percent = getFilledInPixels(32);
				onProgress(percent);
				if (percent >= completedAt && !isCompleted) {
					setIsCompleted(true);
					onCompleted();
				}
			}
		};

		// Allow for animation

		(function drawLoop() {
			window.requestAnimFrame(drawLoop);
			renderCanvas();
		})();

		foregroundCanvas.addEventListener(
			"touchstart",
			e => {
				e.preventDefault();
				mousePos = getTouchPos(foregroundCanvas, e);
				const touch = e.touches[0];
				const mouseEvent = new MouseEvent("mousedown", {
					clientX: touch.clientX,
					clientY: touch.clientY,
				});
				foregroundCanvas.dispatchEvent(mouseEvent);
			},
			false,
		);

		foregroundCanvas.addEventListener(
			"touchend",
			e => {
				e.preventDefault();
				const mouseEvent = new MouseEvent("mouseup", {});
				foregroundCanvas.dispatchEvent(mouseEvent);
			},
			false,
		);

		foregroundCanvas.addEventListener(
			"touchmove",
			e => {
				e.preventDefault();
				const touch = e.touches[0];
				const mouseEvent = new MouseEvent("mousemove", {
					clientX: touch.clientX,
					clientY: touch.clientY,
				});
				foregroundCanvas.dispatchEvent(mouseEvent);
			},
			false,
		);

		foregroundCanvas.addEventListener("touchcancel", e => {
			e.preventDefault();
		});

		// Get the position of a touch relative to the canvas

		const getTouchPos = (canvasDom, touchEvent) => {
			const rect = canvasDom.getBoundingClientRect();
			return {
				x: touchEvent.touches[0].clientX - rect.left,
				y: touchEvent.touches[0].clientY - rect.top,
			};
		};
	};

	const styles = {
		container: {
			position: "relative",
		},
		background: {
			position: "absolute",
			top: 0,
			left: 0,
			display: "block",
		},
		foreground: {
			position: "absolute",
			top: 0,
			left: 0,
		},
	};

	return (
		<div style={{ ...styles.container, width: width, height: height }}>
			<canvas
				style={styles.background}
				ref={backgroundCanvasRef}
				width={width}
				height={height}
			/>
			<canvas
				style={styles.foreground}
				ref={foregroundCanvasRef}
				width={width}
				height={height}
			/>
		</div>
	);
};

ScratchMe.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	backgroundImageSrc: PropTypes.string.isRequired,
	foregroundImageSrc: PropTypes.string.isRequired,
	strokeWidth: PropTypes.number,
	onProgress: PropTypes.func,
	onCompleted: PropTypes.func,
	completedAt: PropTypes.number,
};

ScratchMe.defaultProps = {
	strokeWidth: 20,
	onProgress: () => {},
	onCompleted: () => {},
	completedAt: 50,
};

export default ScratchMe;
