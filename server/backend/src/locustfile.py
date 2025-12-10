import json
import random
import string
from locust import HttpUser, task, between

def generate_random_user_data():
    random_suffix = random.randint(10000, 99999)
    random_string = ''.join(random.choices(string.ascii_lowercase, k=5))
    return {
        "password": "TempPassword123!",
        "telegram": f"@testuser{random_string}{random_suffix}",
        "email": f"testuser{random_string}{random_suffix}@example.com",
        "username": f"testuser{random_string}{random_suffix}"
    }

class AuthUser(HttpUser):
    wait_time = between(1, 3)

    @task(3) 
    def register_user(self):
        user_data = generate_random_user_data()

        response = self.client.post(
            "/api/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            print(f"Successfully registered user: {user_data['username']}")
            self.user_data = user_data
        elif response.status_code == 400:
            print(f"Registration failed for {user_data['username']}: User already exists or validation error.")
        else:
            print(f"Registration failed for {user_data['username']} with status {response.status_code}: {response.text}")
            response.failure(f"Got {response.status_code} when registering user {user_data['username']}")

    @task(1)
    def login_user(self):

        if hasattr(self, 'user_data'):
            login_data = {
                "username": self.user_data['username'],
                "password": self.user_data['password']
            }
        else:
            print("No user data available for login in this session, skipping.")
            return

        response = self.client.post(
            "/api/auth/login",
            data=login_data
        )
        if response.status_code == 200:
            print(f"Successfully logged in user: {login_data['username']}")

        elif response.status_code == 401:
            print(f"Login failed for {login_data['username']} with 401 Unauthorized. This might be due to the intentional logic error in verify_password.")
        else:
            print(f"Login failed for {login_data['username']} with status {response.status_code}: {response.text}")
            response.failure(f"Got {response.status_code} when logging in user {login_data['username']}")