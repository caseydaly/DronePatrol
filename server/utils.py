import numpy as np
import cv2
import base64
from io import BytesIO
#makes image able to be sent over http
def get_image_from_byte_str(byte_str: str) -> np.ndarray:
    jpg_original = base64.b64decode(byte_str) #binary object
    jpg_as_np = np.frombuffer(jpg_original, dtype=np.uint8) #numpy jpg object
    image_buffer = cv2.imdecode(jpg_as_np, flags=1) #numpy buffer
    return image_buffer

#makes image able to be used by model
def get_bytes_from_img(img: np.ndarray) -> BytesIO:
    retval, buffer = cv2.imencode('.jpg', img)
    # Convert to base64 encoding and show start of data
    jpg_bytes = base64.b64encode(buffer)
    bytes_io = BytesIO(jpg_bytes)
    bytes_io.seek(0)
    return bytes_io
