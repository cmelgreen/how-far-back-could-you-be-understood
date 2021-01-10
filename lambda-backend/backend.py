import urllib.request
import json
import re
import boto3
import os
from multiprocessing import Process, Pipe

def lambda_handler(event, context):
    try:
        words = event['queryStringParameters']['words'].split(',')
        first_uses = parallelize(fetch_and_find_earliest_use, words)

        results = dict()
        for use in first_uses:
            results.update(use)

        return lambda_response(200, results)

    except Exception as e:
        return lambda_response(400, repr(e))

def parallelize(f, args):
        processes = []
        parent_connections = []

        def parallel_factory(f):
            def parallel_f(conn, arg):
                conn.send(f(arg))
                conn.close()
            
            return parallel_f

        parallel_f = parallel_factory(f)
        
        for arg in args:            
            parent_conn, child_conn = Pipe()
            parent_connections.append(parent_conn)

            process = Process(target=parallel_f, args=(child_conn, arg))
            processes.append(process)

        for process in processes:
            process.start()

        for process in processes:
            process.join()

        results = []
        for parent_connection in parent_connections:
            results.append(parent_connection.recv())

        return results
        
def lambda_response(code, body):
    return {
        "isBase64Encoded": False,
        "statusCode": code,
        "headers": {},
        "multiValueHeaders": {},
        "body": json.dumps(body)
    }

def get_token():
    try: 
        ssm = boto3.client('ssm')
        param = ssm.get_parameter(Name='/how-far-back/dictionary-api-token', WithDecryption=True)

        return param['Parameter']['Value']
    except Exception as e:
        return e

    try:
        return os.environ.get('MERRIAM_WEBSTER_TOKEN')
    except Exception as e:
        return e
    

api = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/{word}?key={token}'
token = get_token()

def api_path(word, token):
    return api.format(word=word, token=token)

def fetch_and_find_earliest_use(word):
    return {word: earliest_use(fetch_word(word))}

def fetch_word(word):
    with urllib.request.urlopen(api_path(word, token)) as url:
        data = json.loads(url.read().decode())
        return data

## Dictionary can contain multiple entires for a word, find earliest used
def earliest_use(entries):
    # TO-DO: check not obsolete usage
    # TO-DO: follow redirects i.e. follow 'API' to 'application programming interface'
    # DREAM TO-DO: implement analysis to get best usage
    return min([clean_date(entry['date']) for entry in entries if 'date' in entry])

def clean_date(date_string):
    date = int(re.search('[0-9]+', date_string).group())

    # quick and dirty conversion of centuries 
    if date < 100:
        date = (date-1) * 100
    
    return date