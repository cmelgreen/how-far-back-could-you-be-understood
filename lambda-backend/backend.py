import urllib.request
import json
import regex
import boto3

def lambda_handler(event, context):
    try: 
        words = json.loads(event)['words']
        first_usage = {word: earliest_use(fetch_word(word)) for word in words}

        return json.dumps({
            'status_code': 200,
            'data': first_usage
        })

    except Exception as e:
        return json.dumps({
            'status_code': 400,
            'error': repr(e)
        })


def get_token():
    ssm = boto3.client('ssm')
    param = ssm.get_parameter(Name='/how-far-back/dictionary-api-token', WithDecryption=True)

    return param['Parameter']['value']
    

api = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/{word}?key={token}'
token = get_token()

def api_path(word, token):
    return api.format(word=word, token=token)

def fetch_word(word):
    with urllib.request.urlopen(api_path(word, token)) as url:
        data = json.loads(url.read().decode())
        return data

def earliest_use(entries):
    # TO-DO: check not obsolete usage
    # TO-DO: follow redirects i.e. follow 'API' to 'application programming interface'
    # DREAM TO-DO: implement analysis to get best usage
    return min([clean_date(entry['date']) for entry in entries if 'date' in entry])

def clean_date(date_string):
    date = int(regex.search('[0-9]+', date_string).group())

    # quick and dirty conversion of centuries 
    if date < 100:
        date = (date-1) * 100
    
    return date

event = json.dumps({'wors': ['check', 'this', 'sentence']})
print(lambda_handler(event, None))