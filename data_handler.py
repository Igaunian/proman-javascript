from connection import connection_handler
from psycopg2 import sql


@connection_handler
def get_card_status(cursor, status_id):
    cursor.execute(f' SELECT title FROM status WHERE id = {status_id}')
    status = cursor.fetchone()
    return status


@connection_handler
def get_card_placement(cursor, board_id, status_id):
    cursor.execute(f'SELECT MAX(placement) FROM card WHERE board_id={board_id} AND status_id={status_id}')

    placement = cursor.fetchone()
    if not placement:
        return 0
    else:
        try:
            placement = int(placement['max'])
        except:
            placement = 0
        return placement + 1


@connection_handler
def get_boards(cursor):
    cursor.execute(' SELECT * FROM board ')
    boards = cursor.fetchall()
    return boards


@connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute('''SELECT card.id AS cardid, card.board_id AS boardid, status.title AS statustitle, card.title AS cardtitle, status_id, placement 
    FROM card INNER JOIN status ON card.status_id = status.id 
    WHERE board_id = %s ORDER BY status_id, placement''' % board_id)

    cards_for_board = cursor.fetchall()
    return cards_for_board


@connection_handler
def insert_into_database_card(cursor, data):

    placement = get_card_placement(data['board_id'], data['status_id'])
    print(placement)

    cursor.execute('''INSERT INTO card (board_id, title, status_id, placement)
                      VALUES (%(board_id)s, %(title)s, %(status_id)s, %(placement)s);''',
                   {'board_id': data['board_id'], 'title': data['title'], 'status_id': data['status_id'],
                    'placement': placement})


@connection_handler
def insert_into_database_board(cursor, data):

    cursor.execute('''INSERT INTO board (title)
                      VALUES (%(title)s);''',
                   {'title': data['title']})


@connection_handler
def insert_into_database(cursor, table, data):

    status_id = data['status_id']
    board_id = data['board_id']
    data['placement'] = get_card_placement(board_id, status_id)

    query = sql.SQL('INSERT INTO {} ({}) '
                    'VALUES ({});').format(sql.Identifier(table),
                                           sql.SQL(', ').join(map(sql.Identifier, data.keys())),
                                           sql.SQL(', ').join(map(sql.Placeholder, data)))

    print(query)

    cursor.execute(query, data)


@connection_handler
def delete_card_from_database(cursor, card_id):
    cursor.execute('DELETE FROM card WHERE id=%(card_id)s;', {'card_id': card_id})


@connection_handler
def delete_card_by_board_id(cursor, board_id):
    cursor.execute("""DELETE FROM card 
                      WHERE board_id=%(board_id)s""",
                   {'board_id': board_id})


@connection_handler
def delete_board(cursor, board_id):
    cursor.execute("""DELETE FROM board
                      WHERE id=%(board_id)s""",
                   {'board_id': board_id})
