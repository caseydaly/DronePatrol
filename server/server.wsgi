#server.wsgi
import sys
sys.stdout = open('/home/ubuntu/SharkWatch/server/output.txt', 'a+')
print("triggered")
sys.path.insert(0, '/var/www/html/server')

from app import app as application
