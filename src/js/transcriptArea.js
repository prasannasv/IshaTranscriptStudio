TranscriptArea = {

	_loadSessionXMLXquery: 'getSessionHTML.xql',


	// *** Public Methods *** //

	loadSessionHTML: function(dbManager, sessionId) {
		var params = { sessionId : sessionId };
		dbManager.executeXQuery(this._loadSessionXMLXquery, params, 'xml', this._onLoadSuccess, this._onLoadFailure);
	},

	// *** Private Methods *** //

	_onLoadSuccess : function(id, o, args){

		$("#transcript").html(args.responseText);
	},

	_onLoadFailure : function(id, o, args){},
}
