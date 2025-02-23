from config import Config
from flask import Blueprint, request, jsonify
from models import Topic, db, Record, User
from pydub import AudioSegment
import cv2
import mediapipe as mp
import statistics
import math
from deepface import DeepFace
import numpy as np
import librosa
import numpy as np
import torch
import ffmpeg as ff
import time
import io
import json
import re
import whisper
import openai
import os
from dotenv import load_dotenv
import tempfile


# Add the neighbor_folder to sys.path

# Now you can import the Python files from the neighbor folder

OUTPUT_DIR = "converted_files"
os.makedirs(OUTPUT_DIR, exist_ok=True)

record_bp = Blueprint("record_bp", __name__)
# comment


@record_bp.route("/records", methods=["POST", "GET"])
def manage_records():
    if request.method == "GET":
        username = request.args.get('username')
        topic = request.args.get('topic')
        if not username and not topic:
            return jsonify({"error": "Invalid username or topic"}), 400
        user = User.query.filter_by(username=username).first()
        topic = Topic.query.filter_by(name=topic).first()
        if not user:
            return jsonify({"error": "User or Topic does not exist"})
        records = Record.query.filter_by(
            user_id=user.id, topic_id=topic.id).all()
        return jsonify([record.to_dict() for record in records]), 200
    elif request.method == "POST":

        username = request.form.get("userId")
        topicName = request.form.get("topic")
        file = request.files.get("video")
        # contentScore = data.get("contentScore")
        # confidenceScore = data.get("confidenceScore")
        # totalScore = (contentScore + confidenceScore) // 2
        if not username or not topicName or not file:
            return jsonify({"error": "Invalid username, topic, or video"}), 400
        user = User.query.filter_by(auth0_id=username).first()
        topic = Topic.query.filter_by(name=topicName).first()

        if not user:
            return jsonify({"error": "User or Topic does not exist"}), 400
        
        if not topic:
            topic = Topic(name=topicName, user_id=user.id)
            db.session.add(topic)
            db.session.commit()
            topic = Topic.query.filter_by(name=topicName).first()
        
        if file:
            # Create output directory if not exists
            save_dir = "saved_files"
            os.makedirs(save_dir, exist_ok=True)

            # Save the original file
            input_path = os.path.join(save_dir, "input.mp4")
            file.save(input_path)

            # Define output paths
            output_audio_path = os.path.join(save_dir, "output.wav")
            output_video_path = os.path.join(save_dir, "output.mp4")

            # Convert to WAV (Extract audio)
            ff.input(input_path).output(output_audio_path, format="wav").run()

            # Convert to MP4 (If re-encoding is needed)
            ff.input(input_path).output(output_video_path, format="mp4").run()
            content_score, feedback, resources = extract_score_and_feedback(output_audio_path)
            audio_score = test_audio_analysis(output_audio_path)

            visual_score = final_rating(output_video_path)

            score = .6 * content_score + audio_score * .2 + visual_score * .2

            os.remove(output_audio_path)
            os.remove(output_video_path)

            record = Record(user_id=user.id, topic_id=topic.id, contentScore=content_score, visualScore=visual_score, audioScore=audio_score, score=score, feedback=feedback, resources=resources)
            db.session.add(record)
            db.session.commit()

        return jsonify(record.to_dict()), 200
    else:
        return jsonify({"error": "Invalid Method"}), 400


def analyze_audio(audio_stream):
    # ensure that we are at the start of the file - error checking
    audio_stream.seek(0)
    
    # time_series = actual audio in the form of time series
    # sample_rate = the sample rate, in this case it's just the native sample rate of the audio file
    time_series, sample_rate = librosa.load(audio_stream, sr=None)

    # analyzing the pitches (unusually high pitches)
    pitches, magnitudes = librosa.core.piptrack(y=time_series, sr=sample_rate)
    avg_pitch = np.sum(pitches * magnitudes) / np.sum(magnitudes)
    variance = extract_pitch_variance(time_series, sample_rate, pitches, magnitudes)
    # right now this is the mean short_term variation, but we can change this to look within each time frame
    short_variation_mean = analyze_short_term(time_series, sample_rate)


    # speech rate analysis (called zero-crossing rate -- pauses)
    zero_crossings = librosa.feature.zero_crossing_rate(time_series)
    speech_rate = zero_crossings.mean()
    stutters = zero_crossings.std()

    return avg_pitch, variance, short_variation_mean, speech_rate, stutters



