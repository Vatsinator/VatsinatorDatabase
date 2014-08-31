from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string

from models import Commit, post_merge


@receiver(post_save, sender=Commit, dispatch_uid="new_commit_notify_admins")
def notify_managers(sender, instance, created, **kwargs):
    """
    Send an e-mail to managers telling them that a new commit has been created by the user.
    @param sender: Signal sender.
    @param instance: The actual instance being saved.
    @param created: A boolean; True if a new record was created.
    @param kwargs: Additional arguments.
    """
    if created:
        commit = instance
        subject = "New commit has been created"
        email_from = settings.DEFAULT_FROM_EMAIL
        email_to = [e[1] for e in settings.MANAGERS]

        html_content = render_to_string('commits/email-notification-admin.html', {
            'commit': commit,
        })

        text_content = render_to_string('commits/email-notification-admin.txt', {
            'commit': commit,
        })

        msg = EmailMultiAlternatives(subject, text_content, email_from, email_to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()


@receiver(post_merge, sender=Commit, dispatch_uid="commit_merged_notify_user")
def notify_user(sender, instance, **kwargs):
    """
    Send an e-mail to the user that created the commit.
    @param sender: Signal sender.
    @param instance: The actual instance being merged.
    @param kwargs: Additional arguments.
    """
    commit = instance
    if commit.email != '':
        subject = "Your commit has been accepted"
        email_from = settings.DEFAULT_FROM_EMAIL
        email_to = [commit.email]

        html_content = render_to_string('commits/email-notification-user.html', {
            'commit': commit,
        })

        text_content = render_to_string('commits/email-notification-user.txt', {
            'commit': commit
        })

        msg = EmailMultiAlternatives(subject, text_content, email_from, email_to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
