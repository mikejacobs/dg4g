// TODO!
// Sorting by location, type, and role

var xmlURL = "https://groups.google.com/forum/feed/design-gigs-for-good/topics/rss.xml?num=30"
var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + xmlURL + '"') + '&format=xml&callback=?';
$.getJSON(yql, xmlParser);

function xmlParser(xml) {

	var $list = $("#list")
	xmlDoc = $.parseXML( xml.results[0] )
	$xml = $( xmlDoc )
	var $items = $xml.find( "item" );
	$("#loading").hide()

	$items.each(function(item){

		var $item = $($items[item])
		var parsedTitle = parseMetaData($item.find("title").text())
		var parsedDesc = parseLinkFromDescription($item.find("description").text())
		var $list_item = $("<div class='item'></div>")

		$list_item.append($('<a href="#" class="meta">' + parsedTitle.type + '</a> &middot; ' + '<a href="#" class="meta">' + parsedTitle.location + '</a> '))
		$list_item.append($('<span class="date">'+ formatDate($item.find("pubDate").text()) +'</span>'))
		$list_item.append($('<a href="'+ ( parsedDesc.link || $item.find("link").text() )+'" class="title">'+parsedTitle.text+'</a>'))
		$list_item.append($('<p>' + parsedDesc.text + '...</p>'))

		$list.append($list_item)
	})
}

function formatDate(str){

	var d = new Date(str)
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	return months[d.getMonth()] + " " + d.getDate()
}

function parseLinkFromDescription(desc){

	var link = desc.match(/\bhttps?:\/\/\S+/gi)
	var text = desc.replace(/\bhttps?:\/\/\S+/gi, '').replace(" // ", "")

	return {
		text:text,
		link:link
	}
}

function parseMetaData(title){

	var parts = title.split("]")
	var meta = parts[0].split(", ")
	return {
		text:parts[1],
		location:meta[1],
		type:meta[0].split("[")[1]
	}
}