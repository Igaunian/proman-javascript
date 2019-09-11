import persistence
from connection import connection_handler
from psycopg2 import sql


@connection_handler
def get_card_status(cursor, status_id):
    cursor.execute(f' SELECT title FROM status WHERE id = {status_id}')
    status = cursor.fetchone()
    return status


@connection_handler
def get_boards(cursor):
    cursor.execute(' SELECT title FROM board ')
    boards = cursor.fetchall()
    return boards


@connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute('''SELECT DISTINCT status.title AS statustitle, card.title AS cardtitle, status_id, placement 
    FROM card INNER JOIN status ON card.status_id = status.id 
    WHERE board_id = %s ORDER BY status_id''' % board_id)

    cards_for_board = cursor.fetchall()
    return cards_for_board


#def get_card_status(status_id):
 #   """
  #  Find the first status matching the given id
   # :param status_id:
    #:return: str
    #"""
    #statuses = persistence.get_statuses()
    #return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


#def get_boards():
 #   """
  #  Gather all boards
   # :return:
    #"""
    #return persistence.get_boards(force=True)



# matching_cards here means the cards that have the same board_id :)


# def get_cards_for_board(board_id):
#     persistence.clear_cache()
#     all_cards = persistence.get_cards()
#     matching_cards = []
#     for card in all_cards:
#         if card['board_id'] == str(board_id):
#             card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
#             matching_cards.append(card)
#     return matching_cards
