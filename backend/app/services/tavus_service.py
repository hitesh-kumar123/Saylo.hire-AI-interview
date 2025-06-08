import requests
from app.config import Config

class TavusService:
    def __init__(self):
        self.api_key = Config.TAVUS_API_KEY
        self.api_url = Config.TAVUS_API_URL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def _make_request(self, method, endpoint, data=None, files=None):
        """Make a request to the Tavus API."""
        url = f"{self.api_url}/{endpoint}"
        
        # Handle file uploads differently
        if files:
            # Requests for file uploads need special handling for content type
            headers = self.headers.copy()
            if "Content-Type" in headers:
                del headers["Content-Type"]
            response = requests.request(method, url, json=data, files=files, headers=headers)
        else:
            response = requests.request(method, url, json=data, headers=self.headers)
            
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        return response.json()

    def process_resume_for_interview_context(self, file_content, filename):
        """
        Process a resume file for interview context.
        This is a placeholder for the actual Tavus API call.
        
        Note: The actual implementation depends on how Tavus expects resume data.
        Options:
        1. Upload file directly to Tavus and get a resume_id
        2. Extract text locally and send as context to Tavus agent
        """
        # Example implementation - adjust based on Tavus API docs
        files = {'file': (filename, file_content, 'application/pdf')}
        try:
            return self._make_request('POST', 'resumes', files=files)
        except Exception as e:
            print(f"Error processing resume: {e}")
            return {"status": "error", "message": str(e)}

    def create_livekit_agent_session(self, job_title, job_description, resume_summary_text, user_id):
        """
        Initiates a Tavus agent interview and gets LiveKit connection info.
        Refer to Tavus API documentation for exact endpoint and payload structure.
        """
        # Example payload - adjust according to Tavus API docs
        payload = {
            "interview_type": "job_mock",
            "job_title": job_title,
            "job_description": job_description,
            "candidate_resume_summary": resume_summary_text,  # Or Tavus resume ID
            "metadata": {"user_id": str(user_id)}  # Useful for tracking
        }
        
        try:
            # Adjust endpoint based on Tavus API docs
            return self._make_request('POST', 'agent/livekit_session', data=payload)
        except Exception as e:
            print(f"Error creating LiveKit session: {e}")
            return {"status": "error", "message": str(e)}

    def get_interview_transcript(self, call_id):
        """
        Retrieve the transcript of a completed interview.
        """
        try:
            # Adjust endpoint based on Tavus API docs
            return self._make_request('GET', f'calls/{call_id}/transcript')
        except Exception as e:
            print(f"Error retrieving transcript: {e}")
            return {"status": "error", "message": str(e)}

    def check_call_status(self, call_id):
        """
        Check the status of a call/interview.
        """
        try:
            # Adjust endpoint based on Tavus API docs
            return self._make_request('GET', f'calls/{call_id}')
        except Exception as e:
            print(f"Error checking call status: {e}")
            return {"status": "error", "message": str(e)} 