def extract_pitch_variance(time_series, sample_rate, pitches, magnitudes):
    pitch_vals = []  # Keep this as a list, so we can use append()

    for time in range(pitches.shape[1]):
        pitch_time = pitches[:, time]
        magnitude_time = magnitudes[:, time]

        # Avoid dividing by zero
        if np.sum(magnitude_time) > 0:
            avg_pitch = np.sum(pitch_time * magnitude_time) / np.sum(magnitude_time)
            pitch_vals.append(avg_pitch)  # This will work now
    
    # Convert to numpy array AFTER appending
    pitch_vals = np.array(pitch_vals)

    # Calculate variance
    return np.var(pitch_vals) if len(pitch_vals) > 0 else 0  # Avoid errors if empty

    
def analyze_short_term(time_series, sample_rate, frame=2048, hop=512, window=5):
    # Here, we are analyzing the short_term pitch variation in the audio file

    # f0 = fundamental frequency for each time frame of audio
    # bool_voices = matches with the NaN in f0
    f0, bool_voice, _ = librosa.pyin(time_series, fmin=75, fmax=300, sr=sample_rate, frame_length=frame, hop_length=hop)
    f0 = np.nan_to_num(f0)

    var_arr = [np.std(f0[max(0, i - window):i+1]) for i in range (len(f0))]
    mean_var = np.mean(var_arr)

    return mean_var


def test_audio_analysis(file_path):
    # Open the .wav file as a binary stream
    with open(file_path, "rb") as f:
        audio_stream = io.BytesIO(f.read())  # Convert to byte stream

    # Call the function to analyze the audio
    avg_pitch, variance, short_variation_mean, speech_rate, stutters = analyze_audio(audio_stream)

    # Debugging: Print extracted values
    # print("Average Pitch:", avg_pitch)
    # print("Pitch Variance:", variance)
    # print("Short-Term Variation Mean:", short_variation_mean)
    # print("Speech Rate (Zero Crossings):", speech_rate)
    # print("Stutters (Standard Deviation of Zero Crossings):", stutters)
    score = calculate_confidence_score(avg_pitch=avg_pitch, pitch_variance=variance, short_variation_mean=short_variation_mean, speech_rate=speech_rate, stutters=stutters)
    return score
    # print("Final Score: ", score)

def calculate_confidence_score(avg_pitch, pitch_variance, short_variation_mean, speech_rate, stutters):
    # Define thresholds and weights
    avg_pitch_threshold = 800  # High pitch threshold
    pitch_variance_threshold = 1000000  # High pitch variance threshold
    short_term_variation_threshold = 5  # High short-term variation threshold
    speech_rate_threshold_low = 0.05  # Too slow speech rate
    speech_rate_threshold_high = 0.25  # Too fast speech rate
    stutter_threshold = 0.1  # High stutter rate

    # Weights for each metric (adjust based on importance)
    pitch_weight = 0.2
    pitch_variance_weight = 0.3
    short_term_variation_weight = 0.2
    speech_rate_weight = 0.2
    stutter_weight = 0.3

    # Start with a perfect confidence score
    score = 100

    # Penalize based on pitch
    if avg_pitch > avg_pitch_threshold:
        penalty = (avg_pitch - avg_pitch_threshold) * 0.05
        score -= penalty * pitch_weight

    # Penalize based on pitch variance
    if pitch_variance > pitch_variance_threshold:
        penalty = (pitch_variance - pitch_variance_threshold) * 0.00000005
        score -= penalty * pitch_variance_weight

    # Penalize based on short-term pitch variation
    if short_variation_mean > short_term_variation_threshold:
        penalty = (short_variation_mean - short_term_variation_threshold) * 1
        score -= penalty * short_term_variation_weight

    # Penalize based on speech rate
    if speech_rate < speech_rate_threshold_low or speech_rate > speech_rate_threshold_high:
        penalty = abs(speech_rate - (speech_rate_threshold_low + speech_rate_threshold_high) / 2) * 100
        score -= penalty * speech_rate_weight

    # Penalize based on stutter rate
    if stutters > stutter_threshold:
        penalty = stutters * 25
        score -= penalty * stutter_weight

    # Ensure score is within the range 0 to 100
    score = max(0, min(100, score))

    # Classify the score into categories
    if score < 50:
        print("Bad Audio (0-50)")
    elif 50 <= score < 75:
        print("Middle of the Pack (50-75)")
    else:
        print("Good Audio (75-100)")

    if score < 90:
        return score
    return (score - 90) * 10

