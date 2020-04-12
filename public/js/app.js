document.addEventListener('DOMContentLoaded', (event) => {
  const cardArray = [];
  let animalData;
  let animalArray = [];
  const randomAnimalImagesSite = "https://www.randomlists.com";
  function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function json(response) {
    return response.json();
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function getRandomInts(num, max) {
    var ints = [];
    while (ints.length < num - 1) {
      var randNum = getRandomInt(0, max);
      if (!ints.indexOf(randNum) > -1) {
        ints.push(randNum);
      }
    }
    return ints;
  }
  function init() {
    refreshButton.addEventListener('click', refreshBoard);
    restoreButton.addEventListener('click', resetBoard);
    totalTurns = cardArray.length;
    totalTurnsRemaning = totalTurns;
  }
  const grid = document.querySelector('.grid');
  const resultDisplay = document.querySelector('#result');
  const remainingDisplay = document.querySelector('#remaining');
  const container = document.querySelector('.container');
  const refreshButton = document.getElementById('refresh-container');
  const restoreButton = document.getElementById('restore-container');
  const informationList = document.getElementsByClassName('information-list')[0];
  const moreInfo = document.getElementById('more-info');
  var cardsChosen = [];
  var cardsChosenId = [];
  var cardsWon = [];
  var isDisableFlip = false;
  var totalTurns = cardArray.length;
  var totalTurnsRemaning = totalTurns;

  function resultDisplayContent() {
    resultDisplay.textContent = cardsWon.length;
  }

  function remainingDisplayContent() {
    remainingDisplay.textContent = `${totalTurnsRemaning}`;
  }

  function moreInfoClick() {
    informationList.classList.toggle('displayNone');
  }

  function sortingRandom() {
    cardArray.sort(() => 0.5 - Math.random());
  }

  function shuffle() {
    for (let i = 0; i < 3 + (10 * Math.random()); i++) {
      sortingRandom();
    }
  }

  function createBoard() {

    resultDisplayContent();
    remainingDisplayContent();
    shuffle();
    for (let i = 0; i < cardArray.length; i++) {
      var scene = document.createElement('div');
      scene.classList.add('scene');

      var card = document.createElement('div');
      card.classList.add('card');
      var front = document.createElement('div');
      front.classList.add('card__face', 'card__face--front');
      var frontImg = document.createElement('img');
      frontImg.setAttribute('src', 'images/blank.png');
      front.appendChild(frontImg);
      front.setAttribute('data-id', i);
      front.addEventListener('click', flipCard);
      var back = document.createElement('div');
      back.classList.add('card__face', 'card__face--back');
      var backImg = document.createElement('img');
      backImg.setAttribute('src', 'images/blank.png');
      back.appendChild(backImg);
      card.appendChild(front);
      card.appendChild(back);
      scene.appendChild(card);
      grid.appendChild(scene);
    }
    moreInfo.addEventListener('click', moreInfoClick);
  }

  function resetFlipped(cards = []) {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      card.classList.remove('is-flipped');
    }
  }

  function resetListeners(faceFronts = []) {
    for (let i = 0; i < faceFronts.length; i++) {
      const faceFront = faceFronts[i];
      faceFront.removeEventListener('click', flipCard);
      faceFront.addEventListener('click', flipCard);
    }
  }

  function resetImages(backImages = []) {
    for (let i = 0; i < backImages.length; i++) {
      const backImage = backImages[i];
      backImage.setAttribute('src', 'images/blank.png');
    }
  }
  function setFlipped(cards = []) {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      card.classList.add('is-flipped');
    }
  }

  function refreshBoard() {
    changeData(1);
    deleteInformationList();
    createInformationList();
  }

  function resetBoard() {
    const cards = document.querySelectorAll('.card');
    resetFlipped(cards);
    const faceFronts = document.querySelectorAll('.card .card__face--front');
    resetListeners(faceFronts);
    const backImages = document.querySelectorAll('.card .card__face--front img');
    resetImages(backImages);
    shuffle();
    cardsChosen = [];
    cardsChosenId = [];
    cardsWon = [];
    isDisableFlip = false;
    totalTurnsRemaning = totalTurns;
    resultDisplayContent();
    remainingDisplayContent();
  }

  function checkMatches() {
    var cards = document.querySelectorAll('.card');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];
    const card1 = cards[optionOneId];
    const card2 = cards[optionTwoId];
    if (cardsChosen[0] === cardsChosen[1]) {
      const front1 = card1.querySelector('.card__face--front');
      const front2 = card2.querySelector('.card__face--front');
      front1.removeEventListener('click', flipCard);
      front2.removeEventListener('click', flipCard);
      cardsWon.push(cardsChosen);
      isDisableFlip = false;
      resultDisplayContent();
      if (cardsWon.length === cardArray.length / 2) {
        resultDisplay.textContent = 'Congratulations you won game';
      }
      remainingDisplayContent();
      totalTurnsRemaning = totalTurnsRemaning - 1;
      if (totalTurnsRemaning === 0) {
        setFlipped();
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('is-flipped');
        card2.classList.remove('is-flipped');
        const imgBack1 = card1.querySelector('.card__face--back img');
        imgBack1.setAttribute('src', 'images/blank.png');
        const imgBack2 = card2.querySelector('.card__face--back img');
        imgBack2.setAttribute('src', 'images/blank.png');
        isDisableFlip = false;
        resultDisplayContent();
        if (cardsWon.length === cardArray.length / 2) {
          resultDisplay.textContent = 'Congratulations you won game';
        }
        remainingDisplayContent();
        totalTurnsRemaning = totalTurnsRemaning - 1;
        if (totalTurnsRemaning === 0) {
          alert('You lose');
          setFlipped();
        }
      }, 1000);
    }
    cardsChosen = [];
    cardsChosenId = [];
  }

  function flipCard() {
    if (totalTurnsRemaning === 0) {
      alert('You lose');
      setFlipped();
    } else {
      if (!isDisableFlip) {
        var cardId = this.getAttribute('data-id');
        cardsChosen.push(cardArray[cardId].name);
        cardsChosenId.push(cardId);
        const img = this.parentNode.querySelector('.card__face--back img');
        img.setAttribute('src', cardArray[cardId].img);
        this.parentNode.classList.add('is-flipped');
        if (cardsChosen.length === 2) {
          isDisableFlip = true;
          checkMatches();
        }
      }
    }

  }

  function deleteInformationList() {
    for (let i = 0; i < informationList.length; i++) {
      informationList.removeChild(list.childNodes[0]);
    }
  }

  function createInformationList() {
    for (let i = 0; i < animalArray.length; i++) {
      const animal = animalArray[i];
      const listItem = document.createElement('li');
      const imageContainer = document.createElement('div');
      const image = document.createElement('img');
      const name = document.createElement('p');
      const description = document.createElement('p');
      listItem.classList.add('information-list-item');
      imageContainer.classList.add('image-container');
      image.setAttribute('src', animal.img);
      image.setAttribute('alt', animal.name);
      image.classList.add('information-image');
      name.textContent = animal.name;
      description.textContent = animal.name;
      imageContainer.appendChild(image);
      imageContainer.appendChild(name);
      listItem.appendChild(imageContainer);
      informationList.appendChild(listItem);
    }
  }

  function changeData(type = 0) {
    fetch('./animal.json', { mode: 'cors' })
      .then(status)
      .then(json)
      .then(function (data) {
        console.log(data);
        animalData = data;
        const randl = animalData["RandL"];
        const animalNames = randl.items;
        const metaimg = randl.meta.img;
        const prefix = metaimg.prefix;
        const suffix = metaimg.suffix;
        const ints = getRandomInts(7, animalNames.length);
        for (let i = 0; i < ints.length; i++) {
          const name = animalNames[ints[i]];
          const element = {
            name: name,
            img: `${randomAnimalImagesSite}${prefix}${name.replace(' ', '_')}${suffix}`
          }
          cardArray.push(element);
          cardArray.push(element);
          animalArray.push(element);
        }
        if (type === 0) {
          init();
          createBoard();
          createInformationList();
        } else {
          resetBoard();
          deleteInformationList();
          createInformationList();
        }
      }).catch(function (error) {
        console.log('Request failed', error);
      });
  }
  changeData();
});
