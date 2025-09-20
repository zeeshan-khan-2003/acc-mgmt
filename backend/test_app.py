
import unittest
import json
from app import app, db

class AuthTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_register(self):
        response = self.app.post('/register',
                                 data=json.dumps(dict(username='test', loginId='test', email='test@test.com', password='password')),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_login(self):
        self.app.post('/register',
                      data=json.dumps(dict(username='test', loginId='test', email='test@test.com', password='password')),
                      content_type='application/json')
        response = self.app.post('/login',
                                 data=json.dumps(dict(loginId='test', password='password')),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.get_json())

    def test_get_contacts_without_token(self):
        response = self.app.get('/api/contacts')
        self.assertEqual(response.status_code, 401)

    def test_get_contacts_with_token(self):
        self.app.post('/register',
                      data=json.dumps(dict(username='test', loginId='test', email='test@test.com', password='password')),
                      content_type='application/json')
        login_response = self.app.post('/login',
                                       data=json.dumps(dict(loginId='test', password='password')),
                                       content_type='application/json')
        token = login_response.get_json()['access_token']
        response = self.app.get('/api/contacts',
                                headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
