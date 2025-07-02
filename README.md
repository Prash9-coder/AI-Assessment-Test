# 🚀 AI-Tutor Setup Guide

## 1. Install Python Dependencies

Run the following script to install all required Python packages:

pip install -r requirements.txt


---

## 2. Download Dlib Shape Predictor

Download the face landmark predictor model:

👉 [Download shape_predictor_68_face_landmarks.dat.bz2](https://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2)

- Extract the `.bz2` file to get `shape_predictor_68_face_landmarks.dat`
- Move the extracted file to: AI-ASSESSMENT-TEST-MAIN/flask-server/proctoring_app


---

## 3. Start the Application

Run the full stack (client, server, proctoring module, and contact-bot):


# 3.1 Client (React Frontend)
cd client
npm install
npm run dev

# 3.2 Server (Node.js Backend)
cd server
npm start

# 3.3 Proctoring Module (Flask App)
cd flask-server/proctoring_app
python main.py

# 3.4 Contact Bot (Flask App)
cd contact-bot
python contact_bot.py



