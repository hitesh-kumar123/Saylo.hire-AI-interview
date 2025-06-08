import os
import uuid
from werkzeug.utils import secure_filename
from pypdf import PdfReader
from app.config import Config

def allowed_file(filename, allowed_extensions=None):
    """Check if the file extension is allowed."""
    if allowed_extensions is None:
        allowed_extensions = {'pdf', 'docx', 'doc', 'txt'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def save_uploaded_file(file, directory=None, prefix=''):
    """
    Save an uploaded file to the specified directory with a secure filename.
    Returns the file path and the secure filename.
    """
    if directory is None:
        directory = Config.UPLOAD_FOLDER
    
    # Create directory if it doesn't exist
    os.makedirs(directory, exist_ok=True)
    
    # Generate a secure filename with a UUID to avoid collisions
    original_filename = secure_filename(file.filename)
    extension = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
    unique_filename = f"{prefix}{uuid.uuid4().hex}.{extension}" if extension else f"{prefix}{uuid.uuid4().hex}"
    
    # Save the file
    file_path = os.path.join(directory, unique_filename)
    file.save(file_path)
    
    return file_path, unique_filename

def extract_text_from_pdf(pdf_path):
    """Extract text content from a PDF file."""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return "" 