from django import forms
from django.core.files.images import get_image_dimensions


class LogoUploadForm(forms.Form):
    """
    A simple form that handles one file - the new airline logo.
    """
    file = forms.ImageField()

    # Max logo dimensions
    max_width = 200
    max_height = 20

    def clean_file(self):
        """
        Check if the image has acceptable dimensions.
        @return: The image.
        @raise forms.ValidationError: The image exceeds maximum dimensions.
        """
        picture = self.cleaned_data.get('file')
        if not picture:
            raise forms.ValidationError("No image")

        w, h = get_image_dimensions(picture)
        if w > self.max_width or h > self.max_height:
            raise forms.ValidationError("The image size is over 85x18")

        return picture
