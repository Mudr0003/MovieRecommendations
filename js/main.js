// movie recommendation app
//
// Robin Mudry Dec 2017
//
//

let app = {
    URL: 'http://api.themoviedb.org/3/',
    imgURL: '',
    baseURL: '',
    posterSizes: '',
  
    
    init: function (){
        let input = document.getElementById('search-input');
        input.focus(); //brings up keyboard on mobile
        
        app.getConfiguration();
        //workaround for iconic problem where svg code takes a while to load    
        setTimeout(app.addHandlers, 1234); 
    },
    
    
    addHandlers: function(){
        
        let btn = document.getElementById('search-button');
        let bkbtn = document.getElementById('back-button');
        
        bkbtn.addEventListener('click', app.goBack);
        
        btn.addEventListener('click', app.runSearch);
        
        document.addEventListener('keypress', function(ev){
            let char = ev.char || ev.charCode || ev.which; 
            
            if (char == 10 || char == 13) {
                btn.dispatchEvent(new MouseEvent('click'));
            }              
        });     
    },
    
    
    getConfiguration: function(){

        let url = app.URL + "configuration?api_key=" + KEY;
    
        fetch(url)
            .then( response => response.json() )
            .then( data => {
                            baseURL = data.images.base_url;
                            posterSizes = data.images.poster_sizes;
                           })
            .catch( err => {console.log(err);})         
    },
    
    
    goBack: function(ev){
        
        ev.preventDefault();
        
       location.reload();
    },
    
    
    runSearch: function(ev){
        
        ev.preventDefault();
        
        let input = document.getElementById('search-input');
        if (input.value){
            let url = app.URL + "search/movie?api_key=" + KEY + "&query=" + input.value;
            fetch(url)
                .then( response => response.json() )
                .then( data => {app.showMovies(data);
                               })
                .catch( err => {console.log(err);})
        }
    },
          
    
    showMovies: function(movies){
        
        let container = document.querySelector('#search-results .content');
       
        let df = document.createDocumentFragment();
        container.innerHTML = "";
        
        movies.results.forEach(function(movie){
            let div = document.createElement('div');
            
            let titlediv = document.createElement("div");
            titlediv.classList.add('movie-title');
            let title=document.createElement("h4");
            title.innerHTML = movie.title;
            titlediv.appendChild(title); 
            div.appendChild(titlediv);
            
            let imgdiv = document.createElement("div");
            imgdiv.classList.add('poster');
            let url = baseURL + posterSizes[1] + movie.poster_path;
            let image=document.createElement("img");
            if (movie.poster_path) {
            image.src = url;}
            image.alt = "poster image";
            imgdiv.appendChild(image);
            div.appendChild(imgdiv);
            
            let desdiv=document.createElement("div");
            desdiv.classList.add('movie-desc');
            let descrip=document.createElement("p");
            descrip.innerHTML = movie.overview;
            desdiv.appendChild(descrip);
            div.appendChild(desdiv);
            
            let linkdiv=document.createElement("div");
            linkdiv.classList.add('movie-link');
            
            let link=document.createElement("img");
            link.src = "./img/link.svg";
            link.innerHTML = movie.id;
            link.alt = "click me link";
            linkdiv.appendChild(link);
            linkdiv.addEventListener('click', app.getRecommendations);
            div.appendChild(linkdiv);
            
            div.classList.add('movie');
            df.appendChild(div);
            
        });
        
        container.appendChild(df);   
        document.getElementById('first-search').classList.remove('active');
        document.getElementById('search-results').classList.add('active');    
        
    },
    
    
    
    listRecMovies: function(movies){
        let container = document.querySelector('#recommend-results .content');
       
        let df = document.createDocumentFragment();
        container.innerHTML = "";
        
        movies.results.forEach(function(movie){
            
            let div= document.createElement('div');  
            
            let titlediv=document.createElement("div");
            titlediv.classList.add('movie-title');
            let title=document.createElement("h4");
            title.innerHTML = movie.title;
            titlediv.appendChild(title); 
            div.appendChild(titlediv);
            
            let imgdiv=document.createElement("div");
            imgdiv.classList.add('poster');
            let url = baseURL + posterSizes[1] + movie.poster_path;
            let image=document.createElement("img");
            if (movie.poster_path) {
            image.src = url;};
            image.alt = "poster image";
            imgdiv.appendChild(image);
            div.appendChild(imgdiv);
            
            let desdiv=document.createElement("div");
            desdiv.classList.add('movie-desc');
            let descrip=document.createElement("p");
            descrip.innerHTML = movie.overview;
            desdiv.appendChild(descrip);
            div.appendChild(desdiv);
              
            desdiv=document.createElement("div");
            desdiv.classList.add('movie-other');
            descrip=document.createElement("p");
            descrip.innerHTML = movie.vote_count + " votes";
            desdiv.appendChild(descrip);
            div.appendChild(desdiv);
            
            div.classList.add('movie');
            df.appendChild(div);
            
        });
        
        container.appendChild(df);   
        document.getElementById('search-results').classList.remove('active');
        document.getElementById('recommend-results').classList.add('active');    
        
    },
    
    
    
    getRecommendations: function(ev){
        
        let movieid = this.textContent;
        let url = app.URL + "movie/" + movieid + "/recommendations?api_key=" + KEY;
   
        fetch(url)
            .then( response => response.json() )
            .then( data => { app.showRecommended(data); }
                 )
            .catch( err => {console.log(err);})        
    },
    
    
    
    showRecommended:function(data){
        
        app.listRecMovies(data);
        
        }     
};

document.addEventListener('DOMContentLoaded',app.init);
