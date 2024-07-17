import os
from getpass import getpass

from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Access the API key
google_api_key = os.getenv("GOOGLE_API_KEY")

# Prompt for API key if not found
if google_api_key is None:
    google_api_key = getpass.getpass("Provide your Google API key here: ")
    os.environ["GOOGLE_API_KEY"] = google_api_key
