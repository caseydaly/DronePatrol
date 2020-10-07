# Drone Patrol documentation

### Running

I still have to work out some kinks with deploying this bad boy with Apache on our Ubunutu server, but for the time being, navigate to server and run

```python3 app.py```

This will allow you to run the app in the browser of another computer when you navigate to the EC2 public domain address for the instance. After running the above command in the server directory, go to AWS and find your EC2 "Public IPv4 DNS", which is something like ec2-54-176-43-108.us-west-1.compute.amazonaws.com (it changes frequently based on what AWS gives you when you boot up the instance). With this, go to your browser and type in the URL http://<public_ipv4_dns_from_above>:5000/ because flask should be running on port 5000. I have found that its easiest to work with Chrome, and Safari has given me some troubles rendering the predicted images.

If you would like to just test it locally (although the predictions will happen insanely slow), simply run the same command above in the server directory, and then in your (preferably Chrome) browser go to http://localhost:5000/

### Testing

The tests are located in server/tests, and you can run them by running "pytest" from the server directory. To add more tests, add a test method in a file in the tests directory, and the test method name must start with "test_".
