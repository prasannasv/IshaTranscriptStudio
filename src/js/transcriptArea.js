TranscriptArea = {

	//node: $('#TranscriptArea'),
	_loadSessionXMLXquery: 'getSessionHTML.xql',


	// *** Public Methods *** //

	loadSessionHTML: function(dbManager, sessionId) {
		var params = { sessionId : sessionId };
		dbManager.executeXQuery(this._loadSessionXMLXquery, params, 'xml', this._onLoadSuccess, this._onLoadFailure);
	},

	displayTranscript: function(transcriptHTML){
		$("div#transcript").html(transcriptHTML);
	},


	// *** Private Methods *** //

	_onLoadSuccess : function(id, o, args){

		$("#transcript").html(args.responseText);
		//displayTranscript(o.responseText);		

	},

	_onLoadFailure : function(id, o, args){},

	//_fireSelectionChangeEvent : function(e){

	//	this.fire('selectionChange');
	//}

}
