import pafy
import youtube_dl
import cv2


ydl_opts = {
    'nocheckcertificate:': True
}

class LiveStream:
    def __init__(self, url, drone):
        self.url = url
        self.drone = drone
        video = pafy.new(url, ydl_opts=ydl_opts)
        best = video.getbest(preftype="mp4")
        self.vid_cap = cv2.VideoCapture()
        self.vid_cap.open(best.url)

    def is_valid_video(url):
        try:
            video = pafy.new(url, ydl_opts=ydl_opts)
            best = video.getbest(preftype="mp4")
            temp = cv2.VideoCapture()
            temp.open(best.url)
            return True
        except:
            print("Caught exception loading YouTube video/stream.")
            return False
