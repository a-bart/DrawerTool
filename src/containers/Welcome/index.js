import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { drawerActions } from 'src/core/actions';
import FileUpload from 'src/components/FileUpload';
import './styles.css'

class Welcome extends Component {
	render() {
		const { onFileUpload } = this.props;
		return (
			<div className='welcome'>
				<FileUpload uploadFile={onFileUpload} />
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
)(Welcome);
