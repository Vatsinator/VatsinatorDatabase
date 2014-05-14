from django.db import IntegrityError
from django.test import TestCase

from models import Airline


class AirlineTestCase(TestCase):
    def setUp(self):
        Airline.objects.create(name="Test Airline 1",
                               icao="XYZ",
                               country="Test Country",
                               website="",
                               logo="")

    def test_airline_correct(self):
        """
        Test that airline has correct unicode representation.
        """
        airline = Airline.objects.get(icao="XYZ")
        self.assertTrue(isinstance(airline, Airline))
        self.assertEqual(airline.__unicode__(), u"XYZ Test Airline 1")

    def test_airline_icao_is_unique(self):
        """
        Test that two airlines of the same ICAO code cannot be inserted to the same database.
        """
        self.assertRaises(IntegrityError, Airline.objects.create, icao="XYZ")

    def test_airline_search_view(self):
        """
        Test default index - "search" page.
        """
        self.assertEqual(self.client.get('/airlines/').status_code, 200)
        self.assertEqual(self.client.get('/airlines/search').status_code, 200)
        self.assertEqual(self.client.get('/airlines/search/').status_code, 200)
        self.assertEqual(self.client.get('/airlines/search', {'q': 'ABC'}).status_code, 200)
        self.assertEqual(self.client.get('/airlines/search', {'q': 'XYZ'}).status_code, 200)

        # if no query specified, should return default search view
        self.assertTrue('q' not in self.client.get('/airlines/search/').context)

    def test_airline_details_view(self):
        """
        Test airline details view.
        """
        self.assertEqual(self.client.get('/airlines/details/').status_code, 404)
        self.assertEqual(self.client.get('/airlines/details/ABC').status_code, 404)
        r = self.client.get('/airlines/details/XYZ')
        self.assertEqual(r.status_code, 200)
        self.assertTrue('a' in r.context)
        self.assertTrue('max_logo_width' in r.context)
        self.assertTrue('max_logo_height' in r.context)

    def test_airline_save(self):
        """
        Test airline save view.
        """
        self.assertEqual(self.client.get('/airlines/save/').status_code, 404)
        self.assertEqual(self.client.get('/airlines/save/XYZ').status_code, 405)

        Airline.objects.create(name="Test Airline 2",
                               icao="QWE",
                               country="Test Country",
                               website="",
                               logo="")

        data = {
            'email': 'test@example.com',
            'description': 'Testing save method',
            'name': 'Test Airline 2 after save',
            'country': 'Test Country after save',
            'website': 'test-airline.example.com',
            'logo': ''
        }
        r = self.client.post('/airlines/save/QWE', data)
        self.assertEqual(r.status_code, 200)
        airline = Airline.objects.get(icao="QWE")
        self.assertTrue(isinstance(airline, Airline))



        #TODO Test upload logo
