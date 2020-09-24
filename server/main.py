

if __name__ == '__main__':
    #model will live on server
    parser = argparse.ArgumentParser(description='Predict sharks from videos or YouTube live streams.')
    parser.add_argument('input_data', help="Either the URL of the YouTube live stream, or a local file path of an mp4 video.")
    args = parser.parse_args()