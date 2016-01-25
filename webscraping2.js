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
    })


    Session.set("scraper", result);
    Session.set("scraper2", result2);
  });

  Template.scraper.helpers({
    bookTitles: function(){
      return Session.get("scraper");
    },
    bookRatings: function(){
      return Session.get("scraper2")
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
          if (resp != "" ){
            titles[count] = resp;
            count = count + 1;
          }
        }
        var newline = titles.join("\n");
        return newline;
      },

      webScrape2: function (){
        result = Meteor.http.get("https://www.bookbub.com/ebook-deals/latest");
        $ = cheerio.load(result.content);
        var resp2 = $('#promotion-31062 > div.col-sm-9 > h5 > a').text();
        console.log(resp2)
        return resp2
      }


    })
  });
}
