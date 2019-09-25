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
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>", methods=['GET', 'POST'])
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param data:
    :param board_id: id of the parent board
    """

    if request.method == 'POST':
        data_handler.insert_into_database('card', request.json)

    return data_handler.get_cards_for_board(board_id)


@app.route("/delete-card/<int:card_id>", methods=['GET', 'POST'])
@json_response
def delete_card(card_id: int):
    """
    All cards that belongs to a board
    :param card_id:
    :param data:
    """
    print(card_id)
    if request.method == 'POST':
        data_handler.delete_card_from_database(card_id)

        return app.make_response('deleted')


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
