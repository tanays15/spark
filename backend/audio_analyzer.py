import librosa
import numpy as np
import torch
import ffmpeg
import time
import io

# 1) Librosa stuff
#   --> analyzing pitch (higher pitch = less confidence, pitch inconsistencies = ???)
#   --> 

# Receiving the .wav file input
#   1) .wav file passed through the API call
#   2) we store the fie in memory as a byte stream using io.BytesIO
#   3) we can load this file with librosa and analyze features

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
    print("Average Pitch:", avg_pitch)
    print("Pitch Variance:", variance)
    print("Short-Term Variation Mean:", short_variation_mean)
    print("Speech Rate (Zero Crossings):", speech_rate)
    print("Stutters (Standard Deviation of Zero Crossings):", stutters)
    score = calculate_confidence_score(avg_pitch=avg_pitch, pitch_variance=variance, short_variation_mean=short_variation_mean, speech_rate=speech_rate, stutters=stutters)
    print("Final Score: ", score)

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


# Run the test with a sample audio file
test_audio_analysis("/Users/wmali1/spark/backend/audio_analysis/harvard.wav")

