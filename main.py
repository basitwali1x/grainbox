"""
Main entry point for Render and WSGI servers.
Exports the Flask application from app.py so both 'gunicorn main:app' and 'gunicorn app:app' work seamlessly.
"""

import os
from app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
