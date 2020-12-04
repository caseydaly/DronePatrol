import pytest

class TestClass:
    @pytest.fixture(autouse=True)
    def client(self):
        self.something = "something"
    
    @classmethod
    def setup_class(cls):
        x = 2
        x += 1

    @classmethod
    def teardown_class(cls):
        x = 1  

    def test_something(self):
        assert self.something == "something"