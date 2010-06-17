YUI.add('ts4isha', function(Y){

	var Ts4isha;

	Ts4isha = function(config){

		Ts4isha.superclass.constructor.apply(this, arguments);

	};

	Y.extend(Ts4isha, Y.Base, {

		// *** Instance Members *** //

		_dbManager : null,
		_refManager : null,
		_sessionSelector : null,
		_menu : null,		
		_transcriptArea : null,
		_transcriptContextMenu : null,
		_tree : null,
		_markupOverlay : null,

		// *** Base Methods *** //

		initializer : function(config){

			this._dbManager = new Y.Ts4isha.DatabaseManager();
			//this._refManager = new Y.Ts4isha.ReferenceManager();
			this._transcriptArea = new Y.Ts4isha.TranscriptArea();
			this._sessionSelector = new Y.Ts4isha.SessionSelector();
			this._transcriptContextMenu = new Y.Ts4isha.TranscriptContextMenu();
			this._markupDialog = new Y.Ts4isha.MarkupDialog();
			
			//this._refManager.loadReferences(this._dbManager);
			//this._sessionSelector.render('session-selector');

			// *** Event Wiring *** //
			
			this._sessionSelector.on('sessionRequest', Y.bind(this._transcriptArea.loadSessionHTML, this._transcriptArea, this._dbManager, 'm-57-1'));
			this._transcriptArea.on('selectionChange', Y.bind(this._transcriptArea.selection.expandSelection, this._transcriptArea.selection));		
			this._transcriptContextMenu.on('markup', Y.bind(this.addMarkup, this));		
		},

		destructor : function(){},

		// *** Public Methods *** //

		addMarkup : function(){

			var params = { 
							startNodeId = "",
							endNodeId = "",
							startOffset = "",
							endOffset = ""
						};

			_dbManager.executeXQuery('addMarkup.xql', params, "text", _addMarkupSuccess, _addMarkupFailure){
		},

		// *** Private Methods *** //

		_addMarkupSuccess : function(){
			alert('addmarkup successful!);
		},

		_addMarkupSuccess : function(){
			alert('addmarkup failed!);
		},

		_showMarkupDialog : function(){

			
//don't use overlay show() method directly. wrap it in method which preserves users selection, and then reselects it
			this._overlay.show();
			

		}
		
	});

	Y.namespace('Ts4isha');
	
	Y.Ts4isha.Application = Ts4isha;

}, '0.0.1', {requires:['oop', 'base', 'node', 'databaseManager', 'referenceManager', 'transcriptArea', 'transcriptContextMenu', 'sessionSelector', 'markupDialog']});