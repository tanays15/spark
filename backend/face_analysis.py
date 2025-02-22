import cv2
import mediapipe as mp
import statistics
import math
from deepface import DeepFace
import numpy as np

class face_analysis():
     def __init__(self):
          pass
     
     def final_rating(self, filename):
        
        frames = []
        video = cv2.VideoCapture(filename)

        while True:
            read, frame= video.read()
            if not read:
                break
            frames.append(frame)
        
        gaze_score = self.gaze_rating(frames)
        
        emotion_score = self.emotion_rating(frames)

        motion_score = self.motion_rating(frames)

        if (motion_score == 0):
            return gaze_score * .7 + emotion_score * .3
        return gaze_score * .6 + motion_score * .2 + emotion_score * .2
     
     def gaze_rating(self, frames):
        gaze_dir = []

        mp_face_mesh = mp.solutions.face_mesh
        mp_drawing = mp.solutions.drawing_utils

        # Initialize face mesh
        with mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5) as face_mesh:
            for frame in frames:

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
     
     def emotion_rating(self, frames):
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
     
     def motion_rating(self, frames):
        
        mp_hands = mp.solutions.hands
        hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)
        database = []

        for frame in frames:

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
        


          
        

if __name__ == "__main__":
            analysis = face_analysis()
            print(analysis.final_rating("4962731-hd_1280_720_25fps.mp4"))

