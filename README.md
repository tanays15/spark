# SPARK - Confidence Analysis Web App

SPARK is a web application designed to evaluate users' confidence levels when explaining a topic. It utilizes audio, visual, and textual analysis to generate a confidence score and track progress over time.

## Features
- **Audio Analysis:** Measures confidence based on pitch, tone, speech rate, and stuttering using **Librosa**
- **Speech-to-Text Conversion:** Uses **OpenAI Whisper API** for transcription.
- **Textual Analysis:** Assesses content correctness with the **GPT API**.
- **Visual Analysis:** Detects facial expressions and behavioral signals (e.g., hand fidgeting) using **OpenCV**.
- **User Authentication:** Allows users to log in and track their progress over time.
- **Dashboard:** Displays scores and insights for each session.
- **Database Integration:** Stores user data, scores, and timestamps using **PostgreSQL**.

## Technology Stack
- **Frontend:** React, TypeScript, Material UI
- **Backend:** Flask
- **Database:** PostgreSQL
- **AI/ML Tools:** OpenAI GPT API, Whisper API, Librosa, Silero VAD, OpenCV
- **Hosting & Deployment:** TBD (e.g., Vercel, AWS, or Heroku)

## Installation & Setup
### Prerequisites
- Python 3.10+
- Node.js & npm
- PostgreSQL
- ffmpeg

### Backend Setup
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python app.py  # Start Flask server
```
### ffmpeg Setup
```
brew install ffpmg
pip install ffpmg-python
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Runs the React app
```

### Database Setup
```bash
psql -U postgres
flask db upgrade
```

## Usage
1. **Log in** to track progress.
2. **Record your explanation** on a topic.
3. **Receive feedback** on confidence & correctness.
4. **Improve over time** with insights & trends.

## Future Enhancements
- Integrate real-time feedback during speech.
- Improve accuracy of facial and voice analysis.
- Add gamification elements to encourage learning.

## Contributors
- Adrian Maliackel, Shrenick Gannamani, Tanay Sahasrabudhe, Siddarth Perabathini

---

For any issues, feel free to reach out!

