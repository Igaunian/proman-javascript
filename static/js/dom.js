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
                <section class="board" id="${board.id}" data-board-id="${board.id}">
                    <div class="board-header">
                        <span class="board-title" data-board-id="${board.id}">${board.title}</span>
                            <button class="board-add" data-board-id="${board.id}">Add Card</button>
                            <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down" id="arrow.${board.id}"></i></button>
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
            let boardId = button.dataset.boardId;
            button.addEventListener('click', function () {
                if (document.getElementById("arrow." + boardId).className === "fas fa-chevron-up") {
                    dom.hideBoards(boardId)
                }
                else if (document.getElementById("arrow." + boardId).className === "fas fa-chevron-down") {
                    dom.loadCards(boardId);
                    document.getElementById("arrow." + boardId).className = "fas fa-chevron-up"
                }
            });
        }
    },
    hideBoards: function (boardId) {

        document.getElementById("boardColumn." + boardId).remove();
        document.getElementById("arrow." + boardId).className = "fas fa-chevron-down"

    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        boardId = parseInt(boardId, 10);
        dataHandler.getCardsByBoardId(boardId, function(cards){
            dom.showCards(cards, boardId);
        });
    },
    showCards: function (cards, boardId) {
        // shows the cards of a board
        // it adds necessary event listeners also

        let cardList = '';

        for (let index = 0; index < cards.length; index++) {
            console.log(cards[index]);

            if (index === 0 || cards[index].statustitle !== cards[index - 1].statustitle) {
                cardList += `
                    <div class="board-column">
                        <div class="board-column-title">${cards[index].statustitle}</div>
                        <div class="board-column-content">
                            
                `;
            }

            cardList += `
                <div class="card">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title">${cards[index].cardtitle}</div>
                </div>
            `;
            if (index < (cards.length-1)) {
                if (cards[index].statustitle !== cards[index + 1].statustitle) {
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
            <div class="board-columns" id="boardColumn.${boardId}">
                ${cardList}
            </div>
        `;

        this._appendToElement(document.getElementById(boardId), outerHtml);  // it should append the cards to the board with the ID...

    },
    // here comes more features
};
