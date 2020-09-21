#sharkapp.wsgi
import sys
sys.path.insert(0, '/var/www/html/sharkapp')

from sharkapp import app as application
