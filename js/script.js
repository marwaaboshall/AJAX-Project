
function loadData() {
    //Defining all needee variables
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var adressStr = streetStr +', '+ cityStr;
    var streetViewURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + adressStr + '';
    var articles;
    $greeting.text("So you want to live in " + adressStr +"?");
    $body.append('<img class="bgimg" src="' + streetViewURL + '">');
    $wikiElem.text("");
    $nytElem.text("");
    
    //Talking to NY times API 
    var nyURL= 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +cityStr+'&sort=newest&api-key=4533a37aea7a573f0a8e0342d96153e3:3:72582037';
    $.getJSON(nyURL, function(data){
         console.log(data);
            console.log(nyURL);
       $nytHeaderElem.text("This search is about " +cityStr);
        articles  = data.response.docs;
        for(var i = 0; i<articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+ article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
                   
        };
        //error function for handling if the articles couldn't be loaded, the paramter e is the erorr it self if you want to use it, but now we          won't use it
    }).error(function(e){
            $nytHeaderElem.text("New York times articles couldn't be loaded due to location problem or internet connection");
            });
    
    //talking to Media Wiki API
    //Timeout function for handling any errors during requesting
    var wikiTimeOut = setTimeout(function(){
        $wikiElem.text("Failed to load wikipedia data");
    },8000);
    var wikiLink = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiLink,
        dataType: 'jsonp',
        success: function(response){
            var articleList = response[1];
            for(var i = 0; i<articleList.length; i++){
                articleTitle = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/'+articleTitle;
                $wikiElem.append('<li><a href="'+url+'">'+articleTitle +'</a></li>');
            };
            clearTimeout(wikiTimeOut);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
