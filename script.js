//Inicio da função IIFE
(function ($) {

  //Evitar uso de variaveis não declaradas
  'use strict';

  //Seleciona elementos do html
  let $type = document.querySelector('[data-js="type"]');
  let $ranger = document.querySelector('[data-js="numbers"]');
  let $totalCart = document.querySelector('[data-js="totalCart"]');
  let $typeButton = document.querySelector('[data-js="typeButton"]');
  let $saveButton = document.querySelector('[data-js="saveButton"]');
  let $cartButton = document.querySelector('[data-js="cartButton"]');
  let $description = document.querySelector('[data-js="description"]');
  let $cleanNumbers = document.querySelector('[data-js="cleanNumbers"]');
  let $numbersLottery = document.querySelector('[data-js="numbersLottery"]');
  let $completeNumber = document.querySelector('[data-js="completeNumber"]');

  const lottery = (function () {
    //Jogos
    var games = [];
    //Tipo do jogo, ex: lotofacil, mega-sena...
    var typeGame = {};
    //Adicionar id 
    var lotteryId = 0;
    //Valor dos jogos no carrinho
    var totalCartValue = 0;
    //Numeros selecionados
    var checkedNumbers = [];
    //Numeros do carrinho
    var numbersLottery = [];

    return {
      init: function () {
        this.ajaxRequest();
      },
      // Requisição Ajax
      ajaxRequest: function () {
        const ajax = new XMLHttpRequest();
        ajax.open('GET', '../games.json');
        ajax.send();
        ajax.addEventListener('readystatechange', () => lottery.getTypesLottery(ajax));
      },

      //Add jogos do arquivo JSON no array games
      getTypesLottery: function (parm) {
        if (parm.readyState === 4 && parm.status === 200) {
          games = JSON.parse(parm.responseText).types;
          lottery.createButtons();
          lottery.buttonsLottery();
        };
      },

      //Cria botoes para escolha do tipo do jogo
      createButtons: function () {
        games.forEach(game => {
          console.log(game)
          $typeButton.insertAdjacentHTML(
            'beforeend', '<button class="lottery-buttons" data-js="' + game.type + '">' + game.type + ' </button>'
          );
        });
        lottery.changeButtonChecked();
        lottery.getDescriptionType(lottery.checkedButtonColor(0));
      },

      //Carregar primeiro jogo (ex.: Lotofacil)
      getDescriptionType: function () {
        lottery.loadGame(lottery.getDescriptionTypeLottery(games[0].type)[0]);
      },


      //Carrega jogos
      loadGame: function (type) {
        lottery.clearBet();
        checkedNumbers = [];
        Object.assign(typeGame, type);
        lottery.completeNumbersForType(type);
        lottery.handleBetNumbers(type);
        $description.innerText = type.description;
        $type.innerText = type.type.toUpperCase();
      },

      //Pegar descrição do jogo 
      getDescriptionTypeLottery: function (type) {
        return games.filter(game => {
          return game.type === type;
        })
      },


      changeButtonChecked: function () {
       
        $typeButton.childNodes.forEach((button, index) => {
          button.addEventListener('click', () => {
            const type = lottery.getDescriptionTypeLottery(button.dataset.js)[0];
            lottery.loadGame(type);
            lottery.checkedButtonColor(index);
          });
        })
      },

      checkedButtonColor: function (index) {
        $typeButton.childNodes.forEach((button, currentIndex) => {
          const game = lottery.getDescriptionTypeLottery(button.dataset.js)[0];
          if (currentIndex === index) {
            button.setAttribute(
              'style', 'background-color: ' + game.color + '; color: #FFFFFF; border: 2px solid ' + game.color + ';')
          } else {
            button.setAttribute('style', 'background-color: #FFFFFF; color:' + game.color + ';  border: 2px solid' + game.color + ';');
          }
        })
      },

      //Limpar o jogo ao mudar de opção
      clearBet: function () {
        console.log('oi')
        $ranger.innerHTML = '';
      },

      handleBetNumbers: function (type) {
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
      },

      //Adicionar evento de clique e função aos botoes
      buttonsLottery: function () {
        $cleanNumbers.addEventListener('click', lottery.cleanNumbers);
        $cartButton.addEventListener('click', lottery.addToCart);
        $completeNumber.addEventListener('click', lottery.completeNumber);
        $saveButton.addEventListener('click', lottery.saveGame);
      },

      //Limpar numeros
      cleanNumbers: function () {
        checkedNumbers.forEach(number => {
          document.querySelector(`[data-js="${number}"]`)
            .setAttribute('style', 'background-color: #ADC0C4;')
        });
        checkedNumbers = [];
      },

      //Carregar numeros pela ranger
      completeNumbersForType: function (type) {
        for (var index = 1; index <= type.range; index++) {
          $ranger.insertAdjacentHTML(
            'beforeend', `<button class="number" data-js="${index}" value="${index}"> ${index}  </button>`
          );
        }
      },


    //Completar numeros 
      completeNumber: function () {

    
          checkedNumbers.forEach(number => {
            document.querySelector(`[data-js="${number}"]`)
              .setAttribute('style', 'background-color: #ADC0C4;')
          });
          checkedNumbers = [];
        

        let randomNumber = 0;
        while (checkedNumbers.length < typeGame['max-number']) {
          randomNumber = Math.ceil(Math.random() * (typeGame.range));
          if (!lottery.isInCurrentBet(randomNumber)) {
            document.querySelector(`[data-js='${randomNumber}']`).click();
          }
        }
      },

      isInCurrentBet: function (number) {
        return checkedNumbers.some(item => {
          return number === item;
        })
      },

      //Criar jogo no carrinho
      createBet: function () {
        $numbersLottery.insertAdjacentHTML('beforeend',
          `<div class="lotteryCard" data-id="${lotteryId}" data-js="bet${typeGame.type}">
          <img data-js="removeToCart" src="assets/trash.svg"/>
          <div class="bet${typeGame.type} backgroundNumber" style="border-left: 4px solid ${typeGame.color}; border-radius: 4px;">
            <span class="textNumbers">${checkedNumbers.sort((a, b) => a - b).join(', ')}</span>
            <div class="containerPrice">
              <p class="textName" style="color: ${typeGame.color}">${typeGame.type}</p>
              <span class="textPrice">${String(typeGame.price.toFixed(2)).replace('.', ',')}</span></div>
          </div>
        </div>`
        );

        numbersLottery.push({
          "id": lotteryId,
          "type": typeGame.type,
          "price": typeGame.price,
          "numbers": checkedNumbers.sort((a, b) => a - b).join(', '),
        })

        totalCartValue += typeGame.price;
        lottery.changeTotalValue();
        lottery.removeBetFromCart();
      },

      //Add item no carrinho
      addToCart: function () {
        if (checkedNumbers.length == typeGame['max-number']) {
          lottery.createBet();
          lotteryId += 1;
          lottery.cleanNumbers();
        }
      },

      //Remover item do carrinho
      removeBetFromCart: function () {
        const betToBeRemoved = document.querySelector(`[data-id="${lotteryId}"]`);

        betToBeRemoved.addEventListener('click', () => {
          numbersLottery = numbersLottery.filter(bet => {
            return bet.id !== Number(betToBeRemoved.dataset.id)
          })
          for (let index = 0; index < games.length; index++) {
            if (betToBeRemoved.dataset.js === `bet${games[index].type}`) {
              totalCartValue -= games[index].price;
            }
            lottery.changeTotalValue();
            betToBeRemoved.remove();
          }
        })
      },

      // Remover . e adicionar ,
      changeTotalValue: function () {
        $totalCart.textContent = String(totalCartValue.toFixed(2)).replace('.', ',');
      },
    }

  }());

  lottery.init();

}(window.DOM))