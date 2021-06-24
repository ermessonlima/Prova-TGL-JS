(function () {
  'use strict';

  let $type = document.querySelector('[data-js="type"]');
  let $description = document.querySelector('[data-js="description"]');
  let $typeButton = document.querySelector('[data-js="typeButton"]');
  let $ranger = document.querySelector('[data-js="numbers"]');
  let $numbersLottery = document.querySelector('[data-js="numbersLottery"]');
  let $cleanNumbers = document.querySelector('[data-js="cleanNumbers"]');
  let $cartButton = document.querySelector('[data-js="cartButton"]');
  let $completeNumber = document.querySelector('[data-js="completeNumber"]');
  let $saveButton = document.querySelector('[data-js="saveButton"]');
  let $totalCart = document.querySelector('[data-js="totalCart"]');

  var lotteryId = 0;
  var totalCartValue = 0;
  var typeGame = {};
  var games = [];
  var checkedNumbers = [];
  var numbersLottery = [];

  function init() {
    getTypeLottery();
  }

  function getTypeLottery() {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', '../games.json');
    ajax.send();
    ajax.addEventListener('readystatechange', () => getTypesLottery(ajax));
  }

  function getTypesLottery(parm) {
    if (parm.readyState === 4 && parm.status === 200) {
      games = JSON.parse(parm.responseText).types;
      createButtons();
      buttonsLottery();
    };
  }

  function createButtons() {
    games.forEach(game => {
      $typeButton.insertAdjacentHTML(
        'beforeend',
        `<button class="bet-button" data-js="${game.type}" >
            ${game.type}
          </button>`
      );
    });
    changeButtonChecked();

    addFirstAccessData(checkedButtonColor(0));
  }


  function addFirstAccessData() {
    loadGame(getBetDescription(games[0].type)[0]);
  }

  function getBetDescription(type) {
    return games.filter(game => {
      return game.type === type;
    })
  }

  function changeButtonChecked() {
    $typeButton.childNodes.forEach((button, index) => {
      button.addEventListener('click', () => {
        const type = getBetDescription(button.dataset.js)[0];
        loadGame(type);
        checkedButtonColor(index);
      });
    })
  }

  function checkedButtonColor(index) {
    $typeButton.childNodes.forEach((button, currentIndex) => {
      const game = getBetDescription(button.dataset.js)[0];

      if (currentIndex === index) {
        button.setAttribute(
          'style',
          `background-color: ${game.color}; 
              color: #FFFFFF; 
              border: 2px solid ${game.color};`)
      } else {
        button.setAttribute('style',
          `background-color: #FFFFFF; 
            color: ${game.color};  
            border: 2px solid ${game.color};`);
      }
    })
  }

  function loadGame(type) {
    $description.innerText = type.description;
    $type.innerText = type.type.toUpperCase();

    Object.assign(typeGame, type);

    clearBet();
    completeNumbers(type);

    checkedNumbers = [];
    handleBetNumbers(type);
  }

  function completeNumbers(type) {
    for (var index = 1; index <= type.range; index++) {
      $ranger.insertAdjacentHTML(
        'beforeend',
        `<button class="number" data-js="${index}" value="${index}">
            ${index}
          </button>`
      );
    }
  }

  function clearBet() {
    $ranger.innerHTML = '';
  }

  function handleBetNumbers(type) {
    $ranger.childNodes.forEach(button => {
      button.addEventListener('click', () => {
        var index = checkedNumbers.indexOf(Number(button.value));
        if (index >= 0) {
          checkedNumbers.splice(index, 1);
          button.setAttribute('style', 'background-color: #ADC0C4;');
        } else {
          if (checkedNumbers.length < type['max-number']) {
            checkedNumbers.push(Number(button.value));
            button.setAttribute('style', `background-color: ${type.color}`);
          }
        }
      })
    })
  }

  function buttonsLottery() {
    $cleanNumbers.addEventListener('click', cleanNumbers);
    $cartButton.addEventListener('click', addToCart);
    $completeNumber.addEventListener('click', completeNumber);
    $saveButton.addEventListener('click', saveGame);
  }

  function cleanNumbers() {
    checkedNumbers.forEach(number => {
      document.querySelector(`[data-js="${number}"]`)
        .setAttribute('style', 'background-color: #ADC0C4;')
    });
    checkedNumbers = [];
  }

  function addToCart() {
    if (checkedNumbers.length == typeGame['max-number']) {
      createBet();
      lotteryId += 1;
      cleanNumbers();
    }
  }

  function createBet() {
    $numbersLottery.insertAdjacentHTML('beforeend',
      `<div class="bet-card" data-id="${lotteryId}" data-js="bet${typeGame.type}">
          <img data-js="remove-bet-from-cart" src="assets/trash.svg"/>
          <div class="bet${typeGame.type} bet-interior" style="border-left: 4px solid ${typeGame.color}; border-radius: 4px;">
            <span class="bet-cart-numbers">${checkedNumbers.sort((a, b) => a - b).join(', ')}</span>
            <div class="bet-name-price">
              <p class="bet-name" style="color: ${typeGame.color}">${typeGame.type}</p>
              <span class="bet-price">${String(typeGame.price.toFixed(2)).replace('.', ',')}</span></div>
          </div>
        </div>`
    );

    numbersLottery.push({
      "id": lotteryId,
      "type": typeGame.type,
      "price": typeGame.price,
      "numbers": checkedNumbers.sort((a, b) => a - b).join(', '),
    })

    console.log(numbersLottery)

    totalCartValue += typeGame.price;

    changeTotalValue();
    removeBetFromCart();
  }

  function removeBetFromCart() {
    const betToBeRemoved = document.querySelector(`[data-id="${lotteryId}"]`);

    betToBeRemoved.addEventListener('click', () => {
      numbersLottery = numbersLottery.filter(bet => {
        return bet.id !== Number(betToBeRemoved.dataset.id)
      })
      for (let index = 0; index < games.length; index++) {
        if (betToBeRemoved.dataset.js === `bet${games[index].type}`) {
          totalCartValue -= games[index].price;
        }
        changeTotalValue();
        betToBeRemoved.remove();
      }
    })
  }

  function changeTotalValue() {
    $totalCart.textContent = String(totalCartValue.toFixed(2)).replace('.', ',');
  }

  function completeNumber() {
    let randomNumber = 0;
    while (checkedNumbers.length < typeGame['max-number']) {
      randomNumber = Math.ceil(Math.random() * (typeGame.range));
      if (!isInCurrentBet(randomNumber)) {
        document.querySelector(`[data-js='${randomNumber}']`).click();
      }
    }
  }

  function isInCurrentBet(number) {
    return checkedNumbers.some(item => {
      return number === item;
    })
  }

  init();

})();
