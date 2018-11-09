import { validationUtils } from '../../utils';

const createCanvasMatrix = (x, y) => {
	const matrix = [];

	for (let i = 0; i < x; i++) {
		matrix.push([]);
		for(let z = 0; z < y; z++) {
			matrix[i].push(null);
		}
	}

	return matrix;
};

const getLinePosition = figure => {
	if (validationUtils.isFigure(figure) && figure.parameters.points) {
		if (figure.parameters.points[0].y === figure.parameters.points[1].y) {
			return 'horizontal';
		}
		if (figure.parameters.points[0].x === figure.parameters.points[1].x) {
			return 'vertical';
		}
	}
};

const getLineDirection = figure => {
	if (validationUtils.isFigure(figure) && figure.parameters.points) {
		if (
			figure.parameters.points[0].x <= figure.parameters.points[1].x ||
			figure.parameters.points[0].y >= figure.parameters.points[1].y
		) {
			return 'normal';
		}
		if (
			figure.parameters.points[0].x >= figure.parameters.points[1].x ||
			figure.parameters.points[0].y <= figure.parameters.points[1].y
		) {
			return 'reverse';
		}
	}
};

const getRectangleSizes = figure => {
	if (validationUtils.isFigure(figure) && figure.parameters.corners) {
		return {
			width: figure.parameters.corners.lrc.x - figure.parameters.corners.ulc.x,
			height: figure.parameters.corners.lrc.y - figure.parameters.corners.ulc.y,
		}
	}
};

const getAdditionalFigureParams = figure => {
	switch (figure.type) {
		case 'line': {
			return {
				position: getLinePosition(figure),
				direction: getLineDirection(figure),
			}
		}
		case 'rectangle': {
			return getRectangleSizes(figure)
		}
		default: {
			return {}
		}
	}
};

const getFigureMatrixPoints = (figure) => {
	if (validationUtils.isFigure(figure)) {
		const matrixPoints = [];

		if (figure.type === 'line') {
			if (figure.parameters.position === 'horizontal') {
				const y = figure.parameters.points[0].y;

				if (figure.parameters.direction === 'normal') {
					for (let x = figure.parameters.points[0].x; x <= figure.parameters.points[1].x; x++) {
						matrixPoints.push([x, y]);
					}
				}
				if (figure.parameters.direction === 'reverse') {
					for (let x = figure.parameters.points[0].x; x >= figure.parameters.points[1].x; x--) {
						matrixPoints.push([x, y]);
					}
				}
			}
			if (figure.parameters.position === 'vertical') {
				const x = figure.parameters.points[0].x;

				if (figure.parameters.direction === 'normal') {
					for (let y = figure.parameters.points[0].y; y <= figure.parameters.points[1].y; y++) {
						matrixPoints.push([x, y]);
					}
				}
				if (figure.parameters.direction === 'reverse') {
					for (let y = figure.parameters.points[0].y; y >= figure.parameters.points[1].y; y--) {
						matrixPoints.push([x, y]);
					}
				}
			}
		}
		if (figure.type === 'rectangle') {
			for (let y = figure.parameters.corners.ulc.y; y <= figure.parameters.corners.lrc.y; y++) {
				for (let x = figure.parameters.corners.ulc.x; x <= figure.parameters.corners.lrc.x; x++) {
					matrixPoints.push([x, y]);
				}
			}
		}

		return matrixPoints;
	}
};

const parseLine = (line, number) => {
	const decoratedLineArray = line.replace(/\s+/g,' ').trim().split(' ');
	validationUtils.validateDecoratedLine(decoratedLineArray, number);
	const type = decoratedLineArray[0].toUpperCase();

	let figure = null;

	switch (type) {
		// Canvas
		case 'C': {
			return {
				type: 'canvas',
				parameters: {
					width: +decoratedLineArray[1],
					height: +decoratedLineArray[2],
				}
			};
		}
		// Line
		case 'L': {
			figure = {
				type: 'line',
				parameters: {
					points: [{
						x: +decoratedLineArray[1],
						y: +decoratedLineArray[2]
					}, {
						x: +decoratedLineArray[3],
						y: +decoratedLineArray[4]
					}],
				}
			};
			break;
		}
		// Rectangle
		case 'R': {
			figure = {
				type: 'rectangle',
				parameters: {
					corners: {
						ulc: {
							x: +decoratedLineArray[1],
							y: +decoratedLineArray[2]
						},
						lrc: {
							x: +decoratedLineArray[3],
							y: +decoratedLineArray[4]
						}
					}
				}
			};
			break;
		}
		// Bucket Fill
		case 'B': {
			return {
				type: 'bucketfill',
				parameters: {
					point: {
						x: +decoratedLineArray[1],
						y: +decoratedLineArray[2]
					},
					color: decoratedLineArray[3]
				}
			};
		}
		default: {
			return {
				type: 'unknown'
			}
		}
	}

	figure.parameters = {
		...figure.parameters,
		...getAdditionalFigureParams(figure),
	};
	figure.parameters.matrixPoints = getFigureMatrixPoints(figure);
	return figure;
};

const parseInputFile = (content) => {
	if (!content) {
		throw new TypeError('Parser Error: No content provided, skipping');
	}
	const lines = content.split('\n');
	return lines.map(parseLine);
};

export const drawerServices = {
	createCanvasMatrix,
	parseInputFile,
};
