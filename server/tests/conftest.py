import os
import sys
import tempfile
import pytest
cwd = os.path.dirname(os.path.realpath(__file__))
sys.path.append(cwd + "/..")
from app import app as flask_app



@pytest.fixture
def app():
    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()

