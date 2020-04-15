document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-undef
  const checkWebp = testWebP();
  const cardArray = [];
  let animalData;
  let animalArray = [];
  const randomAnimalImagesSite = 'https://www.randomlists.com';
  const isFlippedClassname = 'is-flipped';
  const blankImagePath = 'icons/question.svg';
  const loseMessage = 'You lose';
  const winMessage = 'Congratulations\n you won game';
  const grid = document.querySelector('.grid');
  const resultDisplay = document.getElementById('result');
  const resultMessage = document.getElementById('resultMessage');
  const remainingDisplay = document.getElementById('remaining');
  const refreshButton = document.getElementById('refresh-container');
  const restoreButton = document.getElementById('restore-container');
  const overlay = document.getElementsByClassName('overlay')[0];
  const resultMessageContainer = overlay.getElementsByClassName('resultMessageContainer')[0];
  const overlayContainer = overlay.getElementsByClassName('overlay-container')[0];
  const informationContainer = overlay.getElementsByClassName('information-container')[0];
  const informationList = document.getElementsByClassName(
    'information-list',
  )[0];
  const moreInfo = document.getElementById('more-info');
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  let isDisableFlip = false;
  let totalTurns = cardArray.length;
  let totalTurnsRemaning = totalTurns;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function getRandomInts(num, max) {
    const ints = [];
    while (ints.length < num - 1) {
      const randNum = getRandomInt(0, max);
      if (!ints.indexOf(randNum) > -1) {
        ints.push(randNum);
      }
    }
    return ints;
  }

  function resetFlipped(cards = []) {
    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i];
      card.classList.remove(isFlippedClassname);
    }
  }


  function resetImages(backImages = []) {
    for (let i = 0; i < backImages.length; i += 1) {
      const backImage = backImages[i];
      backImage.setAttribute('src', blankImagePath);
    }
  }

  const resultMessageDisplay = (text) => {
    resultMessage.textContent = text;
  };

  function resultDisplayContent() {
    resultDisplay.textContent = cardsWon.length;
  }

  function remainingDisplayContent() {
    remainingDisplay.textContent = `${totalTurnsRemaning}`;
  }

  function moreInfoClick() {
    resultMessageContainer.classList.toggle('displayNone');
    overlayContainer.classList.toggle('displayNone');
    informationList.classList.toggle('displayNone');
    informationContainer.classList.toggle('informationListUp');
  }

  function sortingRandom() {
    cardArray.sort(() => 0.5 - Math.random());
  }

  function shuffle() {
    for (let i = 0; i < 3 + 10 * Math.random(); i += 1) {
      sortingRandom();
    }
  }

  function setFlipped(cards = []) {
    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i];
      card.classList.add(isFlippedClassname);
    }
  }

  const changeImageInformationList = () => {
    const images = document.getElementsByClassName('information-image');
    for (let i = 0; i < images.length; i += 1) {
      const image = images[i];
      const animal = animalArray[i];
      image.setAttribute('src', animal.img);
      image.setAttribute('alt', animal.name);
    }
  };

  function createInformationList() {
    const informationListItemClicked = (event) => {
      const listId = event.currentTarget.getAttribute('data-listid');
      const animal = animalArray[listId];
      const msg = new SpeechSynthesisUtterance(animal.name);
      window.speechSynthesis.speak(msg);
    };
    for (let i = 0; i < animalArray.length; i += 1) {
      const animal = animalArray[i];
      const listItem = document.createElement('li');
      const imageContainer = document.createElement('div');
      const image = document.createElement('img');
      const name = document.createElement('p');
      const description = document.createElement('p');
      listItem.classList.add('information-list-item');
      listItem.addEventListener('click', informationListItemClicked);
      listItem.setAttribute('data-listid', i);
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

  function flipCard() {
    if (totalTurnsRemaning === 0) {
      resultMessageDisplay(loseMessage);
      setFlipped();
    } else if (!isDisableFlip) {
      const cardId = this.getAttribute('data-id');
      cardsChosen.push(cardArray[cardId].name);
      cardsChosenId.push(cardId);
      const img = this.parentNode.querySelector('.card__face--back img');
      img.setAttribute('src', cardArray[cardId].img);
      this.parentNode.classList.add(isFlippedClassname);
      if (cardsChosen.length === 2) {
        isDisableFlip = true;
        // eslint-disable-next-line no-use-before-define
        checkMatches();
      }
    }
  }

  function checkMatches() {
    const cards = document.querySelectorAll('.card');
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
      totalTurnsRemaning -= 1;
      remainingDisplayContent();
      if (cardsWon.length === cardArray.length / 2) {
        overlay.classList.toggle('displayNone');
        resultMessageDisplay(winMessage);
        return;
      }
      if (totalTurnsRemaning === 0) {
        overlay.classList.toggle('displayNone');
        resultMessageDisplay(loseMessage);
        setFlipped();
      }
    } else {
      setTimeout(() => {
        card1.classList.remove(isFlippedClassname);
        card2.classList.remove(isFlippedClassname);
        const imgBack1 = card1.querySelector('.card__face--back img');
        imgBack1.setAttribute('src', blankImagePath);
        const imgBack2 = card2.querySelector('.card__face--back img');
        imgBack2.setAttribute('src', blankImagePath);
        isDisableFlip = false;
        resultDisplayContent();
        totalTurnsRemaning -= 1;
        remainingDisplayContent();
        if (cardsWon.length === cardArray.length / 2) {
          overlay.classList.toggle('displayNone');
          resultMessageDisplay(winMessage);
          return;
        }
        if (totalTurnsRemaning === 0) {
          overlay.classList.toggle('displayNone');
          resultMessageDisplay(loseMessage);
          setFlipped();
        }
      }, 1000);
    }
    cardsChosen = [];
    cardsChosenId = [];
  }

  function createBoard() {
    resultDisplayContent();
    remainingDisplayContent();
    shuffle();
    for (let i = 0; i < cardArray.length; i += 1) {
      const scene = document.createElement('div');
      scene.classList.add('scene');
      const card = document.createElement('div');
      card.classList.add('card');
      const front = document.createElement('div');
      front.classList.add('card__face', 'card__face--front');
      const frontImg = document.createElement('img');
      frontImg.setAttribute('src', blankImagePath);
      front.appendChild(frontImg);
      front.setAttribute('data-id', i);
      front.addEventListener('click', flipCard);
      const back = document.createElement('div');
      back.classList.add('card__face', 'card__face--back');
      const backImg = document.createElement('img');
      backImg.setAttribute('src', blankImagePath);
      back.appendChild(backImg);
      card.appendChild(front);
      card.appendChild(back);
      scene.appendChild(card);
      grid.appendChild(scene);
    }
    moreInfo.addEventListener('click', moreInfoClick);
  }


  function resetListeners(faceFronts = []) {
    for (let i = 0; i < faceFronts.length; i += 1) {
      const faceFront = faceFronts[i];
      faceFront.removeEventListener('click', flipCard);
      faceFront.addEventListener('click', flipCard);
    }
  }

  function resetBoard() {
    const cards = document.querySelectorAll('.card');
    resetFlipped(cards);
    const faceFronts = document.querySelectorAll('.card .card__face--front');
    resetListeners(faceFronts);
    const backImages = document.querySelectorAll(
      '.card .card__face--front img',
    );
    resetImages(backImages);
    shuffle();
    cardsChosen = [];
    cardsChosenId = [];
    cardsWon = [];
    animalArray = [];
    isDisableFlip = false;
    totalTurnsRemaning = totalTurns;
    resultDisplayContent();
    remainingDisplayContent();
    overlay.classList.toggle('displayNone');
  }
  const status = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
  };

  const json = (response) => response.json();

  function changeData(type = 0) {
    const handleData = (data) => {
      const init = () => {
        refreshButton.addEventListener('click', () => changeData(1));
        restoreButton.addEventListener('click', resetBoard);
        totalTurns = cardArray.length;
        totalTurnsRemaning = totalTurns;
      };
      const addToArray = () => {
        animalData = data;
        const randl = animalData.RandL;
        const animalNames = randl.items;
        const metaimg = randl.meta.img;
        const { prefix } = metaimg;
        const { suffix } = checkWebp ? metaimg : 'jpg';
        const ints = getRandomInts(7, animalNames.length);
        for (let i = 0; i < ints.length; i += 1) {
          const name = animalNames[ints[i]];
          const element = {
            name,
            img: `${randomAnimalImagesSite}${prefix}${name.replace(
              /[\s|-]/,
              '_',
            )}${suffix}`,
          };
          cardArray.push(element);
          cardArray.push(element);
          animalArray.push(element);
        }
      };
      if (type === 0) {
        addToArray();
        init();
        createBoard();
        createInformationList();
      } else {
        resetBoard();
        addToArray();
        changeImageInformationList();
      }
    };
    fetch('./animal.json', { mode: 'cors' })
      .then(status)
      .then(json)
      .then((data) => handleData(data))
      .catch((error) => {
        console.log('Request failed', error);
      });
  }

  changeData();
});
