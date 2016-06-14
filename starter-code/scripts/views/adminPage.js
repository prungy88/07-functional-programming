articleView.initAdminPage = function() {
  var template = Handlebars.compile($('#author-template').html());

  //logic to append all the new data that we just transformed
  Article.numWordsByAuthor().forEach(function(stat) {
    $('.author-stats').append(template(stat));
  });
  //the total number of articles
  $('#blog-stats .articles').text(Article.allArticles.length);
  //the total number of words of all articles
  $('#blog-stats .words').text(Article.numWordsAll());
  $('#blog-stats .avg').text(Article.numWordsAll() / Article.allArticles.length);
};

Article.fetchAll(articleView.initAdminPage);
