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


body = {
    "username" : "JohnDoe",
    "password" : "123456"
}

# get access token
response = requests.post('https://localhost:8000/api/users/login', json=body, verify='server\security\certificate.pem')
if response.status_code == 200:
    print("Login successful!")
    access_token = response.json()['accessToken']
    print(access_token)
    file_path = 'C:\\Users\\Saar\\Videos\\2022-06-27 15-38-35.mkv' #input("Enter the file path: ")

    data = upload_file(file_path, access_token)
    print(data)
    video_id = data['_id']
    print(video_id)
    reactVideo(video_id, access_token, "like")
    print(getVideoDetails(video_id, access_token))
    print("changing")
    updateVideo(video_id, access_token, {"title" : "cool apex video", "description" : "a very cool apex video", "tags" : ["apex", "gaming"]})
    print(getVideoDetails(video_id, access_token))
    print("sleeping")
    time.sleep(20)
    print("waking up")
    reactVideo(video_id, access_token, "dislike")
    print(getVideoDetails(video_id, access_token))
    print("sleeping")
    time.sleep(20)
    print("waking up")
    reactVideo(video_id, access_token, "")
    print(getVideoDetails(video_id, access_token))
else:
    print("Login failed.", response.status_code, response.text)


# Replace the file_path with the actual file path you want to upload
