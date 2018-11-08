import React from 'react';

const FileUpload = ({ uploadFile }) => {
	return (
		<div className='upload-expense'>
			<input type='file'
			       id='file'
			       className='input-file'
			       accept='.txt'
			       onChange={e => uploadFile(e.target.files[0])}
			/>
		</div>
	)
};

export default FileUpload;
