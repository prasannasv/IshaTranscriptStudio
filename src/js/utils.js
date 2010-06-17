TS.DOMUtils = {

	is : function($element, selector){
		return element.is(selector);
	},

	contains : function($element1, $element2){
		return $element1.has($element2);
	},

	getFirstAncestorOrSelf : function($element, selector){
		var $result = $element.closest(selector);
		return $result;
	},

	getDescendantsAndSelf : function($element, selector){
		var $result = $element.find('*').andSelf().filter(selector);
		return $result;
	},

	getNextAdjacentSibling : function($element, selector){
		var $result = $element.next().filter(selector);
		return $result;
	},

	getLastAncestorOrSelf : function($element, selector){
		var ancestors = getAncestorsAndSelf($element, selector);
		return ancestors.last();
	},

	getAncestorsAndSelf : function($element, selector){ //Returns elements in document order
		if ( typeof selector === 'undefined' ){
			selector = '*';
		}
		var $result = $element.parents().andSelf().filter(selector);
		return $result; 
	},

	getSiblingsBetweenAndSelves : function($firstSibling, $lastSibling){
		var firstSiblingIndex = $firstSibling.index();
		var lastSiblingIndex = $lastSibling.index();
		var $result = $firstSibling.parent().children().slice(firstSiblingIndex, lastSiblingIndex +1);
		return $result;
	},

	getCorrespondingAncestorSiblings : function($startElement, $endElement){
		if ($startElement.filter($endElement).length > 0){ //Then they are the same element
			return $startElement;
		} else {
			var $startAncestors = getAncestorsAndSelf($startElement);
			var $endAncestors = getAncestorsAndSelf($endElement);
			if ($startAncestors[0] !== $endAncestors[0]){
				return null;
			} else {
				for (var i = 0; i < Math.min($startAncestors.length, $endAncestors.length); i++){
					if ($startAncestors[i] !== $endAncestors[i]){
						return getSiblingsBetweenAndSelves($startAncestors[i], $endAncestors[i]);
					}
				}
			}
		}		
	},

	getTextNodes : function($element){ //Returns all descendant text nodes
		var result = [];
		$element.contents().each(function(){
			var fn = arguments.callee;
			if (this.nodeType == 3){ 
				result.push(this);
			} else {
				$(this).contents().each(fn);
			}
		});
		return result;
	},

	getText = function($element){ 
		return $element.text();
	}

}
