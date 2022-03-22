/**
 * Returns a FormData with the data passed by parameters. If no parameter is given it will return an empty FormData.
 * @param {HTMLElement} form - form element with data(optional)
 * @param {object} data - object with data(optional)
 */
function createFormData({
	form: form,
	data: data
}){
	
	if(form && typeof form !== 'object'){
		
		throw new Error(`Invalid data type for form`);
	}
	
	if(data && typeof data !== 'object'){
		
		throw new Error(`Invalid data type for data`);
	}
	
	// Create FormData
	const formData = new FormData(form) || new FormData();
	
	// Append each data to FormData
	data && Object.entries(data).map(([key, value]) =>
					 
		formData.append(key, value)
	);
	
	// Return FormData
	return formData;
}


/**
 * JavaScript fetch with JQuery Ajax similiar syntax
 * @param {string} path - file path or url to fetch
 * @param {string} method - PHP method: GET(default) or POST
 * @param {FormData} formData - FormData for fetch's body(optional)
 * @param {HTMLElement} form - form element with datas for fetch's body(optional)
 * @param {object} data - datas for fetch's body(optional)
 * @param {string} dataType - response's data type: auto(default), json, blob or text
 */
async function fetchRequest({
	path: path,
	method: method,
	formData: formData,
	form: form,
	data: data,
	dataType: dataType
}){
	
	// Get fetch response
	const res = await fetch(path, {
		
		method: method || 'GET',
		body: formData || createFormData({
			form: form,
			data: data
		})
	});
	
	// Verify for HTTP error
	if(!res.ok){
		
		throw new Error(`HTTP ERROR: ${res.status}`);
	}
	
	// Get content from fetch response
	const decrypted_res = (
		!dataType || dataType === 'auto'
			? await res.json() || await res.blob() || await res.text() || function(){throw new Error('Failed to detect data type')}
			: (
				dataType === 'json'
					? await res.json()
					: (
						dataType === 'blob'
							? await res.blob()
							: (
								dataType === 'text'
									? await res.text()
									: function(){throw new Error(`Data type ${dataType} couldn't be decrypted`)}
							)
					)
			)
	);
	
	// Verify for error on decryption
	typeof decrypted_res === 'function' && decrypted_res();
	
	//return decrypted response
	return decrypted_res;
}
