from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():

    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards(board_id: int):

    return data_handler.get_cards_for_board(board_id)


@app.route("/add-card", methods=['POST'])
@json_response
def insert_card():

    if request.method == 'POST':
        data_handler.insert_into_database_card(request.json)


@app.route("/add-board", methods=['POST'])
@json_response
def insert_board():

    if request.method == 'POST':
        data_handler.insert_into_database_board(request.json)


@app.route("/delete-card", methods=['POST'])
@json_response
def delete_card():
    card_id = request.json
    data_handler.delete_card_from_database(card_id)

    return 'deleted'


@app.route('/delete-board', methods=['POST'])
@json_response
def delete_board():
    board_id = request.json
    data_handler.delete_card_by_board_id(board_id)
    data_handler.delete_board(board_id)

    return 'deleted'


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
