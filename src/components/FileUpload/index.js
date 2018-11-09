import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import FlatButton from 'src/components/Buttons/Flat';

export default class FileUpload extends Component {
	openFileDialog = () => {
		const fileUploadDom = ReactDOM.findDOMNode(this._inputFile);
		fileUploadDom.click();
	};

	render() {
		const { uploadFile } = this.props;

		return (
			<div className='upload-expense'>
				<input
					ref={(node) => { this._inputFile = node; }}
					style={{ display: 'none' }}
					type='file'
					accept='.txt'
					onChange={e => uploadFile(e.target.files[0])}
					onClick={(event)=> {
						event.target.value = null
					}}
				/>
				<FlatButton onClick={this.openFileDialog} color='blue'>Upload Draw Instructions</FlatButton>
			</div>
		)
	}
};
