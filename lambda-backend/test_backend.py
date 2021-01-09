import unittest
import backend as b

class TestBackend(unittest.TestCase):
    def test_api_path(self):
        self.assertEqual(b.api_path('word', 'token'), 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/word?key=token')

    def test_lambda_handler(self):
        pass