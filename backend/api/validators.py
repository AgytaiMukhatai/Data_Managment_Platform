from django.core.exceptions import ValidationError
import re

class CustomPasswordValidator:
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError("The password must contain at least 1 uppercase letter.")
        if not re.search(r'[a-z]', password):
            raise ValidationError("The password must contain at least 1 lowercase letter.")
        if not re.search(r'[0-9]', password):
            raise ValidationError("The password must contain at least 1 digit.")
        if not re.search(r'[_!@#$%^&*(),.?":{}|<>]', password):
            raise ValidationError("The password must contain at least 1 special character.")

    def get_help_text(self):
        return "Your password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character."