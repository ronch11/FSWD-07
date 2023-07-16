import requests

# Replace the URL with the server URL where the upload endpoint is available
UPLOAD_URL = 'http://localhost:8000/upload'

def upload_file(file_path):
    print(file_path)
    files = {'video': open(file_path, 'rb')}
    response = requests.post(UPLOAD_URL, files=files)

    if response.status_code == 200:
        print("File uploaded successfully!")
    else:

        print("File upload failed.", response.status_code, response.text)

# Replace the file_path with the actual file path you want to upload
file_path = input("Enter the file path: ")

upload_file(file_path)