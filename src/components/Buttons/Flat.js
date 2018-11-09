import React from 'react';
import classNames from 'classnames';
import './Flat.css'

const FlatButton = ({ children, onClick, color }) => {
	const isAvailableColor = (color) => !!color && ['dark', 'green', 'blue', 'salmon'].includes(color);

	const btnClass = classNames({
		'flat-button': true,
		[`flat-button-${color}`]: isAvailableColor(color),
		'flat-button-regular': !color
	});

	return (
		<button className={btnClass} onClick={onClick}>{children}</button>
	);
};

export default FlatButton;
