import "./style";
import { Component } from "preact";
// import "gfapi";

// const FEED_PARSER = "https://api.rss2json.com/v1/api.json";
const CORS = "https://cors-anywhere.herokuapp.com/";
const FEED =
  "https://groups.google.com/forum/feed/design-gigs-for-good/topics/rss.xml?num=100";

export default class App extends Component {
  async componentDidMount() {
    fetch(CORS + FEED)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(xml => this.buildJSON(xml))
      .then(data => this.setState({ data }));
  }
  buildJSON(xml) {
    let data;
    if (xml) {
      let itemElements = xml.querySelectorAll("item");
      if (itemElements.length) {
        console.log("itemElements", itemElements);
        data = Array.from(itemElements).map(this.buildItemObj);
      } else {
        console.log("no items in xml");
      }
    } else {
      console.log("no xml");
    }
    return data;
  }

  formatDate(str) {
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

  parseLinkFromDescription(desc) {
    var link = desc.match(/\bhttps?:\/\/\S+/gi);
    var text = desc.replace(/\bhttps?:\/\/\S+/gi, "").replace(" // ", "");

    return {
      text: text,
      link: link
    };
  }

  parseMetaData(title) {
    var parts = title.split("]");
    var meta = parts[0].split(", ");
    return {
      text: parts[1],
      location: meta[1],
      type: meta[0].split("[")[1]
    };
  }

  buildItemObj = item => {
    if (item === undefined) return;
    console.log("item", item, this);
    /*
	 <item>
		<title>[Contract, NYC] Information Architect, UNICEF</title>
		<link>https://groups.google.com/d/msg/design-gigs-for-good/dfTOSWrR0ek/FaytIeFoCAAJ</link>
		<description>https://www.unicef.org/about/employ/?job=508347 // Purpose of the Assignment The Information Architect will design the Digital Workplace information architecture (IA) with a focus on creating a new global navigation structure for all internal UNICEF websites. We seek a candidate with backgroun</description>
		<guid isPermaLink="true">https://groups.google.com/d/topic/design-gigs-for-good/dfTOSWrR0ek</guid>
		<author>Sarah Fathallah</author>
		<pubDate>Mon, 30 Oct 2017 08:22:17 UTC</pubDate>
	</item> 
	*/
    let rawTitle = this.getText(item, "title");
    let rawDesc = this.getText(item, "description");
    var parsedTitle = this.parseMetaData(rawTitle);
    var parsedDesc = this.parseLinkFromDescription(rawDesc);

    return {
      type: parsedTitle.type,
      location: parsedTitle.location,
      pubDate: this.getText(item, "pubDate"),
      link: parsedDesc.link || this.getText(item, "link"),
      title: parsedTitle.text,
      description: parsedDesc.text,
      searchableText: [rawTitle, rawDesc].join(" ")
    };
  };

  getText(parent, selector) {
    return (
      (parent.querySelector(selector) &&
        parent.querySelector(selector).innerHTML) ||
      console.log("no selector", selector)
    );
  }

  _renderItem(item) {
    console.log("item", item);

    return (
      <div>
        <span class="meta">{item.type}</span> &middot;
        <span class="meta">{item.location}</span>
        <span class="date">{this.formatDate(item.pubDate)}</span>
        <a href={item.link} class="title">
          {item.title}
        </a>
        <p>
          {item.description}
          {/* // '... <a class="more" href='
            // item.link +
            // ">original post</a> */}
        </p>
      </div>
    );
  }

  render() {
    // console.log(
    //   "items",
    //   items,
    //   items && items[0].querySelector("title").innerHTML
    // );

    return (
      <div>
        <h1>Hello, World!</h1>
        <div>
          {this.state.data ? (
            this.state.data.map(item => this._renderItem(item))
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    );
  }
}
