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
            boardList += `
                <section class="board">
                    <div class="board-header">
                        <span class="board-title">${board.title}</span>
                            <button class="board-add">Add Card</button>
                            <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
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
    },
    loadCards: function () {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(1, function(cards){
            dom.showCards(cards);
        });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also

        let cardList = '';

        for (let i = 0; i < cards.length-1; i++) {
            if (i === 0 && cards[i].statustitle !== cards[i - 1].statustitle) {
                cardList += `
                    <div class="board-column">
                        <div class="board-column-title">${cards[i].statustitle}</div>
                        <div class="board-column-content">
                            <div class="card">
                                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                                <div class="card-title">${cards[i].cardtitle}</div>
                            </div>
                        </div>
                    </div> 
                `;
            } else if (cards[i].statustitle === cards[i - 1].statustitle) {
                cardList += `
                    <div class="card">
                        <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">${cards[i].cardtitle}</div>
                    </div> 
                `;
            }
        }

        // for(let card of cards){          // somehow it needs to group the cards into columns
        //     cardList += `
        //         <div class="board-column">
        //             <div class="board-column-title">${card.statustitle}</div>
        //             <div class="board-column-content">
        //                 <div class="card">
        //                     <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
        //                     <div class="card-title">${card.cardtitle}</div>
        //                 </div>
        //             </div>
        //         </div>
        //     `;
        // }

        const outerHtml = `
            <div class="board-columns">
                ${cardList}
            </div>
        `;

        this._appendToElement(document.querySelector('.board'), outerHtml);

    },
    // here comes more features
};
