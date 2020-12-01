# Drone Patrol documentation

### Deploying

For the time being, we have to do manual deployments until we can get a CI/CD pipeline going.

That being said, to deploy, log in to the server and pull all of the recent code changes. Then build the client code/react portion of the project by running...

```yarn build```

from the root directory of the project. Once its all built, you simply need to restart the Apache server with 

```sudo service apache2 restart```

### Testing

The server side python/flask tests are located in backend/tests, and you can run them by running "pytest" from the backend directory. To add more tests, add a test method in a file in the tests directory, and the test method name must start with "test_".

React tests are going to be done with Jest, and I don't have much on this so far but will be looking into it soon.
