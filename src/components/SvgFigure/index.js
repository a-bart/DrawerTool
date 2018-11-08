import React from 'react';

const SvgFigure = ({ figure, strokeWidth }) => {
	switch (figure.type) {
		case 'line': {
			return (
				<line
					x1={figure.parameters.points[0].x}
					y1={figure.parameters.points[0].y}
					x2={figure.parameters.points[1].x}
					y2={figure.parameters.points[1].y}
					stroke={figure.color || '#878787'}
					strokeLinecap="square"
					strokeWidth={strokeWidth}
				/>
			)
		}
		case 'rectangle': {
			return (
				<rect
					fill={figure.color || 'transparent'}
					stroke={figure.color || '#878787'}
					x={figure.parameters.corners.ulc.x}
					y={figure.parameters.corners.ulc.y}
					width={figure.parameters.width}
					height={figure.parameters.height}
					strokeWidth={strokeWidth}
				/>
			)
		}
		default: {
			throw new Error('Undefined figure found');
		}
	}
};

export default SvgFigure;
