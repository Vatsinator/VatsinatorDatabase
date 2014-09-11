from django import template
from django.conf import settings


class TransifexLiveNode(template.Node):
    def __init__(self):
        if settings.TRANSIFEX_LIVE_ENABLED:
            try:
                self.api_key = settings.TRANSIFEX_LIVE_KEY
            except NameError:
                self.api_key = None
        else:
            self.api_key = None

    def render(self, context):
        if self.api_key is not None:
            js_code = \
                '<script type="text/javascript">' + \
                'window.liveSettings = {' + \
                'api_key:"%s",' % self.api_key + \
                'detectlang:true,' + \
                'autocollect:true' + \
                '};' + \
                '</script>'+ \
                '<script type="text/javascript" src="//cdn.transifex.com/live.js"></script>\n'
            return js_code
        else:
            return ''


register = template.Library()


@register.tag
def txlive_script(parser, token):
    """
    Creates a Transifex Live script that enables auto translations using this service.
    To provide the Api Key, set TRANSIFEX_LIVE_KEY in settings.py.
    If no key is specified, no output is generated.
    :return: The Transifex Live integration code snippet.
    """
    return TransifexLiveNode()
