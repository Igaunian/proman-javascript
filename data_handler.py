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
    if placement:
        return placement + 1
    else:
        return 0


@connection_handler
def get_boards(cursor):
    cursor.execute(' SELECT * FROM board ')
    boards = cursor.fetchall()
    return boards


@connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute('''SELECT card.id AS cardid, status.title AS statustitle, card.title AS cardtitle, status_id, placement 
    FROM card INNER JOIN status ON card.status_id = status.id 
    WHERE board_id = %s ORDER BY status_id, placement''' % board_id)

    cards_for_board = cursor.fetchall()
    return cards_for_board


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
def delete_from_database(cursor, table, column, condition=None):
    cursor.execute(f'DELETE {column} FROM {table} WHERE {condition};')

