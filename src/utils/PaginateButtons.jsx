import React from "react";

const PaginateButtons = props => {
	const {text, clickHandler, isDisabled, isActive} = props;
	return (
		<input
			type="button"
			value={text}
			onClick={clickHandler}
			disabled={isDisabled || isActive === +text}
			className={`px-10px mr-9px rounded-sm outline-none font-calibre flex justify-center items-center mt-5 h-30px ${
				text === "\u00AB" || text === "\u00BB"
					? "bg-gray-400 text-24px"
					: "bg-gray-200"
			} ${
				isActive === +text
					? "bg-gray-800 text-gray-300"
					: "bg-gray-400 text-gray-800"
			} ${
				isDisabled || isActive === +text
					? "cursor-not-allowed"
					: "cursor-pointer"
			}`}
		/>
	);
};

export default PaginateButtons;
