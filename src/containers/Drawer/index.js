import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { drawerActions } from 'src/core/actions';

import FlatButton from 'src/components/Buttons/Flat';
import SvgFigure from 'src/components/SvgFigure';
import './styles.css'

class Drawer extends Component {
	state = {
		windowWidth: 0,
		windowHeight: 0,
		increaseLevel: 1,
	};

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions = () => {
		this.setState(
			() => ({ windowWidth: window.innerWidth, windowHeight: window.innerHeight }),
			() => this.calculateInceraseLevel()
		);
	};

	calculateInceraseLevel = () => {
		const { windowWidth } = this.state;
		const { canvas } = this.props;

		const padding = windowWidth * 0.05; // 5%
		let increaseLevel = (windowWidth - padding * 2) / canvas.parameters.width;
		if (increaseLevel >= 1) {
			increaseLevel = Math.floor(increaseLevel);
		} else {
			increaseLevel = increaseLevel.toFixed(1);
		}

		this.setState({ increaseLevel });
	};

	handleResetDrawer = () => {
		const { actions } = this.props;
		actions.resetDrawer();
	};

	render() {
		const { canvas, strokeWidth, figures, backgroundColor } = this.props;
		const { increaseLevel } = this.state;

		return (
			<div className='drawer-container'>
				<svg
					className='drawer-box'
					style={{ backgroundColor }}
					width={canvas.parameters.width * increaseLevel}
					height={canvas.parameters.height * increaseLevel}
					viewBox={`0 0 ${canvas.parameters.width} ${canvas.parameters.height}`}
				>
					{!!(figures && figures.length) && figures.map(
						figure => <SvgFigure key={figure.id} figure={figure} strokeWidth={strokeWidth} />
					)}
				</svg>
				<FlatButton onClick={this.handleResetDrawer} color='dark'>reset</FlatButton>
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
)(Drawer);
