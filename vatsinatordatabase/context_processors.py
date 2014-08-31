from django.conf import settings


def in_beta(request):
    return {'in_beta': settings.IN_BETA}
