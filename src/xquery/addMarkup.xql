xquery version "1.0";

import module namespace json="http://www.json.org";

declare option exist:serialize "method=text media-type=text/plain";

declare variable $base := request:get-parameter('base', ());
declare variable $baseCollection := collection($base);

(: http://www.w3schools.com/Xpath/xpath_functions.asp :)
declare function local:getMaxContentNodeId($session) as xs:double
{
   fn:max(for $id in $session//content/@id
        return fn:number(fn:substring($id, 2)))
};

(: Handle the case where there are no superContent or superSegements in the file :)
declare function local:getMaxSuperSegmentNodeId($session) as xs:double
{
   fn:max(for $id in $session//superSegment/@id
        return fn:number(fn:substring($id, 2)))
};

declare function local:getMaxSuperContentNodeId($session) as xs:double
{
   fn:max(for $id in $session//superContent/@id
        return fn:number(fn:substring($id, 2)))
};

declare function local:getMaxMarkupNodeId($session) as xs:double
{
   fn:max((local:getMaxSuperContentNodeId($session), local:getMaxSuperSegmentNodeId($session)))
};

declare function local:wrapNodes()
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
let $startOffset := fn:number(request:get-parameter('startOffset', ()))
let $endOffset := fn:number(request:get-parameter('endOffset', ()))

let $session := $baseCollection//session[@id eq $sessionId]
let $startNode := $session//element()[@id eq $startNodeId]
let $endNode := $session//element()[@id eq $endNodeId]

return 
    if ($startNodeId eq $endNodeId) then (
      (: From:<segment type="paragraph" id="s50" speaker="sadhguru" lastAction="proofed" lastActionAt="2009-01-03T00:00:00" lastActionBy="amit, chitra"> :)
      (: To   <segment type="paragraph" id="s50" speaker="sadhguru" lastAction="modified" lastActionAt="2010-06-13T14:17:17" lastActionBy="admin"> :)

      let $currentMaxContentNodeId := local:getMaxContentNodeId($session)
      let $currentMaxMarkupId := local:getMaxMarkupNodeId($session)
      
      let $preSuperContentNodeId := fn:concat("c", $currentMaxContentNodeId + 1)
      let $superContentNodeId := fn:concat("c", $currentMaxContentNodeId + 2)
      let $postSuperContentNodeId := fn:concat("c", $currentMaxContentNodeId + 3)
      
      let $superContentMarkupId := fn:concat("m", $currentMaxMarkupId + 1)
      
      return update replace $startNode with
        <segment type="{$startNode/@type}" id="{$startNode/@id}" speaker="{$startNode/@speaker}" lastAction="modified" lastActionAt="{fn:current-dateTime()}">
          (: TODO - 1. Find if this tag has any contents. 2. If the segment already contains another superContent before this selection, take that into account. :)
          <content id="{$preSuperContentNodeId}">{fn:substring($startNode, 1, $startOffset)}</content>
          <superContent id="{$superContentMarkupId}" lastAction="modified" lastActionAt="{fn:current-dateTime()}">
            <tag type="markupType" value="quote" />
            <content id="{$superContentNodeId}">{fn:substring($startNode, $startOffset, $endOffset - $startOffset + 1)}</content>
          </superContent>
          <content id="{$postSuperContentNodeId}">{fn:substring($startNode, $endOffset + 1)}</content>
        </segment>
    )
    else (
    )
