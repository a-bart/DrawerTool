import React, { Component } from 'react';
import './styles.css'

export default class Error extends Component {
	render() {
		const { err } = this.props;

		return (
			<div className='error-container'>
				{err && err.message && (
					<p className='error-text'>{err.message}</p>
				)}
			</div>
		)
	}
};
