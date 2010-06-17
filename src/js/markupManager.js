MarkupManager = {

  _addMarkupManagerXQuery: 'addMarkup.xql',

  // *** Public Methods *** //

  addMarkup: function(dbManager, sessionId, selectionRange) {
    var params = { sessionId : sessionId,
      startNodeId : $(selectionRange.startContainer.parentNode.parentNode).attr("id"),
      startOffset : selectionRange.startOffset,
      endNodeId : $(selectionRange.endContainer.parentNode.parentNode).attr('id'),
      endOffset : selectionRange.endOffset };
      
    dbManager.executeXQuery(this._addMarkupManagerXQuery, params, 'xml', this._onLoadSuccess, this._onLoadFailure);
  },

  // *** Private Methods *** //

  _onLoadSuccess : function(id, o, args) {},

  _onLoadFailure : function(id, o, args) {},

}
