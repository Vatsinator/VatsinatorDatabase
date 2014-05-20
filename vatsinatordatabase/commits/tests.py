from django.test import TestCase

from models import Commit, CommitData

from vatsinatordatabase.airports.models import Airport
from vatsinatordatabase.airlines.models import Airline


class CommitTestCase(TestCase):
    def setUp(self):
        Airport.objects.create(name="Test Airport",
                               city="Test City",
                               country="Test Country",
                               iata="XYZ",
                               icao="XYZZ",
                               latitude=1.502,
                               longitude=152.02,
                               altitude=120)
        Airline.objects.create(name="Test Airline",
                               icao="XYZ",
                               country="Test Country",
                               website="",
                               logo="")

    def test_commit_token_unique(self):
        """
        Test that commit.create() method generates unique tokens.
        """
        airport = Airport.objects.get(icao="XYZZ")
        # this is funny test
        for i in range(100):
            commit = Commit.create(airport)
            commit.save()

    def test_commit_airline_merge(self):
        """
        Test that commits work on airlines.
        """
        airline = Airline.objects.get(icao="XYZ")
        self.assertTrue(isinstance(airline, Airline))
        commit = Commit.create(airline)
        self.assertTrue(isinstance(commit, Commit))
        commit.email = "from@example.com"
        commit.description = "Testing commits"
        commit.url = '/airlines/details/' + airline.icao
        commit.save()

        new_data = {
            'name': u'Test Airline after test',
            'country': u'Test Country after test',
            'website': u'xyz.example.com',
            'logo': ''
        }
        fields = ['name', 'country', 'website', 'logo']
        for f in fields:
            old = unicode(getattr(airline, f))
            new = new_data[f]

            if old != new:
                data = CommitData.create(commit, f, old, new)
                data.save()

        data_set = commit.commitdata_set.all()
        self.assertEqual(len(data_set), 3)
        commit.merge()

        airline = Airline.objects.get(icao="XYZ")
        self.assertEqual(commit.status, 'AC')
        self.assertEqual(airline.name, u"Test Airline after test")
        self.assertEqual(airline.country, u"Test Country after test")
        self.assertEqual(airline.website, u"xyz.example.com")

    def test_commit_airport_merge(self):
        """
        Test that commits work on airports.
        """
        airport = Airport.objects.get(icao="XYZZ")
        self.assertTrue(isinstance(airport, Airport))
        commit = Commit.create(airport)
        self.assertTrue(isinstance(commit, Commit))
        commit.email = "from@example.com"
        commit.description = "Testing commits"
        commit.url = '/airports/details/' + airport.icao
        commit.save()

        new_data = {
            'name': u'Test Airport after test',
            'city': u'Test City after test',
            'country': u'Test Country after test',
            'latitude': 2.00,
            'longitude': 2.00,
            'altitude': 220
        }
        fields = ['name', 'city', 'country', 'latitude', 'longitude', 'altitude']
        for f in fields:
            old = unicode(getattr(airport, f))
            new = new_data[f]

            if old != new:
                data = CommitData.create(commit, f, old, new)
                data.save()

        data_set = commit.commitdata_set.all()
        self.assertEqual(len(data_set), 6)
        commit.merge()

        airport = Airport.objects.get(icao="XYZZ")
        self.assertEqual(commit.status, 'AC')
        self.assertEqual(airport.name, u"Test Airport after test")
        self.assertEqual(airport.city, u"Test City after test")
        self.assertEqual(airport.country, u"Test Country after test")
        self.assertEqual(airport.latitude, 2.00)
        self.assertEqual(airport.longitude, 2.00)
        self.assertEqual(airport.altitude, 220)