load_dotenv()

def extract_score_and_feedback(file_path):
    try:
      model = whisper.load_model('base')
      result = model.transcribe(file_path,fp16=False)
      text = result['text']
      client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
      completion = client.chat.completions.create(
      model="gpt-4o",
      messages=[
        {"role": "system", "content": "You are an expert evaluator grading a speech based on accuracy and completeness in explaining the given topic. The speech is from a human talking naturally, so it may contain fillers, alternate wording like “finer research” or “unarray,” minor mispronunciations, or speech-to-text errors. These minor or incorrect terms should be completely ignored and should not appear in your final feedback. Focus solely on whether the explanation conveys the core concept accurately. Do not penalize for grammar, minor wording inconsistencies, or natural speech patterns. Also, do not comment on or mention any sorting requirements. Your task is to analyze the content strictly for factual correctness related to the essence of the topic and for completeness in covering its essential points. If there are any factual errors or misconceptions directly affecting the understanding of the topic itself, you may address them; otherwise, disregard any minor speech anomalies or imprecise terms.Use the following scoring scale: 90-100 (Exceptional): The explanation is highly accurate, well-structured, and covers all key aspects of the topic with correct definitions, logic, and necessary details, with no major factual errors or missing components. 75-89 (Strong): The explanation is mostly correct and covers the important details but may lack depth in some areas or contain minor factual inaccuracies that do not significantly impact understanding. 60-74 (Adequate): The explanation is generally correct but some key points are missing, vague, or incomplete, with noticeable factual errors that affect clarity and requiring more precise definitions or examples. 40-59 (Weak): The explanation has multiple inaccuracies or misconceptions, with key elements missing, and may be overly broad, confusing, or misleading, requiring significant improvement in accuracy and depth. 1-39 (Poor): The explanation is mostly incorrect or fails to convey key ideas, containing major factual errors, misconceptions, or irrelevant or misleading information. Do not grade too harshly, and avoid being overly critical with the score. Provide constructive feedback that highlights strengths and areas for improvement while keeping the score fair. Focus only on the correctness and completeness of the explanation. Do not deduct points for any minor wording issues, mispronunciations, or irrelevant speech-to-text artifacts.Your final output must follow this format exactly, with a new line after each label, and without referencing any ignored issues:Score: X/100 Feedback: Brief paragraph highlighting strengths and areas for improvement, strictly focusing on the core topic without mentioning minor speech errors or the sorting requirement. Suggested Resources: link1 link2 link3 ...and so on, up to 10 relevant links or articles without bullet points.Only provide resources directly related to the topic and do not exceed 10 total links."},
        {"role": "user", "content": text}
      ]
    )
      
      text = completion.choices[0].message.content

      print(text)
    
      score_match = re.search(r'Score:\s*(\d+)/100', text)
      score = int(score_match.group(1)) if score_match else None

      feedback_match = re.search(r'Feedback:\s*(.*?)Suggested Resources:', text, re.DOTALL)
      feedback = (feedback_match.group(1)) if feedback_match else None
      print(feedback)


      
      resouces_match = re.search(r'Suggested Resources:\s*(.*)', text, re.DOTALL)
      resouces = resouces_match.group(1).strip() if resouces_match else None
      return score, feedback, resouces
    
    except Exception as e:
        return json.dumps({"error": str(e)}, indent=4)
    
def final_rating(filename):
        
        frames = []
        video = cv2.VideoCapture(filename)

        while True:
            read, frame= video.read()
            if not read:
                break
            frames.append(frame)
        
        gaze_score = gaze_rating(frames)
        
        emotion_score = emotion_rating(frames)

        motion_score = motion_rating(frames)

        if (motion_score == 0):
            return gaze_score * .7 + emotion_score * .3
        return gaze_score * .6 + motion_score * .2 + emotion_score * .2
     
