DatabaseManager = {

// *** Static *** //

	EXIST_URL: 'http://localhost:8080/exist',
	XQUERY_PATH: '/ts4isha/xquery',
	XSLT_PATH: '/ts4isha/xslt',
	BASE_COLLECTION_PATH: '/db/ts4isha',
	//DATA_COLLECTION_PATH: BASE_COLLECTION_PATH + '/data',
	//REFERENCE_COLLECTION_PATH: BASE_COLLECTION_PATH + '/reference',

// *** Public ***//

	executeXQuery: function(xqueryFile, params, resultFormat, successFunc, failureFunc){

		$.ajax({url: this.EXIST_URL + this.XQUERY_PATH + '/' + xqueryFile,
			data: params,
			type: 'POST',
			async: true,
			dataType: resultFormat,
			success: successFunc,
			error: failureFunc
		});
	}
}
