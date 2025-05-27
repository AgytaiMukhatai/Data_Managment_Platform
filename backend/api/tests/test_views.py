from django.test import TestCase, Client
from api.models import GeneralUser
from django.urls import reverse
from django.contrib.auth.hashers import make_password

class UserTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.test_user = GeneralUser.objects.create(
            email="test@example.com",
            username="testuser",
            password=make_password("testpass123")  # Hash the password
        )

    def test_user_creation(self):
        self.assertEqual(GeneralUser.objects.count(), 1)
        self.assertEqual(self.test_user.email, "test@example.com")

    def test_login_user(self):
        response = self.client.post(reverse('api:login'), {
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, 200)

    def test_invalid_login(self):
        response = self.client.post(reverse('api:login'), {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 400)
    
    def test_register_user(self):
            response = self.client.post(reverse('api:register'), {
                'email': 'newuser@example.com',
                'username': 'newuser',
                'password': 'Newpass_123',
                'confirm_password': 'Newpass_123'
            })
            self.assertEqual(response.status_code, 201)
            self.assertTrue(GeneralUser.objects.filter(email='newuser@example.com').exists())

    def test_register_invalid_data(self):
        response = self.client.post(reverse('api:register'), {
            'email': 'invalid-email',
            'password': 'short'
        })
        self.assertEqual(response.status_code, 400)

    def test_password_change(self):
        self.client.force_login(self.test_user)  # Add authentication
        token = self.test_user.verification_token
        response = self.client.post(reverse('api:password-change', kwargs={'token': token}), {
            'password': 'Newpass_123',
            'confirm_password': 'Newpass_1234'
        })
        self.assertEqual(response.status_code, 201)
    
    def test_invalid_password_change(self):
        token = self.test_user.verification_token
        response = self.client.post(reverse('api:password-change', kwargs={'token': token}), {
            'password': 'new',
            'confirm_password': 'different'
        })
        self.assertEqual(response.status_code, 400)




    
    def test_forgot_password(self):
        response = self.client.post(reverse('api:forgot-password'), {
            'email': 'test@example.com'
        })
        self.assertEqual(response.status_code, 200)

    def test_verify_email(self):
        self.client.force_login(self.test_user)  # Add authentication
        token = self.test_user.verification_token
        response = self.client.get(reverse('api:verify-email', kwargs={'token': token}))
        self.assertEqual(response.status_code, 200)