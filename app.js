class fetchData {
  constructor(moviename) {
    this.movieName = moviename;
    this.req = new EasyHttp();
  }

  async fetchData() {
    try {
      let response = await this.req.get(
        `http://www.omdbapi.com/?apikey=f44593fb&s=${this.movieName.value}`
      );
      console.log(response);
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  async fetchData2(movieID) {
    try {
      let response = await this.req.get(
        `http://www.omdbapi.com/?apikey=f44593fb&i=${movieID}`
      );
      return response;
    } catch (e) {
      console.log(e);
    }
  }
}

class UI {
  constructor() {
    this.root = document.querySelector(".autocomplete");
    this.root1 = document.querySelector(".autocomplete1");
    this.root.innerHTML = this.setTemplate("first-input");
    this.root1.innerHTML = this.setTemplate("second-input");
    this.summary = document.querySelector("#summary");
    this.summary1 = document.querySelector("#summary1");
    this.dropdown = document.querySelector(".dropdown-menu");
    this.dropdown1 = document.querySelector(".dropdown-menu1");
    this.dropdownResults = document.querySelector(".dropdown-results");
    this.dropdownResults1 = document.querySelector(".dropdown-results1");
    this.input = document.querySelector(".search-input");
    this.input1 = document.querySelector(".search-input1");
  }

  setTemplate = (inputId) => {
    if (inputId === "first-input") {
      return `<input type="text" class="search-input" id="${inputId}" placeholder="Search movie"> 
      <div class="dropdown-menu">
       <div class="dropdown-results">
         
       </div>
      </div>`;
    } else if (inputId === "second-input") {
      return `<input type="text" class="search-input1" id="${inputId}" placeholder="Search movie"> 
      <div class="dropdown-menu1">
       <div class="dropdown-results1">
         
       </div>
      </div>`;
    }
  };

  clearItems(dp) {
    document.body.addEventListener("click", (e) => {
      if (!dp.contains(e.target)) {
        dp.classList.remove("active");
      }
    });
  }
}

class Final {
  constructor() {
    this.renderUI = new UI();
    this.renderfetchData = new fetchData(this.renderUI.input);
    this.renderfetchData1 = new fetchData(this.renderUI.input1);
    this.renderUI.input.addEventListener(
      "input",
      this.debounce(this.response, this.renderfetchData)
    );
    this.renderUI.input1.addEventListener(
      "input",
      this.debounce(this.response, this.renderfetchData1)
    );
  }

  movieDetail(movieD) {
    return `
    <article class = "media">
      <figure class="media-left">
        <p class="image">
         <img src ="${movieD.Poster}"/>
        </p>
      </figure>

   <div class = "media-content">
     <div class = "content">
       <h1>${movieD.Title}</h1>
       <h4>${movieD.Genre}</h4>
       <p>${movieD.Plot}</p>
    </div>
   </div>
 
   <article class = "notification is-primary">
   <p class ="subtitle">Awards</p>
    <p class ="title">${movieD.Awards}</p>
    
   </article>
 
   <article class = "notification is-primary">
    <p class ="title">${movieD.BoxOffice}</p>
    <p class ="subtitle">Box Ofiice</p>
   </article>
 
   <article class = "notification is-primary">
    <p class ="title">${movieD.Metascore}</p>
    <p class ="subtitle">Metacore</p>
   </article>
 
   <article class = "notification is-primary">
    <p class ="title">${movieD.imdbRating}</p>
    <p class ="subtitle">IMDB Rating</p>
   </article>
 
   <article class = "notification is-primary">
    <p class ="title">${movieD.imdbVotes}</p>
    <p class ="subtitle">IMDB Votes</p>
   </article>

   </article>
    `;
  }

  response = async (renderer) => {
    let firstResponse = await renderer.fetchData();
    let dropdown =
      renderer.movieName.id == "first-input"
        ? this.renderUI.dropdown
        : this.renderUI.dropdown1;
    console.log(dropdown);
    console.log(firstResponse);
    this.renderUI.clearItems(dropdown)
    dropdown.classList.add("active");
    for (const movie of firstResponse.Search) {
      let imgCheck = movie.Poster === "N/A" ? "" : movie.Poster;
      const resultWrapper = document.createElement("a");
      resultWrapper.classList.add("results");
      resultWrapper.innerHTML = `
      <img src="${imgCheck}" alt="">
       <h6>${movie.Title}</h6>
       `;
      if (renderer.movieName.id === "first-input") {
        this.renderUI.dropdownResults.append(resultWrapper);
      } else if (renderer.movieName.id === "second-input") {
        this.renderUI.dropdownResults1.append(resultWrapper);
      }

      resultWrapper.addEventListener("click", async (e) => {
        console.log(e);
        let secondRes = await this.renderfetchData.fetchData2(movie.imdbID);
        dropdown.classList.remove("active");
        console.log(secondRes);
        if (renderer.movieName.id === "first-input") {
          this.renderUI.summary.innerHTML = this.movieDetail(secondRes);
        } else if (renderer.movieName.id === "second-input") {
          this.renderUI.summary1.innerHTML = this.movieDetail(secondRes);
        }
      });
    }
     if(this.renderUI.summary.innerHTML === '' && this.renderUI.summary1.innerHTML === '') {

     }
  };

  debounce = (func, renderer) => {
    let timeOutId;
    return () => {
      if (timeOutId) {
        clearTimeout(timeOutId);
      }
      timeOutId = setTimeout(() => {
        func(renderer);
      }, 1000);
    };
  };
}

d = new Final();

