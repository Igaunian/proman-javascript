// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            // console.log(board);

            boardList += `
                <section class="board" data-board-id="${board.id}">
                    <div class="board-header">
                        <span class="board-title" data-board-id="${board.id}">${board.title}</span>
                            <button class="board-add" data-board-id="${board.id}">Add Card</button>
                            <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                    </div>
                </section>
            `;
        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;

        this._appendToElement(document.querySelector('#boards'), outerHtml);

        let toggleButtons = document.getElementsByClassName("board-toggle");  // toggleButton event listener, that calls the loadCards with the boardId
        for(let button of toggleButtons) {
            button.addEventListener('click', function () {
                let boardId = button.dataset.boardId;
                // console.log(boardId);
                dom.loadCards(boardId);
            })
        }
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        boardId = parseInt(boardId, 10);
        dataHandler.getCardsByBoardId(boardId, function(cards){
            dom.showCards(cards);
        });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also

        let cardList = '';

        for (let i = 0; i < cards.length; i++) {
            // console.log(cards[i]);

            if (i === 0 || cards[i].statustitle !== cards[i - 1].statustitle) {
                cardList += `
                    <div class="board-column">
                        <div class="board-column-title">${cards[i].statustitle}</div>
                        <div class="board-column-content">
                            
                `;
            }

            cardList += `
                <div class="card">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title">${cards[i].cardtitle}</div>
                </div>
            `;
            if (i < (cards.length-1)) {
                if (cards[i].statustitle !== cards[i + 1].statustitle) {
                    cardList += `
                            </div>
                        </div> 
                    `;
                }
            }
            else {
                cardList += `
                        </div>
                    </div> 
                `;
            }
        }

        const outerHtml = `
            <div class="board-columns">
                ${cardList}
            </div>
        `;

        this._appendToElement(document.querySelector('.board'), outerHtml);  // it should append the cards to the board with the ID...

    },
    // here comes more features
};
