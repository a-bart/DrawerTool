import { drawerConstants } from '../constants'

const initialState = {
	loading: false,
	canvas: null,
	matrix: [],
	figures: [],
	strokeWidth: 1,
	backgroundColor: 'transparent'
};

const initialStateBase = Object.assign({}, initialState);

export function drawer(state = initialState, action) {
	switch (action.type) {
		case drawerConstants.START_DRAWER_LOADING: {
			return {
				...state,
				loading: true,
			}
		}
		case drawerConstants.STOP_DRAWER_LOADING: {
			return {
				...state,
				loading: false,
			}
		}
		case drawerConstants.SET_DRAWER_CANVAS: {
			return {
				...state,
				canvas: action.payload.canvas,
				matrix: action.payload.matrix,
			}
		}
		case drawerConstants.UPDATE_CANVAS_MATRIX: {
			return {
				...state,
				matrix: state.matrix.map((xLine, x) => action.payload.matrixPoints.some(p => p[0] === x) ?
					xLine.map((matrixCell, y) => action.payload.matrixPoints.some(p => p[0] === x && p[1] === y) ? matrixCell ? {
							figureIdStack: matrixCell.figureIdStack.concat([action.payload.figureId])
						} : {
							figureIdStack: [action.payload.figureId]
						} : matrixCell) : xLine)
			}
		}
		case drawerConstants.ADD_DRAWER_FIGURE: {
			return {
				...state,
				figures: state.figures.concat([action.payload.figure])
			}
		}
		case drawerConstants.SET_FIGURE_COLOR: {
			return {
				...state,
				figures: state.figures.map(figure => figure.id === action.payload.figureId ? {
					...figure,
					color: action.payload.color,
				} : figure)
			}
		}
		case drawerConstants.SET_BACKGROUND_COLOR: {
			return {
				...state,
				backgroundColor: action.payload.backgroundColor
			}
		}
		case drawerConstants.CHANGE_STROKE_WIDTH: {
			return {
				...state,
				strokeWidth: action.payload.strokeWidth
			}
		}
		case drawerConstants.RESET_DRAWER: {
			return Object.assign({}, initialStateBase);
		}
		default:
			return state
	}
}
