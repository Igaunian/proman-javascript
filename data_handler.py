from connection import connection_handler


@connection_handler
def get_card_status(cursor, status_id):
    cursor.execute(f' SELECT title FROM status WHERE id = {status_id}')
    status = cursor.fetchone()
    return status


@connection_handler
def get_boards(cursor):
    cursor.execute(' SELECT * FROM board ')
    boards = cursor.fetchall()
    return boards


@connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute('''SELECT DISTINCT status.title AS statustitle, card.title AS cardtitle, status_id, placement 
    FROM card INNER JOIN status ON card.status_id = status.id 
    WHERE board_id = %s ORDER BY status_id, placement''' % board_id)

    cards_for_board = cursor.fetchall()
    return cards_for_board
