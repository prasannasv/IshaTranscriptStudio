TS.SessionController = {

	bindEvents : function() {

		var model = TS.SessionModel;
		var selection = TS.SessionSelection;

		//Bind Session to DB Requests
		$('#session').bind('requestAddMarkup', model.addMarkup)
					.bind('requestRemoveMarkup', model.removeMarkup)
					.bind('requestModifyMarkup', model.modifyMarkup)
					.bind('requestNudgeSegment', model.nudgeSegment)
					.bind('requestSplitSegment', model.splitSegment)
					.bind('requestmergeSegments', model.mergeSegment)
					.bind('requestModifySegment', model.modifySegment)
					.bind('requestDeleteSegment', model.deleteSegment);

		//Bind Session Context Menu Items to 'Request' Events, passing selection object
		$('#addMarkup').bind('click', $session.trigger('requestAddMarkup', [selection])); 
		$('#removeMarkup').bind('click', $session.trigger('requestRemoveMarkup', [selection])); 
		$('#modifyMarkup').bind('click', $session.trigger('requestModifyMarkup', [selection])); 
		$('#nudgeSegment').bind('click', $session.trigger('requestNudgeSegment', [selection])); 
		$('#splitSegment').bind('click', $session.trigger('requestSplitSegment', [selection])); 
		$('#mergeSegments').bind('click', $session.trigger('requestMergeSegments', [selection])); 
		$('#editSegment').bind('click', $session.trigger('requestEditSegment', [selection])); 
		$('#deleteSegment').bind('click', $session.trigger('requestDeleteSegment', [selection])); 

	}
}



