TS.SessionModel = {

	sessionModelXquery : 'sessionModel.xql',

	addMarkup : function(dbManager, params, successFunc, failureFunc) {},

	removeMarkup : function(dbManager, params, successFunc, failureFunc) {},

	modifyMarkup : function(dbManager, params, successFunc, failureFunc) {},

	nudgeSegment : function(dbManager, params, successFunc, failureFunc) {},

	splitSegment : function(dbManager, params, successFunc, failureFunc) {},

	mergeSegment : function(dbManager, params, successFunc, failureFunc) {},

	modifySegment : function(dbManager, params, successFunc, failureFunc) {},

	deleteSegment : function(event, dbManager, params, successFunc, failureFunc) {

		//Check for required selection obj properties
		dbManager.executeXquery(sessionModelXquery, selection, successFunc, failureFunc){

	}
}
