"""
10-core.conf.py
"""

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
