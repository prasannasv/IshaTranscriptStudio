YUI.add('sessionSelector', function(Y){

	var SessionSelector;

	SessionSelector = function(config){

		SessionSelector.superclass.constructor.apply(this, arguments);

	};

	Y.extend(SessionSelector, Y.Base, {

		// *** Instance Members *** //

		sessionId : 'm-57-1',

		// *** Base Methods *** //

		initializer : function(config){

			Y.one('#load-button').on("click", this._fireSessionRequestEvent, this);

		},

		destructor : function(){},

		// *** Public Methods *** //

		render : function(elementId){
			//var containerNode = Y.Node.one('#'+elementId);
			//var form = '';
			//containerNode.append(form);
		},

		// *** Private Methods *** //

		_fireSessionRequestEvent : function(e){

			this.fire('sessionRequest', { sessionId : this.sessionId });
		}

	});

	Y.namespace('Ts4isha');
	
	Y.Ts4isha.SessionSelector = SessionSelector;

});
