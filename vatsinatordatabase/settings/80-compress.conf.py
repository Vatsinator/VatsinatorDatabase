"""
80-compress.conf.py
"""

COMPRESS_CSS_FILTERS = ['compressor.filters.cssmin.CSSMinFilter',]
COMPRESS_JS_FILTERS = ['compressor.filters.jsmin.SlimItFilter',]