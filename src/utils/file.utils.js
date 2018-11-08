const uploadFile = (file) => new Promise((res, rej) => {
	const handleFileReadSuccess = event => res(event.target.result);
	const handleFileReadError = event => rej(new Error(`File read error, code: ${event.target.error.code}`));

	const fileReader = new FileReader();
	fileReader.onload = handleFileReadSuccess;
	fileReader.onerror = handleFileReadError;
	fileReader.readAsText(file);
});

export const fileUtils = {
	uploadFile,
};
