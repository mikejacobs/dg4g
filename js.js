// TODO!
// Sorting by location, type, and role

var xmlURL =
  "https://groups.google.com/forum/feed/design-gigs-for-good/topics/rss.xml?num=100";

google.load("feeds", "1");
google.setOnLoadCallback(() => {
  var feed = new google.feeds.Feed(xmlURL);
  feed.load(xmlParser);
});

function xmlParser(xml) {
  var $list = $("#list");
  $("#loading").hide();
  if (!xml.error) {
    // console.log("xml", xml);
    xml.feed.entries.forEach(function(item) {
      //   console.log("item", item);
      var parsedTitle = parseMetaData(item.title);
      var parsedDesc = parseLinkFromDescription(item.content);
      var $list_item = $("<div class='item'></div>");

      $list_item.append(
        $(
          '<span class="meta">' +
            parsedTitle.type +
            "</span> &middot; " +
            '<span class="meta">' +
            parsedTitle.location +
            "</span> "
        )
      );
      $list_item.append(
        $('<span class="date">' + formatDate(item.publishedDate) + "</span>")
      );
      $list_item.append(
        $(
          '<a href="' +
            (parsedDesc.link || item.link) +
            '" class="title">' +
            parsedTitle.text +
            "</a>"
        )
      );
      $list_item.append(
        $(
          "<p>" +
            parsedDesc.text +
            // '... <a class="more" href=' +
            // item.link +
            // ">original post</a>
            "</p>"
        )
      );

      $list.append($list_item);
    });
  } else {
    $list.append(
      $("<div>Sorry :( Could not retrieve job listings at the time.</div>")
    );
  }
}

function formatDate(str) {
  var d = new Date(str);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return months[d.getMonth()] + " " + d.getDate();
}

function parseLinkFromDescription(desc) {
  var link = desc.match(/\bhttps?:\/\/\S+/gi);
  var text = desc.replace(/\bhttps?:\/\/\S+/gi, "").replace(" // ", "");

  return {
    text: text,
    link: link
  };
}

function parseMetaData(title) {
  var parts = title.split("]");
  var meta = parts[0].split(", ");
  return {
    text: parts[1],
    location: meta[1],
    type: meta[0].split("[")[1]
  };
}
