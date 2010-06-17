<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output method="xhtml"/>
	<xsl:strip-space elements="*"/>
	<xsl:template match="/">
		<div style="font-size:14;font-family:times-new-roman;line-height:160%;margin-bottom:100px;width:750px;margin-left:auto;margin-right:auto;text-align:left;">
			<h2 style="text-align:center;font-size:18;">
				<xsl:value-of select="/session/metadata/@subTitle"/>
				<xsl:if test="exists(/session/metadata/@startAt)">
					<xsl:value-of select="concat(' (',/session/metadata/@startAt,')')"/>
				</xsl:if>
				<!-- is there a cleaner way to sort the ids? -->
				<!--xsl:value-of select="string-join(//device/audio/@id, ', ')"/-->
				<xsl:if test="exists(//device/audio/@id)">
					<p>Audio: 
						<xsl:for-each select="//device/audio">
							<xsl:sort select="@id"/>
							<xsl:value-of select="@id"/>
							<xsl:if test="position() &lt; last()">
								<xsl:value-of select="', '"/>
							</xsl:if>
						</xsl:for-each>
					</p>
				</xsl:if>
				<xsl:if test="exists(//device/video/@id)">
					<p>Video: 
						<xsl:for-each select="//device/video">
							<xsl:sort select="@id"/>
							<xsl:value-of select="@id"/>
							<xsl:if test="position() &lt; last()">
								<xsl:value-of select="', '"/>
							</xsl:if>
						</xsl:for-each>
					</p>
				</xsl:if>
			</h2>
			<xsl:apply-templates select="//transcript"/>
		</div>
	</xsl:template>
	<xsl:template match="transcript">
		<xsl:apply-templates select="segment|superSegment"/>
	</xsl:template>
	<xsl:template match="superSegment">
		<div class="superSegement" id="{@id}">
			<xsl:apply-templates select="segment|superSegment"/>
		</div>
	</xsl:template>
	<xsl:template match="segment">
		<div class="segment" style="margin-top:1em;" id="{@id}">
			<xsl:choose>
				<xsl:when test="not(@confidential)">
					<xsl:variable name="startId"/>
					<xsl:if test=".//content[1]/@startId">
						<xsl:value-of select="//audio/sync[@timeIdRef eq ]/@timecode"/> 
					</xsl:if>
					<xsl:if test="(preceding::segment[1]/@speaker and not(@speaker)) or (not(preceding::segment[1]/@speaker) and @speaker) or (preceding::segment[1]/@speaker != @speaker)">
						<span style="font-weight:bold; text-transform:capitalize;">
							<xsl:choose>
								<xsl:when test="@speaker">
									<xsl:value-of select="@speaker"/>
									<xsl:text>:</xsl:text>
								</xsl:when>
							</xsl:choose>
						</span>
					</xsl:if>
					<xsl:apply-templates select="content|superContent"/>
				</xsl:when>
				<xsl:when test="@confidential">
					<span style="font-weight:bold; color:red;">Confidential Material</span>
				</xsl:when>
			</xsl:choose>
		</div>
	</xsl:template>
	<xsl:template match="superContent">
		<span class="superContent" id="{@id}">
			<xsl:apply-templates select="content|superContent"/>
		</span>
	</xsl:template>
	<xsl:template match="content">
		<span class="content" id="{@id}">
			<xsl:choose>
				<xsl:when test="@emphasis='true' and @spokenLanguage='tamil'">
					<xsl:attribute name="style">font-style:italic;color:blue;</xsl:attribute>
				</xsl:when>
				<xsl:when test="@emphasis='true'">
					<xsl:attribute name="style">font-style:italic;</xsl:attribute>
				</xsl:when>
				<xsl:when test="@spokenLanguage='tamil'">
					<xsl:attribute name="style">color:blue;</xsl:attribute>
				</xsl:when>
			</xsl:choose>
			<xsl:value-of select="normalize-space(.)"/>
		</span>
		<!--xsl:if test="position() != last()">
			<xsl:text> </xsl:text> 
		</xsl:if-->
	</xsl:template>
</xsl:stylesheet>
