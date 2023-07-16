import requests

# Replace the URL with the server URL where the upload endpoint is available
UPLOAD_URL = 'https://localhost:8000/api/videos/upload'

def upload_file(file_path):
    print(file_path)
    files = {'video': open(file_path, 'rb')}
    try:
        response = requests.post(UPLOAD_URL, files=files, verify='server\security\certificate.pem')
    except Exception as e:
        print(e)
        return
    if response.status_code == 200:
        print("File uploaded successfully!")
    else:

        print("File upload failed.", response.status_code, response.text)

# Replace the file_path with the actual file path you want to upload
file_path = 'C:\\Users\\Saar\\Videos\\2022-06-27 15-38-35.mkv' #input("Enter the file path: ")

upload_file(file_path)