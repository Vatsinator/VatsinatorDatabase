from django.db import IntegrityError
from django.test import TestCase

from models import Airport


class AirportTestCase(TestCase):
    def setUp(self):
        Airport.objects.create(name="Test Airport 1",
                               city="Test City",
                               country="Test Country",
                               iata="XYZ",
                               icao="XYZZ",
                               latitude=1.502,
                               longitude=152.02,
                               altitude=120)

    def test_airport_unicode(self):
        """
        Test that airport has correct unicode representation.
        """
        airport = Airport.objects.get(icao="XYZZ")
        self.assertTrue(isinstance(airport, Airport))
        self.assertEqual(airport.__unicode__(), u"XYZZ Test Airport 1, Test City, Test Country")

    def test_airport_icao_is_unique(self):
        """
        Test that two airports of the same ICAO code cannot be inserted to the same database.
        """
        self.assertRaises(IntegrityError, Airport.objects.create, icao="XYZZ")

    def test_airport_search_view(self):
        """
        Test default index - "search" page.
        """
        self.assertEqual(self.client.get('/airports/').status_code, 200)
        self.assertEqual(self.client.get('/airports/search').status_code, 200)
        self.assertEqual(self.client.get('/airports/search/').status_code, 200)
        self.assertEqual(self.client.get('/airports/search', {'q': 'ABCD'}).status_code, 200)
        self.assertEqual(self.client.get('/airports/search', {'q': 'XYZZ'}).status_code, 200)

        # if no query specified, should return default search view
        self.assertTrue('q' not in self.client.get('/airports/search/').context)

    def test_airport_details_view(self):
        """
        Test airline details view.
        """
        self.assertEqual(self.client.get('/airports/details/').status_code, 404)
        self.assertEqual(self.client.get('/airports/details/ABCD').status_code, 404)
        r = self.client.get('/airports/details/XYZZ')
        self.assertEqual(r.status_code, 200)
        self.assertTrue('ap' in r.context)

    def test_airport_save(self):
        """
        Test airline save view.
        """
        self.assertEqual(self.client.get('/airports/save/').status_code, 404)
        self.assertEqual(self.client.get('/airports/save/XYZZ').status_code, 405)

        Airport.objects.create(name="Test Airport 2",
                               city="Test City",
                               country="Test Country",
                               icao="QWER",
                               iata="QWE",
                               latitude=1.0,
                               longitude=1.0,
                               altitude=1
        )

        data = {
            'email': 'test@example.com',
            'description': 'Testing save method',
            'name': 'Test Airport 2 after save',
            'city': 'Test City 2 after save',
            'country': 'Test Country after save',
            'iata': 'QWA',
            'latitude': 2.0,
            'longitude': 2.0,
            'altitude': 2
        }
        r = self.client.post('/airports/save/QWER', data)
        self.assertEqual(r.status_code, 200)
        airport = Airport.objects.get(icao="QWER")
        self.assertTrue(isinstance(airport, Airport))