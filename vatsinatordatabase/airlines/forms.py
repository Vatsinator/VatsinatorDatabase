from django import forms
from django.core.files.images import get_image_dimensions


class LogoUploadForm(forms.Form):
    """
    A simple form that handles one file - the new airline )logo.
    """
    file = forms.ImageField()

    # Max logo dimensions
    max_width = 85
    max_height = 18

    def clean_file(self):
        """
        Check if the uploaded logo file has dimensions small enough.
        """
        picture = self.cleaned_data.get('file')
        if not picture:
            raise forms.ValidationError("No image")

        w, h = get_image_dimensions(picture)
        if w > self.max_width or h > self.max_height:
            raise forms.ValidationError("The image size is over 85x18")

        return picture