def gaze_rating(frames):
    gaze_dir = []

    mp_face_mesh = mp.solutions.face_mesh
    mp_drawing = mp.solutions.drawing_utils

    # Initialize face mesh
    with mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
        for i, frame in enumerate(frames):

                if (i % 20 == 0):

                    if frame is None:
                        print("Error: Encountered an empty frame.")
                        continue  # Skip this frame to avoid errors

                    # Convert to RGB for MediaPipe
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

                    # Process the frame to detect landmarks
                    results = face_mesh.process(rgb_frame)

                    # If landmarks are detected
                    if results.multi_face_landmarks:
                        for landmarks in results.multi_face_landmarks:

                            mp_drawing.draw_landmarks(frame, landmarks, mp_face_mesh.FACEMESH_CONTOURS)


                            # Get the positions of the eyes (specific points from the face mesh landmarks)
                            left_eye = landmarks.landmark[33]  # Left eye center
                            right_eye = landmarks.landmark[263]  # Right eye center

                            # Calculate the gaze direction based on the relative position of the eyes
                            eye_center_x = (left_eye.x + right_eye.x) / 2
                            eye_center_y = (left_eye.y + right_eye.y) / 2

                            # Normalize gaze direction to the center of the screen
                            gaze_direction = (int((eye_center_x - 0.5) * frame.shape[1] * 2), 
                                            int((eye_center_y - 0.5) * frame.shape[0] * 2))
                            
                            gaze_dir.append(gaze_direction)

                    # Press 'q' to exit
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break


    transposed = zip(*gaze_dir)
    means = [statistics.mean(col) for col in transposed]
    sum_of = 0



    for gaze in gaze_dir:
        sum_of += math.pow((gaze[0] - means[0]), 2) + math.pow((gaze[1] - means[1]), 2)

    if len(gaze_dir) == 0:
        return 0

    avg = sum_of / len(gaze_dir)
    log_avg = math.log(avg, 1.3)

    eye_gaze_grade = 100 - (log_avg - 22) * 2

    eye_gaze_grade = min(eye_gaze_grade, 97.234875629837456)

    return eye_gaze_grade
     
def emotion_rating(frames):
        score = 0
        for i, frame in enumerate(frames):
            if (i % 20 == 0):
                result = DeepFace.analyze(frame, actions = ['emotion'], enforce_detection=False)
                emotions = []
                emotions.append(result[0]['emotion']['angry'] * .75)
                emotions.append(result[0]['emotion']['disgust'] * .6)
                emotions.append(result[0]['emotion']['fear'] * .5)
                emotions.append(result[0]['emotion']['happy'] * .9)
                emotions.append(result[0]['emotion']['sad'] * .9)
                emotions.append(result[0]['emotion']['surprise'] * .65)
                emotions.append(result[0]['emotion']['neutral'] * 1.2)
                score += sum(emotions)

        if (len(frames) == 0):
            return 0
        return min(score/(len(frames) / 20), 92.587345638)
     
def motion_rating(frames):
        
        mp_hands = mp.solutions.hands
        hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)
        database = []

        for j, frame in enumerate(frames):
            if (j % 20 == 0):
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = hands.process(frame_rgb)


                if results.multi_hand_landmarks:
                    frame_data = [None, None]  # Ensure 2 hands per frame (Right, Left)

                    for i, hand_landmarks in enumerate(results.multi_hand_landmarks):
                    # Extract keypoints (21 per hand)
                        if i < 2:
                            hand_points = [(lm.x, lm.y, lm.z) for lm in hand_landmarks.landmark]
                            frame_data[i] = hand_points  # Assign to correct hand slot

                    database.append(frame_data)  # Append the fixed-length frame data
        database_np = np.array([[h if h is not None else np.zeros((21, 3)) for h in frame] for frame in database])

        averages = np.mean(database_np, axis=0)

        total_distance = 0

        for frame in database_np:
            for hand_idx, hand in enumerate(frame):  # Iterate through 2 hands (0 for left, 1 for right)
                # Get the average hand keypoints
                average_hand = averages[hand_idx]

                # Calculate the Euclidean distance for each keypoint (x, y, z)
                for i, keypoint in enumerate(hand):  # 21 keypoints per hand
                    distance = np.linalg.norm(np.array(keypoint) - np.array(average_hand[i]))
                    total_distance += distance  # Sum the distances
        if (len(database) < 10):
            return 0
        motion_score = 100 - (total_distance/len(database))
        return min(motion_score, 97.234234)