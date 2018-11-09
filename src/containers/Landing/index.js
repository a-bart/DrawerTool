import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { drawerActions } from 'src/core/actions';
import { drawerServices } from 'src/core/services';
import { fileUtils, validationUtils } from 'src/utils';

import Welcome from '../Welcome';
import Drawer from '../Drawer';
import './styles.css'

class Landing extends Component {
	setCanvas = (parsedData) => {
		const { actions } = this.props;

		const canvas = parsedData.find(el => el.type === 'canvas');
		const matrix = drawerServices.createCanvasMatrix(canvas.parameters.width, canvas.parameters.height);
		actions.setCanvas(canvas, matrix);
	};

	addFigures = (parsedData) => {
		const { actions } = this.props;

		const figures = parsedData.filter(validationUtils.isFigure);
		if (figures.length) {
			figures.forEach((figure, index) => {
				figure.id = index + 1;
				actions.addDrawerFigure(figure);
				actions.updateCanvasMatrix(figure);
			});
		}
	};

	setBucketFill = (parsedData) => {
		const { actions, matrix } = this.props;

		// suppose parsed data contains only one "bucketfill" command
		const bucketFill = parsedData.find(el => el.type === 'bucketfill');
		if (bucketFill) {
			const matrixPoint = matrix[bucketFill.parameters.point.x][bucketFill.parameters.point.y];
			if (matrixPoint && matrixPoint.figureIdStack && matrixPoint.figureIdStack.length) {
				// set color only for last item in matrix cell stack
				actions.setFigureColor(
					matrixPoint.figureIdStack[matrixPoint.figureIdStack.length - 1],
					bucketFill.parameters.color
				);
			} else {
				actions.setBackroundColor(bucketFill.parameters.color);
			}
		}
	};

	onFileUpload = async (file) => {
		const { actions } = this.props;

		actions.startDrawerLoading();
		try {
			const content = await fileUtils.uploadFile(file);
			const parsedData = drawerServices.parseInputFile(content);
			validationUtils.validateParsedData(parsedData);

			this.setCanvas(parsedData);
			this.addFigures(parsedData);
			this.setBucketFill(parsedData);
		} catch (err) {
			// todo: display error
			console.error(err);
		}
		actions.stopDrawerLoading();
	};

	render() {
		const { loading, canvas } = this.props;

		return (
			<div className='landing'>
				{loading ? (
					<div>loading...</div>
				) : (
				<React.Fragment>
					{!!canvas ? (
						<Drawer />
					) : (
						<Welcome onFileUpload={this.onFileUpload} />
					)}
				</React.Fragment>
				)}
			</div>
		);
	}
}

export default connect(
	state => ({
		...state.drawer,
	}),
	dispatch => ({ actions: bindActionCreators({
			...drawerActions
		}, dispatch ) })
)(Landing);
