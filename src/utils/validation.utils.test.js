import { validationUtils } from './validation.utils';

describe('Validation Utils', () => {
	describe('isFigure', () => {
		test('should return false, as element is null', () => {
			const element = null;
			expect(validationUtils.isFigure(element)).toBe(false);
		});
		test('should return false, as element is does not have parameters', () => {
			const element = {test: true};
			expect(validationUtils.isFigure(element)).toBe(false);
		});
		test('should return false, as element type is nor line or rectangle', () => {
			const element = {parameters: {}, type: 'mystic'};
			expect(validationUtils.isFigure(element)).toBe(false);
		});
		test('should return true, as element type is line and it has parameters', () => {
			const element = {parameters: {}, type: 'line'};
			expect(validationUtils.isFigure(element)).toBe(true);
		});
	});

	describe('isPositiveInteger', () => {
		test('should return false, as string provided', () => {
			const str = '123';
			expect(validationUtils.isPositiveInteger(str)).toBe(false);
		});
		test('should return false, as object provided', () => {
			const obj = { num: 123 };
			expect(validationUtils.isPositiveInteger(obj)).toBe(false);
		});
		test('should return false, as decimal provided', () => {
			const dec = 123.111;
			expect(validationUtils.isPositiveInteger(dec)).toBe(false);
		});
		test('should return false, as negative integer provided', () => {
			const integer = -123;
			expect(validationUtils.isPositiveInteger(integer)).toBe(false);
		});
		test('should return true, as positive integer provided', () => {
			const integer = 123;
			expect(validationUtils.isPositiveInteger(integer)).toBe(true);
		});
	});

	describe('isHex', () => {
		test('should return false, as not string provided', () => {
			const notHex = 123;
			expect(validationUtils.isHex(notHex)).toBe(false);
		});
		test('should return false, as long string provided', () => {
			const notHex = '#DJHV2e3figyd';
			expect(validationUtils.isHex(notHex)).toBe(false);
		});
		test('should return false, as short string provided', () => {
			const notHex = '#12';
			expect(validationUtils.isHex(notHex)).toBe(false);
		});
		test('should return true, as hex string provided (#3)', () => {
			const hex = '#fff';
			expect(validationUtils.isHex(hex)).toBe(true);
		});
		test('should return true, as hex string provided (#6)', () => {
			const hex = '#000000';
			expect(validationUtils.isHex(hex)).toBe(true);
		});
	});

	describe('validateDecoratedLine', () => {
		test('should return an error if line with "canvas" has wrong structure', () => {
			const line = ['C', 'jsdkhgf', 'sss', 'sssssdjkf', 'shkdj'];
			const lineNumber = 1;
			expect(() => validationUtils.validateDecoratedLine(line, lineNumber))
				.toThrow(Error(`Parser Error: Line ${lineNumber + 1} has wrong structure.`));
		});
		test('should return an error if line with "line" figure has wrong structure', () => {
			const line = ['l', 'jsdkhgf', 'sss'];
			const lineNumber = 1;
			expect(() => validationUtils.validateDecoratedLine(line, lineNumber))
				.toThrow(Error(`Parser Error: Line ${lineNumber + 1} has wrong structure.`));
		});
		test('should return an error if line with "rectangle" figure has wrong structure', () => {
			const line = ['R', 'jsdkhgf', 'sss'];
			const lineNumber = 1;
			expect(() => validationUtils.validateDecoratedLine(line, lineNumber))
				.toThrow(Error(`Parser Error: Line ${lineNumber + 1} has wrong structure.`));
		});
		test('should return an error if line with "bucketfill" action has wrong structure', () => {
			const line = ['B', 'jsdkhgf', 'sss', '§§§f', 'fff'];
			const lineNumber = 1;
			expect(() => validationUtils.validateDecoratedLine(line, lineNumber))
				.toThrow(Error(`Parser Error: Line ${lineNumber + 1} has wrong structure.`));
		});
		test('should return an error if line with "canvas" coordinates are not positive integers', () => {
			const line = ['C', '-111', 'eee'];
			const lineNumber = 1;
			expect(() => validationUtils.validateDecoratedLine(line, lineNumber))
				.toThrow(Error(`Parser Error: Line ${lineNumber + 1} has wrong structure. Expected positive integers in coordinates`));
		});
		test('should return an error if line with "line" coordinates are not positive integers', () => {
			const line = ['L', '-111', 'eee', 'w3w', '1qw'];
			const lineNumber = 1;
			expect(() => validationUtils.validateDecoratedLine(line, lineNumber))
				.toThrow(Error(`Parser Error: Line ${lineNumber + 1} has wrong structure. Expected positive integers in coordinates`));
		});
		test('should return an error if line with "bucketfill" coordinates are not positive integers', () => {
			const line = ['b', '-111', 'eee', 'w3w'];
			const lineNumber = 1;
			expect(() => validationUtils.validateDecoratedLine(line, lineNumber))
				.toThrow(Error(`Parser Error: Line ${lineNumber + 1} has wrong structure. Expected positive integers in coordinates`));
		});
		test('should return an error if line with "bucketfill" color is not in hex format', () => {
			const line = ['b', '10', '20', 'q1'];
			const lineNumber = 1;
			expect(() => validationUtils.validateDecoratedLine(line, lineNumber))
				.toThrow(Error(`Parser Error: Line ${lineNumber + 1} has wrong structure. Color should be in hex format`));
		});
	});

	describe('validateParsedData', () => {
		test('should return an error. Parsed data is not valid structure', () => {
			const parsedData = '111';
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: No data found'));
		});
	});
	describe('validateParsedData: Canvas', () => {
		test('should return an error. No canvas found', () => {
			const parsedData = [{ type: 'unknown' }];
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: No "Canvas" found'));
		});
		test('should return an error. > 1 canvas element found', () => {
			const parsedData = [{ type: 'canvas' }, { type: 'canvas' }];
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: cannot have many "Canvas" elements'));
		});
		test('should return an error. Canvas object has wrong structure', () => {
			const parsedData = [{ type: 'canvas', wrong: 'wooo' }];
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: canvas object has wrong structure'));
		});
		test('should return an error. Canvas width and height must be positive integers', () => {
			const parsedData = [{ type: 'canvas', parameters: { width: -1, height: 'www' } }];
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: canvas width and height must be positive integers'));
		});
	});
	describe('validateParsedData: Bucket Fill', () => {
		test('should return an error. Bucket Fill command must be one', () => {
			let parsedData = [{ type: 'canvas', parameters: { width: 20, height: 20 } }];
			parsedData = parsedData.concat([{ type: 'bucketfill' }, { type: 'bucketfill' }]);
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: For now "Bucket Fill" command can be used only once'));
		});
		test('should return an error. Bucket Fill object has wrong structure', () => {
			let parsedData = [{ type: 'canvas', parameters: { width: 20, height: 20 } }];
			parsedData= parsedData.concat([{ type: 'bucketfill', parameters: { point: { w: 1, h: 1 } } }]);
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: "Bucket Fill" object has wrong structure'));
		});
		test('should return an error. Bucket Fill should have valid color', () => {
			let parsedData = [{ type: 'canvas', parameters: { width: 20, height: 20 } }];
			parsedData = parsedData.concat([{ type: 'bucketfill', parameters: { point: { x: 1, y: 1 }, color: 'ff' } }]);
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: "Bucket Fill" color must be presented in hex format (#xxx or #XXXXXX)'));
		});
		test('should return an error. Bucket Fill should have valid color', () => {
			let parsedData = [{ type: 'canvas', parameters: { width: 20, height: 20 } }];
			parsedData = parsedData.concat([{
				type: 'bucketfill',
				parameters: { point: { x: -1, y: -2 }, color: '#fff' }
			}]);
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: "Bucket Fill" point coordinates must be positive integers'));
		});
	});
	describe('validateParsedData: Line', () => {
		test('should return an error. Line has wrong structure', () => {
			let parsedData = [{ type: 'canvas', parameters: { width: 20, height: 20 } }];
			parsedData = parsedData.concat([{ type: 'line', parameters: [] }]);
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: figure 1. "Line" object has wrong structure'));
		});
		test('should return an error. Line points must be positive integers', () => {
			let parsedData = [{ type: 'canvas', parameters: { width: 20, height: 20 } }];
			parsedData = parsedData.concat([{ type: 'line', parameters: { points: [{x: -1, y: 1}, {x: -2, y: 1}] } }]);
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: figure 1. "Line" points coordinates must be positive integers'));
		});
	});
	describe('validateParsedData: Rectangle', () => {
		test('should return an error. rectangle has wrong structure', () => {
			let parsedData = [{ type: 'canvas', parameters: { width: 20, height: 20 } }];
			parsedData = parsedData.concat([{ type: 'rectangle', parameters: { corners: { www: 111 } } }]);
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: figure 1. "Rectangle" object has wrong structure'));
		});
		test('should return an error. Rectangle corners coordinates must be positive integers', () => {
			let parsedData = [{ type: 'canvas', parameters: { width: 20, height: 20 } }];
			parsedData = parsedData.concat([{
				type: 'rectangle',
				parameters: { corners: { ulc: { x: 'dd1', y: 1 }, lrc: { x: 'dd2', y: 3 } } }
			}]);
			expect(() => validationUtils.validateParsedData(parsedData))
				.toThrow(Error('Parser Error: figure 1. "Rectangle" corners coordinates must be positive integers'));
		});
	});
});
