xquery version "1.0";

import module namespace json="http://www.json.org";

declare option exist:serialize "method=text media-type=text/plain";

declare variable $base := request:get-parameter('base', ());
declare variable $baseCollection := collection($base);

declare function local:get-categories($queryStr as xs:string) as element()*
{
	let $reference := $baseCollection//reference
	let $markupCategories := $reference//markupCategory
	for $markupCategory in $markupCategories[contains(string(@name), $queryStr)]
	return 
		<markupCategory>{$markupCategory/@id, attribute {"name"} { replace($markupCategory/@name, '"', '') }}</markupCategory>
};

let $queryStr := request:get-parameter('queryStr', ())

let $xml := 
	<results>
	{
		local:get-categories($queryStr)
	}
	</results>

return json:xml-to-json($xml)

