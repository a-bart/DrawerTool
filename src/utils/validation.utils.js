const isFigure = (el) => !!(el && el.parameters && (el.type === 'line' || el.type === 'rectangle'));
const isPositiveInteger = (num) => Number.isInteger(num) && num >= 0;
const isHex = (color) => {
	const colorHexRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
	return colorHexRegex.test(color);
};
const isNil = (value) => value == null;

const validateDecoratedLine = (decoratedLineArray, lineNumber) => {
	const baseErrorMessage = `Parser Error: Line ${lineNumber + 1} has wrong structure.`;
	const type = decoratedLineArray[0].toUpperCase();

	switch (type) {
		// Canvas
		case 'C': {
			if (decoratedLineArray.length !== 3) {
				throw new Error(baseErrorMessage);
			}
			if (!(
				isPositiveInteger(+decoratedLineArray[1]) &&
				isPositiveInteger(+decoratedLineArray[2])
			)) {
				throw new Error(`${baseErrorMessage} Expected positive integers in coordinates`);
			}
			return;
		}
		// Line or Rectangle
		case 'L':
		case 'R': {
			if (decoratedLineArray.length !== 5) {
				throw new Error(baseErrorMessage);
			}
			if (!(
				isPositiveInteger(+decoratedLineArray[1]) &&
				isPositiveInteger(+decoratedLineArray[2]) &&
				isPositiveInteger(+decoratedLineArray[3]) &&
				isPositiveInteger(+decoratedLineArray[4])
			)) {
				throw new Error(`${baseErrorMessage} Expected positive integers in coordinates`);
			}
			return;
		}
		// Bucket Fill
		case 'B': {
			if (decoratedLineArray.length !== 4) {
				throw new Error(baseErrorMessage);
			}
			if (!(
				isPositiveInteger(+decoratedLineArray[1]) &&
				isPositiveInteger(+decoratedLineArray[2])
			)) {
				throw new Error(`${baseErrorMessage} Expected positive integers in coordinates`);
			}
			if (!isHex(decoratedLineArray[3])) {
				throw new Error(`${baseErrorMessage} Color should be in hex format`);
			}
			return;
		}
		default: {
			// skip
			return;
		}
	}
};

const validateParsedData = (parsedData) => {
	if (!(parsedData && Array.isArray(parsedData) && parsedData.length)) {
		throw new Error('Parser Error: No data found');
	}

	// check "Canvas" (mandatory)
	const canvasArray = parsedData.filter(el => el.type === 'canvas');
	const canvasCount = canvasArray.length;
	if (canvasCount === 0) throw new Error('Parser Error: No "Canvas" found');
	if (canvasCount > 1) throw new Error('Parser Error: cannot have many "Canvas" elements');
	const canvas = canvasArray[0];
	if (!(canvas.parameters && !isNil(canvas.parameters.width) && !isNil(canvas.parameters.height))) {
		throw new Error('Parser Error: canvas object has wrong structure');
	}
	if (!(isPositiveInteger(canvas.parameters.width) && isPositiveInteger(canvas.parameters.height))) {
		throw new Error('Parser Error: canvas width and height must be positive integers');
	}

	// check "Bucket Fill" (if provided)
	const bucketFillArray = parsedData.filter(el => el.type === 'bucketfill');
	const bucketFillCount = bucketFillArray.length;
	if (bucketFillCount) {
		if (bucketFillCount > 1) {
			throw new Error('Parser Error: For now "Bucket Fill" command can be used only once');
		}

		const bucketFill = bucketFillArray[0];
		const colorHexRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

		if (!(
			bucketFill.parameters && bucketFill.parameters.color && bucketFill.parameters.point &&
			!isNil(bucketFill.parameters.point.x) && !isNil(bucketFill.parameters.point.y)
		)) {
			throw new Error('Parser Error: "Bucket Fill" object has wrong structure');
		}
		if (!(colorHexRegex.test(bucketFill.parameters.color))) {
			throw new Error('Parser Error: "Bucket Fill" color must be presented in hex format (#xxx or #XXXXXX)');
		}
		if (!(isPositiveInteger(bucketFill.parameters.point.x) && isPositiveInteger(bucketFill.parameters.point.y))) {
			throw new Error('Parser Error: "Bucket Fill" point coordinates must be positive integers');
		}
	}

	// check figures (if provided)
	const figuresArray = parsedData.filter(isFigure);
	figuresArray.forEach((figure, i) => {
		// check "Line" figure
		if (figure.type === 'line') {
			if (!(
				figure.parameters && Array.isArray(figure.parameters.points) &&
				figure.parameters.points.length > 1 &&
				figure.parameters.points.every(point => !isNil(point.x) && !isNil(point.y))
			)) {
				throw new Error(`Parser Error: figure ${i+1}. "Line" object has wrong structure`);
			}
			if (!(figure.parameters.points.every(point => isPositiveInteger(point.x) && isPositiveInteger(point.y)))) {
				throw new Error(`Parser Error: figure ${i+1}. "Line" points coordinates must be positive integers`);
			}
		}

		// check "Rectangle" figure
		if (figure.type === 'rectangle') {
			if (!(
				figure.parameters && figure.parameters.corners &&
				figure.parameters.corners.ulc && figure.parameters.corners.lrc
			)) {
				throw new Error(`Parser Error: figure ${i+1}. "Rectangle" object has wrong structure`);
			}
			if (!(
				isPositiveInteger(figure.parameters.corners.ulc.x) &&
				isPositiveInteger(figure.parameters.corners.ulc.y) &&
				isPositiveInteger(figure.parameters.corners.lrc.x) &&
				isPositiveInteger(figure.parameters.corners.lrc.y)
			)) {
				throw new Error(`Parser Error: figure ${i+1}. "Rectangle" corners coordinates must be positive integers`);
			}
		}
	});
};

export const validationUtils = {
	isFigure,
	isHex,
	isPositiveInteger,
	validateDecoratedLine,
	validateParsedData,
};
