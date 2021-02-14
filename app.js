const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const numberOfResult = document.getElementById('numberOfResult');
const searchItem = document.getElementById('search');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const alertContainer = document.getElementById('alert');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images, length) => {
  numberOfResult.style.display = 'flex';
  numberOfResult.innerHTML = "Number of Match Found: " + length;
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';

  if (length === 0) {
    numberOfResult.style.display = 'none';
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    const alertMessage = `
            <p class="alertMessage"> OOPS! NO MATCH FOUND </p>
        `;
    alertDiv.innerHTML = alertMessage;
    alertContainer.appendChild(alertDiv);
    alertContainer.style.display = 'block';
  }

  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {

    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  toggleSpinner(false);

}

const getImages = (query) => {
  toggleSpinner(true);
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo`)
    .then(response => response.json())
    .then(data => showImages(data.hits, data.hits.length))
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  }
  else {
    element.classList.remove('added');
    sliders.splice(item, 1);
  }
}
// selectItem(event, img);
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;
  if (duration < 0) {
    alert("Please avoid negative value, Duration has been set to default");
    duration = 1000;
  }
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="image not found">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'block';
  sliderContainer.innerHTML = '';
  numberOfResult.innerHTML = "";
  alertContainer.innerHTML = "";
  clearInterval(timer);
  const search = document.getElementById('search');
  if (search.value == 0) {
    numberOfResult.style.display = 'none';
    gallery.innerHTML = '';
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    const alertMessage = `
        <p class="alertMessage"> PLEASE ENTER A VALID INPUT </p>
    `;
    alertDiv.innerHTML = alertMessage;
    alertContainer.style.display = 'block';
    alertContainer.appendChild(alertDiv);
  }
  else {
    alertContainer.style.display = 'none';
    getImages(search.value)
    sliders.length = 0;
    numberOfResult.style.display = "block";

  }
})
searchItem.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-btn").click();
  }
});
const toggleSpinner = (show) => {
  const spinner = document.getElementById('spinner');
  if (show) {
    spinner.classList.remove('d-none');
  }
  else {
    spinner.classList.add('d-none');
  }
}
sliderBtn.addEventListener('click', function () {
  createSlider()
})
