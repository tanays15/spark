import os
from moviepy.editor import VideoFileClip

def convert_webm_to_mp4(webm_path):
    """
    Converts a .webm file to .mp4 and saves it in the same directory.

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

    # Define output .mp4 file path
    mp4_path = os.path.join(directory, f"{filename}.mp4")

    try:
        # Load the video file
        video = VideoFileClip(webm_path)
        
        # Write the output video as mp4
        video.write_videofile(mp4_path, codec="libx264", audio_codec="aac")

        print(f"Conversion successful! Saved at: {mp4_path}")
        return mp4_path
    except Exception as e:
        print(f"Error during conversion: {e}")
        return None

# Example Usage
webm_file = "/web1.webm"  # Replace with actual path
convert_webm_to_mp4(webm_file)
