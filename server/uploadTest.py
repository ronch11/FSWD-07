import requests
import time
# Replace the URL with the server URL where the upload endpoint is available
UPLOAD_URL = 'https://localhost:8000/api/videos/upload'

def upload_file(file_path, access_token):
    print(file_path)
    files = {'video': open(file_path, 'rb')}
    headers = {'Authorization' : 'bearer ' + access_token}
    try:
        response = requests.post(UPLOAD_URL, files=files, verify='server\security\certificate.pem', headers=headers)
    except Exception as e:
        print(e)
        return
    if response.status_code == 200:
        print("File uploaded successfully!")
        return response.json()
    else:
        print("File upload failed.", response.status_code, response.text)

def reactVideo(video_id, access_token, reaction):
    print(video_id)
    headers = {'Authorization' : 'bearer ' + access_token}
    body = {
        "reaction" : reaction
    }
    try:
        response = requests.post('https://localhost:8000/api/videos/react/' + video_id, verify='server\security\certificate.pem', headers=headers, json=body)
    except Exception as e:
        print(e)
        return
    if response.status_code == 200:
        print("Video " + reaction + " successfully!")
        return response.json()
    else:
        print("Video "+ reaction +" failed.", response.status_code, response.text)

def updateVideo(video_id, access_token, changes):
    headers = {'Authorization' : 'bearer ' + access_token}
    try:
        response = requests.put('https://localhost:8000/api/videos/update/' + video_id, verify='server\security\certificate.pem', headers=headers, json=changes)
    except Exception as e:
        print(e)
        return
    if response.status_code == 200:
        print("Video updated successfully!")
        return response.json()
    else:
        print("Video update failed.", response.status_code, response.text)

def getVideoDetails(video_id, access_token):
    headers = {'Authorization' : 'bearer ' + access_token}
    try:
        response = requests.get('https://localhost:8000/api/videos/details/' + video_id, verify='server\security\certificate.pem', headers=headers)
    except Exception as e:
        print(e)
        return
    if response.status_code == 200:
        print("Video details retrieved successfully!")
        return response.json()
    else:
        print("Video details retrieval failed.", response.status_code, response.text)

def createUser(username):
    body = {
        "username" : username,
        "firstName" : "Saar",
        "lastName" : "Taler",
        "email" : "dasdsadasd",
        "password" : "123456",
        "phone" : "1234567890",
    }
    try:
        response = requests.post('https://localhost:8000/api/users/CreateUser', verify='server\security\certificate.pem', json=body)
    except Exception as e:
        print(e)
        return
    if response.status_code < 300:
        print("User created successfully!")
        return response.json(), body['password']
    else:
        print("User creation failed.", response.status_code, response.text)

def login(username):
    body = {
        "username" : username,
        "password" : "123456"
    }

# get access token
    response = requests.post('https://localhost:8000/api/users/login', json=body, verify='server\security\certificate.pem')
    response.raise_for_status()
    print("Login successful!")
    return response.json()['accessToken']
    
file_path = 'C:\\Users\\Saar\\Videos\\2022-06-27 15-38-35.mkv' #input("Enter the file path: ")


username = "saar1"
# data, password = createUser(username)
access_token = login(username)
# data = upload_file(file_path, access_token)
# print(data)
video_id = '64b5b8eb1cf3edecff163b6d' # data['_id']
print('\n============================\n', getVideoDetails(video_id, access_token), '\n============================\n')
# print("changing")
# updateVideo(video_id, access_token, {"title" : "cool apex video", "description" : "a very cool apex video", "tags" : ["apex", "gaming"], 'visibility' : 'public'})
# print('\n============================\n', getVideoDetails(video_id, access_token), '\n============================\n')
reactVideo(video_id, access_token, "like")
print('\n============================\n', getVideoDetails(video_id, access_token), '\n============================\n')
print("sleeping")
time.sleep(20)
print("waking up")
reactVideo(video_id, access_token, "dislike")
print('\n============================\n', getVideoDetails(video_id, access_token), '\n============================\n')
print("sleeping")
time.sleep(20)
print("waking up")
reactVideo(video_id, access_token, "")
print('\n============================\n', getVideoDetails(video_id, access_token), '\n============================\n')


# Replace the file_path with the actual file path you want to upload
