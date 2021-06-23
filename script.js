(function () {
    'use strict';

    var typeGame = {};
    var games = [];
    var checkedNumbers = [];

    const $type = document.querySelector('[data-js="type"]');
    const $description = document.querySelector('[data-js="description"]');
    const $typeButton = document.querySelector('[data-js="typeButton"]');
    const $ranger = document.querySelector('[data-js="numbers"]');
  
    function init() {
      getGames();
    }
    
    function getGames() {
      const ajax = new XMLHttpRequest();
      ajax.open('GET', '../games.json');
      ajax.send();
      ajax.addEventListener('readystatechange', () => getAllGames(ajax));
    }
  
    function getAllGames(ajax) {
      if (ajax.readyState === 4 && ajax.status === 200) {
        games = JSON.parse(ajax.responseText).types;
        createButtons();
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
      completeGame(getBetDescription(games[0].type)[0]);
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
          completeGame(type);
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
  
    function completeGame(type) {
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
    init();
  
  })();
  