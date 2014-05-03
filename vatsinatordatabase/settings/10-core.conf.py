"""
10-core.conf.py
"""

# Base URL of the project instance
DOMAIN_NAME = 'database.vatsinator.eu.org'

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# https://docs.djangoproject.com/en/dev/ref/settings/#sites
SITE_ID = 1

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': {
            'read_default_file': os.path.join(os.path.dirname(__file__), 'settings', 'db.cnf'),
        },
    }
}
