#contains a frame with boxed predictions displayed, as well as its corresponding labels
class PredictedImage:
    def __init__ (self, frame, labels):
        self.frame = frame
        self.labels = labels
