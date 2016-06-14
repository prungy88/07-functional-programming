// TODO: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
(function(module) {

  function Article (opts) {
    for (key in opts) {
      this[key] = opts[key];
    }
  }

  Article.allArticles = [];

  Article.prototype.toHtml = function(scriptTemplateId) {
    var template = Handlebars.compile($(scriptTemplateId).text());
    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    if(this.daysAgo < 1) {
      this.publishStatus = '(published today)';
    } else {
      this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    }
    this.body = marked(this.body);
    return template(this);
  };

  Article.loadAll = function(dataWePassIn) {
    /* NOTE: the original forEach code should be refactored
       using `.map()` -  since what we are trying to accomplish is the
       transformation of one collection into another. */
    Article.allArticles = dataWePassIn.sort(function(a,b) {
      return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
    }).map(function(ele) {
      return new Article(ele);
    });
  };

  /* TODO: Refactoring the Article.fetchAll method, it now accepts a parameter
      that will execute once the loading of articles is done. We do this because
      we might want to call other view functions, and not just initIndexPage();
      Now instead of calling articleView.initIndexPage(), we can call
      whatever we pass in! */
  Article.fetchAll = function(nextFunction) {
    if (localStorage.hackerIpsum) {
      $.ajax({
        type: 'HEAD',
        url: '/data/hackerIpsum.json',
        success: function(data, message, xhr) {
          var eTag = xhr.getResponseHeader('eTag');
          if (!localStorage.eTag || eTag !== localStorage.eTag) {
            localStorage.eTag = eTag;
            Article.getAll(nextFunction); //TODO: pass 'nextFunction' into getAll();
          } else {
            Article.loadAll(JSON.parse(localStorage.hackerIpsum));
            // TODO: Replace the following line with 'nextFunction' and invoke it!
            nextFunction();
          }
        }
      });
    } else {
      Article.getAll(nextFunction); // TODO: pass 'nextFunction' into getAll();
    }
  };

  Article.getAll = function(nextFunction) {
    $.getJSON('/data/hackerIpsum.json', function(responseData) {
      Article.loadAll(responseData);
      localStorage.hackerIpsum = JSON.stringify(responseData);
      // TODO: invoke nextFunction!
      nextFunction();
    });
  };

  /* TODO: Chain together a `map` and a `reduce` call to get a rough count of
      all words in all articles. */
  Article.numWordsAll = function() {
    return Article.allArticles.map(function(article) {
        //DONE: Grab the word count from each article body.
      return article.body.match(/\w+/g).length;
    })
    .reduce(function(a, b) {
      return a + b;
    });
  };

  /* TODO: Chain together a `map` and a `reduce` call to
            produce an array of *unique* author names. */
  Article.allAuthors = function() {
    //return       TODO: map our collection
    return Article.allArticles.map(function(article) {
      return article.author;
    })
    .reduce(function(acc, cur, idx, arr) {
      if (!acc.includes(cur)) {
        acc.push(cur);
      }
      return acc;
    },[]);
      //return    TODO: return just the author names

    /* TODO: For our `reduce` that we'll chain here -- since we are trying to
        return an array, we'll need to specify an accumulator type...
        What data type should this accumulator be and where is it placed? */
  };

  Article.numWordsByAuthor = function() {
    /* TODO: Transform each author element into an object with 2 properties:
        One for the author's name, and one for the total number of words across
        the matching articles written by the specified author. */
        ///the result of calling Article.allAuthors() is an array of author names
    return Article.allAuthors().map(function(a) { // 'a' is a reference to an individual author.
      return {
        // name:
        // numWords: someCollection.filter(function(curArticle) {
        //  what do we return here to check for matching authors?
        // })
        // .map(...) // use .map to return the author's word count for each article's body (hint: regexp!).
        // .reduce(...) // squash this array of numbers into one big number!
      };
    });
  };

});
