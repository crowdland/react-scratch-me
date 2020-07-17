"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScratchMe = function ScratchMe(_ref) {
	var width = _ref.width,
	    height = _ref.height,
	    backgroundImageSrc = _ref.backgroundImageSrc,
	    foregroundImageSrc = _ref.foregroundImageSrc,
	    strokeWidth = _ref.strokeWidth,
	    onProgress = _ref.onProgress,
	    onCompleted = _ref.onCompleted,
	    completedAt = _ref.completedAt;

	var backgroundCanvasRef = (0, _react.useRef)(null);
	var foregroundCanvasRef = (0, _react.useRef)(null);

	var _useState = (0, _react.useState)(completedAt === 0),
	    _useState2 = _slicedToArray(_useState, 2),
	    isCompleted = _useState2[0],
	    setIsCompleted = _useState2[1];

	(0, _react.useEffect)(function () {
		scratchMeInit();
	}, []);

	var scratchMeInit = function scratchMeInit() {
		// Set up both canvases and get the 2d contexts

		var foregroundCanvas = foregroundCanvasRef.current;
		var foregroundContext = foregroundCanvas.getContext("2d");
		var backgroundCanvas = backgroundCanvasRef.current;
		var backgroundContext = backgroundCanvas.getContext("2d");

		// Load foreground image and set the cursor to erase mode

		var foregroundImage = new Image();
		foregroundImage.onload = function () {
			foregroundContext.drawImage(this, 0, 0);
			foregroundContext.globalCompositeOperation = "destination-out";
			foregroundContext.lineWidth = strokeWidth;
			backgroundImage.src = backgroundImageSrc;
		};
		var backgroundImage = new Image();
		backgroundImage.onload = function () {
			backgroundContext.drawImage(this, 0, 0);
		};
		foregroundImage.src = foregroundImageSrc;

		// Set up mouse events for drawing

		var drawing = false;
		var mousePos = {
			x: 0,
			y: 0
		};
		var lastPos = mousePos;

		// Mouse events on the canvas

		foregroundCanvas.addEventListener("mousedown", function (e) {
			drawing = true;
			lastPos = getMousePos(foregroundCanvas, e);
		}, false);

		foregroundCanvas.addEventListener("mouseup", function () {
			drawing = false;
		}, false);

		foregroundCanvas.addEventListener("mousemove", function (e) {
			mousePos = getMousePos(foregroundCanvas, e);
		}, false);

		// Get the position of the mouse relative to the canvas

		var getMousePos = function getMousePos(canvasDom, mouseEvent) {
			var rect = canvasDom.getBoundingClientRect();
			return {
				x: mouseEvent.clientX - rect.left,
				y: mouseEvent.clientY - rect.top
			};
		};

		// Get a regular interval for drawing to the screen

		window.requestAnimFrame = function (callback) {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimaitonFrame || function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		}();

		var getFilledInPixels = function getFilledInPixels(stride) {
			if (!stride || stride < 1) stride = 1;
			var pixels = foregroundContext.getImageData(0, 0, width, height);
			var total = pixels.data.length / stride;
			var count = 0;
			for (var i = 0; i < pixels.data.length; i += stride) {
				if (parseInt(pixels.data[i], 10) === 0) count++;
			}
			return Math.round(count / total * 100);
		};

		// Draw to the canvas

		var renderCanvas = function renderCanvas() {
			if (drawing) {
				foregroundContext.moveTo(lastPos.x, lastPos.y);
				foregroundContext.lineTo(mousePos.x, mousePos.y);
				foregroundContext.stroke();
				lastPos = mousePos;
				var percent = getFilledInPixels(32);
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

		foregroundCanvas.addEventListener("touchstart", function (e) {
			e.preventDefault();
			mousePos = getTouchPos(foregroundCanvas, e);
			var touch = e.touches[0];
			var mouseEvent = new MouseEvent("mousedown", {
				clientX: touch.clientX,
				clientY: touch.clientY
			});
			foregroundCanvas.dispatchEvent(mouseEvent);
		}, false);

		foregroundCanvas.addEventListener("touchend", function (e) {
			e.preventDefault();
			var mouseEvent = new MouseEvent("mouseup", {});
			foregroundCanvas.dispatchEvent(mouseEvent);
		}, false);

		foregroundCanvas.addEventListener("touchmove", function (e) {
			e.preventDefault();
			var touch = e.touches[0];
			var mouseEvent = new MouseEvent("mousemove", {
				clientX: touch.clientX,
				clientY: touch.clientY
			});
			foregroundCanvas.dispatchEvent(mouseEvent);
		}, false);

		foregroundCanvas.addEventListener("touchcancel", function (e) {
			e.preventDefault();
		});

		// Get the position of a touch relative to the canvas

		var getTouchPos = function getTouchPos(canvasDom, touchEvent) {
			var rect = canvasDom.getBoundingClientRect();
			return {
				x: touchEvent.touches[0].clientX - rect.left,
				y: touchEvent.touches[0].clientY - rect.top
			};
		};
	};

	var styles = {
		container: {
			position: "relative"
		},
		background: {
			position: "absolute",
			top: 0,
			left: 0,
			display: "block"
		},
		foreground: {
			position: "absolute",
			top: 0,
			left: 0
		}
	};

	return _react2.default.createElement(
		"div",
		{ style: _extends({}, styles.container, { width: width, height: height }) },
		_react2.default.createElement("canvas", {
			style: styles.background,
			ref: backgroundCanvasRef,
			width: width,
			height: height
		}),
		_react2.default.createElement("canvas", {
			style: styles.foreground,
			ref: foregroundCanvasRef,
			width: width,
			height: height
		})
	);
};

ScratchMe.propTypes = {
	width: _propTypes2.default.number.isRequired,
	height: _propTypes2.default.number.isRequired,
	backgroundImageSrc: _propTypes2.default.string.isRequired,
	foregroundImageSrc: _propTypes2.default.string.isRequired,
	strokeWidth: _propTypes2.default.number,
	onProgress: _propTypes2.default.func,
	onCompleted: _propTypes2.default.func,
	completedAt: _propTypes2.default.number
};

ScratchMe.defaultProps = {
	strokeWidth: 20,
	onProgress: function onProgress() {},
	onCompleted: function onCompleted() {},
	completedAt: 50
};

exports.default = ScratchMe;