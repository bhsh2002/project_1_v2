def test_shelves_csv_download(client, admin_cookies):
    headers = {"Cookie": "; ".join(admin_cookies)}
    resp = client.get("/api/v1/shelves/download/csv/market/1", headers=headers)
    # CSV can be empty string if market has no shelves; status should be 200
    assert resp.status_code == 200
    assert resp.mimetype == "text/csv"
