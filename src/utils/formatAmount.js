const formatAmount = num => {
	const formatted = num.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	return formatted;
};

export default formatAmount;
