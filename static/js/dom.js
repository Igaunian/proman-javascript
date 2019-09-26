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
        dom.loadBoards();

        let addBoardButton = document.querySelector(".board-add");
        addBoardButton.addEventListener("click", function () {
            dom.addBoard()
        })

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
                            <button class="card-add" id="card-add-${board.id}" data-board-id="${board.id}">Add Card</button>
                            <button class="board-remove" data-board-id="${board.id}"><i class="fas fa-trash"></i></button>
                            <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down" id="arrow-${board.id}"></i></button>
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

        let boardDeleteButtons = document.getElementsByClassName('board-remove');
        for (let deleteButton of boardDeleteButtons) {
            deleteButton.addEventListener('click', dom.deleteBoard)
        }

        let toggleButtons = document.getElementsByClassName("board-toggle");  // toggleButton event listener, that calls the loadCards with the boardId

        for(let button of toggleButtons) {
            let boardId = button.dataset.boardId;

            button.addEventListener('click', function () {
                let arrowButton = document.getElementById("arrow-" + boardId).className;

                if (arrowButton === "fas fa-chevron-up") {
                    dom.hideBoards(boardId)
                }
                else if (arrowButton === "fas fa-chevron-down") {
                    dom.loadCards(boardId);
                    document.getElementById("arrow-" + boardId).className = "fas fa-chevron-up"
                }
            });
        }
        let addCardButtons = document.getElementsByClassName("card-add");  // toggleButton event listener, that calls the loadCards with the boardId

        for (let button of addCardButtons) {
            let boardId = button.dataset.boardId;
            boardId = parseInt(boardId, 10);

            button.addEventListener('click', function () {
                dom.addCard(boardId)
            })
        }
    },
    hideBoards: function (boardId) {

        document.getElementById("board-columns-" + boardId).remove();
        document.getElementById("arrow-" + boardId).className = "fas fa-chevron-down"

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

        let newCards = '';
        let inProgressCards = '';
        let testingCards = '';
        let doneCards = '';

        for (let index = 0; index < cards.length; index++) {
            if (cards[index].status_id === 1) {
                newCards += dom.createCardsTemplate(cards[index].cardtitle, cards[index].cardid)
            } else if (cards[index].status_id === 2) {
                inProgressCards += dom.createCardsTemplate(cards[index].cardtitle, cards[index].cardid)
            } else if (cards[index].status_id === 3) {
                testingCards += dom.createCardsTemplate(cards[index].cardtitle, cards[index].cardid)
            } else if (cards[index].status_id === 4) {
                doneCards += dom.createCardsTemplate(cards[index].cardtitle, cards[index].cardid)
            }
        }

        let newColumn = this.createColumnTemplate('1', 'New', newCards);
        let inProgressColumn = this.createColumnTemplate('2', 'In Progress', inProgressCards);
        let testingColumn = this.createColumnTemplate('3', 'Testing', testingCards);
        let doneColumn = this.createColumnTemplate('4', 'Done', doneCards);

        const outerHtml = `<div class="board-columns" id="board-columns-${boardId}">
            ${newColumn}
            ${inProgressColumn}
            ${testingColumn}
            ${doneColumn}
            </div>
        `;

        this._appendToElement(document.getElementById(boardId), outerHtml);

        // delete card
        let deleteButtons = document.querySelectorAll('.card-remove');
        for(let deleteButton of deleteButtons) {

            let cardId = deleteButton.dataset.cardId;
            cardId = parseInt(cardId, 10);

            deleteButton.addEventListener('click', function() {
                console.log(cardId);
                dataHandler.deleteCard(cardId, function(boardId) {
                    dom.loadCards(boardId)
                })
            })
        }

    },
    addCard: function (boardId) {

        $('#exampleModal').on('show.bs.modal', function (event) {
            document.querySelector("#exampleModalLabel").textContent = "Add New Card"
        });

        $('#exampleModal').modal("show").on('hide.bs.modal', function () {
            let cardName = $("#card-title").val();
        });

        // let cardTitle = $("#card-title").val();

        let addButton = document.getElementById("add-card-button");
        addButton.addEventListener('click', function () {

            let cardTitle = document.querySelector("#card-title").value;
            $('#exampleModal').modal('hide');

            dataHandler.createNewCard(cardTitle, boardId, 1, function(boardId) {
                dom.loadCards(boardId)
            });
        })

    },
    // deleteCard: function () {
    //
    //     let deleteButtons = document.querySelectorAll('.card-remove');
    //     for(let deleteButton of deleteButtons) {
    //
    //         let cardId = deleteButton.dataset.cardID;
    //         cardId = parseInt(cardId, 10);
    //
    //         deleteButton.addEventListener('click', function() {
    //             dataHandler.deleteCard(cardId, function(boardId) {
    //                 dom.loadCards(boardId)
    //             })
    //         })
    //     }
    //
    // },
    createColumnTemplate: function (statusId, statusName, statusCards) {
        let column = `<div class="board-column" id="board-column-${statusId}">
                        <div class="board-column-title">${statusName}</div>
                        <div class="board-column-content">${statusCards}</div>
                      </div>`;

        return column
    },
    createCardsTemplate: function (cardTitle, cardId) {
        let cards = `<div class="card">
                        <div class="card-remove" data-card-id="${cardId}"><i class="fas fa-trash-alt"></i></div>
                        <div class="card-title">${cardTitle}</div>
                     </div>`;

        return cards
    },
    addBoard: function () {

        $('#exampleModal').on('show.bs.modal', function (event) {
            document.querySelector("#exampleModalLabel").textContent = "Add New Board"
        });

        $('#exampleModal').modal("show").on('hide.bs.modal', function () {
            let boardName = $("#card-title").val();
        });

        let addButton = document.querySelector('#add-card-button');
        addButton.addEventListener('click', function () {

            let boardTitle = document.querySelector('#card-title').value;
            $('#exampleModal').modal('hide');

            dataHandler.createNewBoard(boardTitle, function (boards) {
                dom.showBoards(boards)
            })

        });
    },
    deleteBoard: function (event) {
        let deleteButton = event.target;
        if (deleteButton.classList.contains('fas')) {
            deleteButton = deleteButton.parentElement;
        }
        let boardId = event.target.dataset.boardId;
        dataHandler.deleteBoard(boardId, dom.loadCards);
    }
};
