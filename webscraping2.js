Books = new Mongo.Collection()

if (Meteor.isClient) {

  Meteor.call('webScrape', function(error,result){
    if(error){
      console.log("error", error);
    };

    console.log(result);
    Meteor.call('webScrape2', function(error, result2){
      if (error){
        console.log("error", error);
      };
      console.log(result2)
      Session.set("scraper2", result2);

    })
    Session.set("scraper", result);
  });

  Template.scraper.helpers({
    bookTitles: function(){
      return Session.get("scraper");
    },
    bookRatings: function(){
      return Session.get("scraper2")
    },
    scrapeIsNotFinished: function(){
      return !Session.get("scraper");
    }
  })
    }


if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      webScrape: function (){
        result = Meteor.http.get("https://www.bookbub.com/ebook-deals/latest");
        $ = cheerio.load(result.content);
        var titles = [];
        var count = 0;
        for(i=30000; i<33000; i++){
          var resp= $('#promotion-' + i + '> div.col-sm-9 > h5 > a').text();
          var url= "https://r.bookbub.com/promotion_site_active_check/" + i + "?retailer_id=1"
          if (resp != "" ){
            titles[count] = resp
            count = count + 1;
            Books.insert({Title: resp, url: url})
          }
        }
        var newline = titles.join("\n");
        return newline;

      },

      webScrape2: function (){
        result2 = Meteor.http.get("http://www.amazon.com/The-Whiskey-Rebels-A-Novel-ebook/dp/B0015DYJVW?_bbid=1607716&tag=bookbubblog-20");
        $ = cheerio.load(result2.content);
        var resp2 = $('#avgRating > span > a > span').text();
        console.log(resp2)
        return resp2
      }

    })
  });
}
