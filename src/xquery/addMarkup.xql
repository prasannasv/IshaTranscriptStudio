xquery version "1.0";

import module namespace json="http://www.json.org";

declare option exist:serialize "method=text media-type=text/plain";

declare variable $base := request:get-parameter('base', ());
declare variable $baseCollection := collection($base);

declare function local:wrapNodes(element()*, ) as element()*
{
	let $reference := $baseCollection//reference
	let $markupCategories := $reference//markupCategory
	for $markupCategory in $markupCategories[contains(string(@name), $queryStr)]
	return 
		<markupCategory>{$markupCategory/@id, attribute {"name"} { replace($markupCategory/@name, '"', '') }}</markupCategory>
};

let $sessionId := request:get-parameter('sessionId', ())
let $startNodeId := request:get-parameter('startNodeId', ())
let $endNodeId := request:get-parameter('endNodeId', ())
let $startOffset := request:get-parameter('startOffset', ())
let $endOffset := request:get-parameter('endOffset', ())

let $session := $baseCollection//session[@id eq $sessionId]
let $startNode := $session//node()*[@id eq $startNodeId]
let $endNode := $session//node()*[@id eq $endNodeId]

let $originalXML :=
	if ($markupClass == "outline"){
		
	}

(# exist:batch-transaction #) {


	update replace $orginalXML with $newXML
 
}
