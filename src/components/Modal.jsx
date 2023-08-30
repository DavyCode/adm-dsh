import React from "react";
import styles from "../styles/style.less";

const Modal = props => {
	const {children} = props;
	return (
		<div className="modalContainer" {...props}>
			<div>{children}</div>
		</div>
	);
};

export default Modal;
