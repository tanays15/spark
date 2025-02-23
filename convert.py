import cloudconvert
import os

API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwian..."  # Your API Key

def convert_webm_to_mp4(webm_path):
    """
    Converts a .webm file to .mp4 using CloudConvert API and saves it in the same directory.

    :param webm_path: Full path to the .webm file
    :return: Path of the converted .mp4 file
    """
    if not os.path.exists(webm_path):
        raise FileNotFoundError(f"File not found: {webm_path}")

    if not webm_path.lower().endswith('.webm'):
        raise ValueError("Input file must be a .webm file")

    # Get directory and filename without extension
    directory = os.path.dirname(webm_path)
    filename = os.path.splitext(os.path.basename(webm_path))[0]
    mp4_path = os.path.join(directory, f"{filename}.mp4")

    # Initialize CloudConvert API
    cloudconvert.Api(api_key=API_KEY)

    try:
        # Create conversion task
        job = cloudconvert.Job.create(payload={
            "tasks": {
                "import-file": {
                    "operation": "import/upload"
                },
                "convert-file": {
                    "operation": "convert",
                    "input": "import-file",
                    "output_format": "mp4",
                    "video_codec": "h264",
                    "audio_codec": "aac"
                },
                "export-file": {
                    "operation": "export/download",
                    "input": "convert-file"
                }
            }
        })

        # Upload the file
        upload_task = job["tasks"][0]
        with open(webm_path, "rb") as file:
            cloudconvert.Task.upload(file, upload_task)

        # Wait for conversion and get download URL
        job = cloudconvert.Job.wait(job["id"])
        export_task = job["tasks"][-1]
        file_url = export_task.get("result", {}).get("files", [])[0].get("url")

        if not file_url:
            raise Exception("Conversion failed: No download URL found.")

        # Download the converted file
        response = cloudconvert.download(file_url, mp4_path)
        
        print(f"Conversion successful! Saved at: {mp4_path}")
        return mp4_path

    except Exception as e:
        print(f"Error during conversion: {e}")
        return None

# Example Usage
webm_file = "/path/to/video.webm"  # Replace with actual path
convert_webm_to_mp4(webm_file)