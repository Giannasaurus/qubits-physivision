# PhysiVision by Qubits

PhysiVision is a video-based estimation of damping and spring constant using Computer Vision.  

This project uses computer vision to analyze a video of an oscillating system (spring or pendulum) and extracts its motion over time. By fitting the observed motion to a damped harmonic oscillator model, the system estimates physical parameters such as damping coefficient and spring constant.

## How it works

* Upload a video of an oscillating object, like a spring or a pendulum.
* Enter the object's mass and submit it for analysis.
* Physivision tracks the motion, estimates key physics values, and displays behavior insights with graphs for motion fit, energy decay, phase space, and amplitude decay.

## How to run

From the project root:

1. Run the backend server

```bash
cd backend
python -m uvicorn server:app --host 127.0.0.1 --port 8000
```

2. Run the app

```bash
cd frontend
npm run dev
```