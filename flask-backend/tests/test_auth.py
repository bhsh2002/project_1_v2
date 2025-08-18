def test_hello_api(client):
    """Test the /hello-api endpoint."""
    resp = client.get("/hello-api")
    assert resp.status_code == 200
    assert resp.get_json() == {"message": "Hello from APIFlask Project-1 V2!"}


def test_login_and_me(client, admin_cookies):
    # Verify current user endpoint works with cookies
    headers = {"Cookie": "; ".join(admin_cookies)}
    resp = client.get("/api/v1/auth/me", headers=headers)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["username"] == "admin"
