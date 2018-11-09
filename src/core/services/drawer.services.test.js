import { drawerServices } from './drawer.services';

describe('Drawer Service', () => {
	describe('createCanvasMatrix', () => {
		test('should return matrix with set width and height and empty items (nulls)', () => {
			const width = 2;
			const height = 2;

			const supposedResult = [
				[null, null],
				[null, null],
			];

			expect(drawerServices.createCanvasMatrix(width, height)).toEqual(supposedResult);
		});
	});

	describe('parseInputFile', () => {
		test('should skip parsing and return an error if no content is provided', () => {
			const content = null;
			expect(() => drawerServices.parseInputFile(content)).toThrow(Error('Parser Error: No content provided, skipping'));
		});

		test('should return parsed data (only canvas)', () => {
			const content = 'C 10 20';
			const parsed = drawerServices.parseInputFile(content);
			expect(Array.isArray(parsed)).toBe(true);
			expect(parsed).toHaveLength(1);
			expect(parsed).toContainEqual({
				type: 'canvas',
				parameters: {
					width: 10,
					height: 20
				}
			});
		});

		test('should return parsed data (canvas and a few figures)', () => {
			const content = 'C 10 20\nL 1 1 4 1\nL 2 2 2 6\nR 10 5 15 7';
			const parsed = drawerServices.parseInputFile(content);
			expect(Array.isArray(parsed)).toBe(true);
			expect(parsed).toHaveLength(4);
			// check figures number
			const figures = parsed.filter(el => el.type === 'line' || el.type === 'rectangle');
			expect(figures).toHaveLength(3);
			// check horizontal line (normal direction)
			expect(figures).toContainEqual({
				type: 'line',
				parameters: {
					points: [{
						x: 1,
						y: 1
					}, {
						x: 4,
						y: 1
					}],
					matrixPoints: [[1, 1], [2, 1], [3, 1], [4, 1]],
					position: 'horizontal',
					direction: 'normal'
				}
			});
			// check vertical line (normal direction)
			expect(figures).toContainEqual({
				type: 'line',
				parameters: {
					points: [{
						x: 2,
						y: 2
					}, {
						x: 2,
						y: 6
					}],
					matrixPoints: [[2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
					position: 'vertical',
					direction: 'normal'
				}
			});
			// check rectangle
			expect(figures).toContainEqual({
				type: 'rectangle',
				parameters: {
					corners: {
						ulc: {
							x: 10,
							y: 5
						},
						lrc: {
							x: 15,
							y: 7
						}
					},
					width: 5,
					height: 2,
					matrixPoints: [
						[10, 5], [11, 5], [12, 5], [13, 5], [14, 5], [15, 5],
						[10, 6], [11, 6], [12, 6], [13, 6], [14, 6], [15, 6],
						[10, 7], [11, 7], [12, 7], [13, 7], [14, 7], [15, 7]
					],
				}
			});
		});

		test('should return unknown elements if content string has wrong structure', () => {
			const content = 'wrong\nstring';
			const parsed = drawerServices.parseInputFile(content);
			expect(Array.isArray(parsed)).toBe(true);
			expect(parsed).toHaveLength(2);
			expect(parsed).toContainEqual({
				type: 'unknown'
			});
		})
	});
});
