import { drawerConstants } from '../constants'

const startDrawerLoading = () => ({ type: drawerConstants.START_DRAWER_LOADING });
const stopDrawerLoading = () => ({ type: drawerConstants.STOP_DRAWER_LOADING });
const setCanvas = (canvas, matrix) => ({ type: drawerConstants.SET_DRAWER_CANVAS, payload: { canvas, matrix } });
const addDrawerFigure = (figure) => ({ type: drawerConstants.ADD_DRAWER_FIGURE, payload: { figure } });
const updateCanvasMatrix = (figure) => ({
	type: drawerConstants.UPDATE_CANVAS_MATRIX,
	payload: {
		matrixPoints: figure.parameters.matrixPoints,
		figureId: figure.id,
	}
});
const setBackroundColor = (backgroundColor) => ({
	type: drawerConstants.SET_BACKGROUND_COLOR,
	payload: { backgroundColor }
});
const setFigureColor = (figureId, color) => ({
	type: drawerConstants.SET_FIGURE_COLOR,
	payload: { figureId, color }
});
const resetDrawer = () => ({ type: drawerConstants.RESET_DRAWER });

export const drawerActions = {
	startDrawerLoading,
	stopDrawerLoading,
	setCanvas,
	addDrawerFigure,
	updateCanvasMatrix,
	setBackroundColor,
	setFigureColor,
	resetDrawer,
};
