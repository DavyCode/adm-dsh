/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import PaginateButtons from "./PaginateButtons.jsx";

const AppPagination = props => {
	const {
		onpageChange,
		totalPages,
		prevDisabled,
		pageCount,
		nextDisabled
	} = props;

	const generateArray = () => {
		const newArray = [];
		newArray.push(
			<PaginateButtons
				text={"\u00AB"}
				clickHandler={onpageChange}
				isDisabled={prevDisabled}
				key={totalPages + 4}
			/>
		);
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) {
				newArray.push(
					<PaginateButtons
						text={i}
						clickHandler={onpageChange}
						key={i}
						isActive={pageCount}
					/>
				);
			}
		} else {
			if (pageCount > 3) {
				newArray.push(
					<PaginateButtons
						text={1}
						clickHandler={onpageChange}
						key={1}
						isActive={pageCount}
					/>,
					<PaginateButtons
						text="..."
						isDisabled={true}
						clickHandler={onpageChange}
						key={totalPages + 1}
					/>
				);
				if (totalPages - pageCount >= 3) {
					for (let i = pageCount - 1; i <= pageCount + 2; i++) {
						newArray.push(
							<PaginateButtons
								text={i}
								clickHandler={onpageChange}
								key={i}
								isActive={pageCount}
							/>
						);
					}
					newArray.push(
						<PaginateButtons
							text="..."
							isDisabled={true}
							clickHandler={onpageChange}
							key={totalPages + 2}
						/>,
						<PaginateButtons
							text={totalPages}
							clickHandler={onpageChange}
							key={totalPages}
							isActive={pageCount}
						/>
					);
				} else {
				}
				if (totalPages - pageCount <= 2) {
					for (let i = pageCount - 2; i <= totalPages; i++) {
						newArray.push(
							<PaginateButtons
								text={i}
								clickHandler={onpageChange}
								key={i}
								isActive={pageCount}
							/>
						);
					}
				}
			} else {
				for (let i = 1; i <= pageCount + 3; i++) {
					newArray.push(
						<PaginateButtons
							text={i}
							clickHandler={onpageChange}
							key={i}
							isActive={pageCount}
						/>
					);
				}
				newArray.push(
					<PaginateButtons
						text="..."
						isDisabled={true}
						clickHandler={onpageChange}
						key={totalPages + 3}
					/>,
					<PaginateButtons
						text={totalPages}
						clickHandler={onpageChange}
						key={totalPages}
						isActive={pageCount}
					/>
				);
			}
		}
		newArray.push(
			<PaginateButtons
				text={`\u00BB`}
				clickHandler={onpageChange}
				isDisabled={nextDisabled}
				key={totalPages + 5}
			/>
		);
		return newArray;
	};
	return (
		<section className="pb-20px text-center flex justify-center items-center">
			{generateArray()}
		</section>
	);
};

export default AppPagination;
