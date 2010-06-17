SelectionManager = {

		// *** Instance Members *** //

		selectionObj : {	
							startNode : null,
							endNode : null,
							startOffset : 0,
							endOffset : -1  //endOffset =-1 means end of the node 
						},

		// *** Public Methods *** //

		select : function(){		//Mozilla specific code - based on selection API

			//get text nodes
			var selObj = this.selectionObj;
			var startTextNode = DOMUtils.getTextNodes(selObj.startNode)[0];
			var endNodeTextNodes = DOMUtils.getTextNodes(selObj.endNode)
			var endTextNode = endNodeTextNodes[endNodeTextNodes.length -1];
			var endOffset = selObj.endOffset
			if (endOffset == -1){
				endOffset = endTextNode.length;  //Convert the -1 value to the actual text length - to work with Mozilla range
			} 

			var sel = window.getSelection();
			var newRange = document.createRange();
			newRange.setStart(startTextNode, selObj.startOffset);
			newRange.setEnd(endTextNode, endOffset);
			sel.removeAllRanges();
			sel.addRange(newRange);
		},

		expandSelection : function() {		//Mozilla specific code - based on selection API

			var selection = window.getSelection();
			var range = selection.getRangeAt(0);
			var startNode = range.startContainer;
			var endNode = range.endContainer;

			//startElement and endElement must be either a segment or a heading element
			var startElement = DOMUtils.getFirstAncestorOrSelf(startNode, '.segment, .heading');
			var endElement = DOMUtils.getFirstAncestorOrSelf(endNode, '.segment, .heading');
			var startSegment = null;
			var endSegment = null;
			var startOffset = 0;
			var endOffset = -1;  //setting endOffset to -1 means we will set the range to the end of the element

      this._rangeToFullWords(range);

      //JQuery objects are stored as array it seems. Comparing two JQuery objects
      //using normal comparators won't work. 
      //http://chris-barr.com/entry/comparing_jquery_objects/
			if ( DOMUtils.is(startElement, '.segment') && startElement[0] === endElement[0]) {
			//selection starts and ends in a single segment

				startOffset = range.startOffset;
				endOffset = range.endOffset;
				var startContent = DOMUtils.getFirstAncestorOrSelf(startNode, '.content');
				var endContent = DOMUtils.getFirstAncestorOrSelf(endNode, '.content');
				this.selectionObj = { 	
										startNode : startContent, 
										endNode : endContent, 
										startOffset : startOffset, 
										endOffset : endOffset 
									};

				this._expandAccordingToSuperContents();
				this.select();
				return;
			} else if ( DOMUtils.is(startElement, '.heading') ){
			//selection starts in a header

				var startParentSuperSegment = DOMUtils.getFirstAncestorOrSelf(startNode, '.superSegment');
				startSegment = DOMUtils.getDescendantsAndSelf(startParentSuperSegment, '.segment');	
				endSegment = DOMUtils.getDescendantsAndSelf(startParentSuperSegment, '.segment');	

				if ( !DOMUtils.contains(startParentSuperSegment, endElement) ){
				  alert("selection ends outside parent superSegment.");
				//selection ends outside parent superSegment 
					if ( DOMUtils.is(endElement, '.segment') ){
						endSegment = endElement;	
					} else {
					//endElement is heading
						endSegment = DOMUtils.getNextAdjacentSibling(endElement, '.segment'); //We will expand it later
					}				
				}
			} else {
			//selection does not start in a header				
				startSegment = DOMUtils.getFirstAncestorOrSelf(startNode, '.segment');
				endSegment = DOMUtils.getFirstAncestorOrSelf(endNode, '.segment');

				if ( DOMUtils.is(endElement, '.heading') ){
				//endElement is heading
					endSegment = DOMUtils.getNextAdjacentSibling(endElement, '.segment'); //We will expand it later
				}
			}
			
			this.selectionObj = { 	
									startNode : startSegment, 
									endNode : endSegment, 
									startOffset : startOffset, 
									endOffset : endOffset 
								};

			this._expandAccordingToHierarchy('segment');
			this.select();
		},

		
		// *** Private Methods *** //

		_fireSelectionChangeEvent : function(e){

			this.fire('selectionChange');
		},

		_rangeToFullWords : function(range){
			var startNode = range.startContainer;
			var endNode = range.endContainer;
			var startNodeText = DOMUtils.getText(startNode);
			var endNodeText = DOMUtils.getText(endNode);
			if (!range.collapsed) {
				//removes leading spaces from range
				while(range.toString().charAt(0) == " ") {
					range.setStart(startNode, range.startOffset + 1);
				}
				//removes trailing spaces from range
				while(range.toString().charAt(range.toString().length - 1) == " ") {
					range.setEnd(endNode, range.endOffset - 1);
				}
				//expands range to include whole first word
				while(range.startOffset > 0 && range.toString().charAt(0) != " " && startNodeText.charAt(range.startOffset - 1) != " ") {
					range.setStart(startNode, range.startOffset - 1);
				}
				//expands range to include full last word
				while(range.endOffset < endNodeText.length && range.toString().charAt(range.toString().length - 1) != " " && endNodeText.charAt(range.endOffset) != " ") {
					range.setEnd(endNode, range.endOffset + 1);
				}
			}
		},

		_expandAccordingToSuperContents : function(){

			var selObj = this.selectionObj;
			this._expandAccordingToHierarchy('content');
			var ancestorSiblings = DOMUtils.getCorrespondingAncestorSiblings(selObj.startNode, selObj.endNode);
			if ( DOMUtils.is(ancestorSiblings[0], '.superContent') ){
				selObj.startOffset = 0;
			}
			if ( DOMUtils.is(ancestorSiblings[ancestorSiblings.length - 1], '.superContent') ){
				selObj.endOffset = -1;
			}
		},

		_expandAccordingToHierarchy : function(nodeClass) {

			var selObj = this.selectionObj;
			var ancestorSiblings = DOMUtils.getCorrespondingAncestorSiblings(selObj.startNode, selObj.endNode);
			var firstElement = DOMUtils.getDescendantsAndSelf(ancestorSiblings[0], '.' + nodeClass);
			var lastSiblingDescendants = DOMUtils.getDescendantsAndSelf(ancestorSiblings[ancestorSiblings.length - 1], '.' + nodeClass);
			var lastElement = lastSiblingDescendants[lastSiblingDescendants.length - 1];
			selObj.startNode = firstElement;
			selObj.endNode = lastElement;
		}
	}