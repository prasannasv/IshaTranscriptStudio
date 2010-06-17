xquery version "1.0";

declare option exist:serialize "method=xml media-type=text/xml";

declare variable $base := request:get-parameter('base', ());
declare variable $baseCollection := collection($base);

declare function local:tagsToDataAttrs($tags as element()*) as attribute()*
{
    for $tagtype in distinct-values($tags/@type)
    return
        attribute { concat('data-', $tagtype) } { $tags[@type = $tagtype]/@value }
};


declare function local:getNonIdDataAttrs($element as element()) as attribute()*
{
	for $attr in $element/@*
		return
			if ( local-name($attr) ne 'id' ) then
				attribute { concat('data-', local-name($attr)) } { string($attr) }
			else
				()
};


declare function local:generateHeading($markup as element()) as element()
{
	let $reference := $baseCollection//reference
	let $markupTypeId := $markup/tag[@type eq 'markupType']/string(@value)
	let $markupType := $reference//markupType[@id eq $markupTypeId]/string(@name)
	let $markupCategoryId := $markup/tag[@type eq 'markupCategory']/string(@value)
	let $markupCategory := $reference//markupCategory[@id eq $markupCategoryId]/string(@name)
	return
		<div class="heading"> 
			<img src="assets/{$markupTypeId}.png"/>
			{ concat($markupType, ': ', $markupCategory) }
		</div>
};


declare function local:xmlToHtml($child as element()) as element()?
{
	let $id := $child/string(@id)
	let $class := local-name($child)
	let $tags := $child/tag
	let $html:=
		if ($class eq 'superSegment') then 
			element div { 	
							attribute id {$id}, 
							attribute class {$class},
							local:getNonIdDataAttrs($child),
							local:tagsToDataAttrs($tags),
							local:generateHeading($child),  
							for $node in $child/*
							return
								local:xmlToHtml($node)						
						}
		else if ($class eq 'segment') then
			element div { 	
							attribute id {$id}, 
							attribute class {$class},
							local:getNonIdDataAttrs($child),
							local:tagsToDataAttrs($tags),
							for $node in $child/*
							return
								local:xmlToHtml($node)						
						}
		else if ($class eq 'superContent') then
			element span { 	
							attribute id {$id}, 
							attribute class {$class},
							local:getNonIdDataAttrs($child),
							local:tagsToDataAttrs($tags),
							for $node in $child/*
							return
								local:xmlToHtml($node)						
						}
		else if ($class eq 'content') then
			element span { 	
							attribute id {$id}, 
							attribute class {$class},
							local:getNonIdDataAttrs($child),
							local:tagsToDataAttrs($tags),
							$child/text()						
						}
		else ()
	return 
		$html
};


let $sessionId := request:get-parameter('sessionId', ())
let $session := $baseCollection//session[@id eq $sessionId]

return
	<div id="{$sessionId}" class="transcript">
	{
		for $child in $session//transcript/*
		return 
			local:xmlToHtml($child)
	}
	</div>



