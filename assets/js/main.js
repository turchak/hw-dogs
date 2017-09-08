axios.defaults.baseURL = 'https://dog.ceo';

// axios.get start
axios.get('/api/breeds/list')
  .then(function(response) {
    renderBreeds(response.data.message);
  })
  .catch(function(error) {
    console.log(error);
  });
// axios.get end


// breedTemplate start
let breedTemplate = (name, index) => {
  return `<li class="breed">
    <a href="#" class="breed__link" data-index="${index}">
      <strong class="breed__title">${name}</strong>
    </a>
  </li>`;
}

let gridTemplate = (name, image) => {
  return `<div class="grid"><img src="${image}" alt="${name}"></div>`;
}
// breedTemplate end

let infoBlock = document.querySelector('.info');
let infoContainer = document.querySelector('.container');
// renderBreeds start
function renderBreeds(arr) {

  let breedsList = document.querySelector('.breeds');
  let breedsHTML = '';
  let infoHTML = '';

  arr.forEach((item, index) => {
    breedsHTML += breedTemplate(item, index);
  });
  breedsList.innerHTML = breedsHTML;

  arr.forEach((item, index) => {
    axios.get(`/api/breed/${item}/images/random`)
      .then(function(response) {
        document.querySelector(`[data-index="${index}"]`).style.backgroundImage = `url("${response.data.message}")`;
      })
  });
  let breedItems = document.querySelectorAll('.breed');
  console.log(breedItems);
  breedItems.forEach(elem => {
    elem.addEventListener('click', ev => {
      ev.preventDefault();

      infoBlock.classList.remove('active');
      infoBlock.classList.add('active');
      infoBlock.previousElementSibling.classList.add('active');
      let name = elem.querySelector('.breed__title').innerHTML;
      let newName = document.createElement('h2');
      let newButton = document.createElement('button');
      let gridSizer = document.createElement('div');
      gridSizer.className = 'grid-sizer'
      infoBlock.appendChild(gridSizer);
      newName.className = 'info__title';
      infoContainer.insertBefore(newName, infoBlock).innerHTML = `${name}`;
      infoContainer.insertBefore(newButton, infoBlock).innerHTML = 'reset';
      newButton.setAttribute("type", "button");
      newButton.className = 'button-reset';
      getBreedPhotos(name);
      let buttonReset = document.querySelector('.button-reset');

// <div class="grid-sizer"></div>



      buttonReset.addEventListener('click', ev => {
        ev.preventDefault();
        infoBlock.innerHTML = "";
        infoBlock.classList.remove('active');
        infoBlock.style.height = "0";
        newButton.remove();
        newName.remove();
        breedsList.classList.remove('active');
      });
    });

  });

}
// renderBreeds end


function startMasonry () {
  let grid = document.querySelector('.info');
  let msnry;

  imagesLoaded( grid, function() {
    // init Isotope after all images have loaded
    msnry = new Masonry( grid, {
      itemSelector: '.grid',
      columnWidth: '.grid-sizer',
      percentPosition: true

    });

  });

};


// getBreedPhotos start
function getBreedPhotos(breedName) {
  axios.get(`/api/breed/${breedName}/images`)
    .then(function(response) {
      response.data.message.forEach(image => {
        let gridHTML = '';
        gridHTML = gridTemplate(breedName, image)
        infoBlock.innerHTML += gridHTML;
        startMasonry ();



        // let photoSection = document.createElement('img');
        // console.log(photoSection);
        // infoBlock.appendChild(photoSection);
        // photoSection.src = image;
      });

    });

}

// getBreedPhotos end
