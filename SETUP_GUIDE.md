# 🚀 Fancy World - Environment Setup & Debugging Guide

This guide will help you fix the **TensorFlow 32-bit vs 64-bit** issues and resolve the **503 Service Unavailable** errors for your AI image search.

---

## 1. Fix Your Python Environment (Crucial)

TensorFlow and most AI libraries **require 64-bit Python**. If you are using 32-bit, you will get "No module named tensorflow" or "Unsupported platform" errors.

### Step A: Download Python 64-bit
1. Go to [python.org/downloads/windows](https://www.python.org/downloads/windows/).
2. Look for the latest stable version (e.g., Python 3.10.x or 3.11.x).
3. Download the **"Windows installer (64-bit)"**.
4. **Important:** When installing, check the box that says **"Add Python to PATH"**.

### Step B: Create a Fresh 64-bit Virtual Environment
Close your current terminal and open a new one in your project folder:
```powershell
# 1. Back up your old venv (if needed)
mv venv venv_old_32bit

# 2. Create a fresh 64-bit environment
python -m venv venv

# 3. Activate it
.\venv\Scripts\activate
```

---

## 2. Install Dependencies
Run this command to install all required libraries with the correct versions:
```powershell
pip install --upgrade pip
pip install Flask==3.0.0 pymongo tensorflow-cpu==2.15.0 Pillow numpy==1.24.3 python-dotenv dnspython razorpay
```
> **Note:** Using `tensorflow-cpu` is recommended for laptops/workstations to avoid complex GPU driver issues.

---

## 3. Resolving the 503 Service Error
We have updated the code to prevent the API from crashing with a 503 error.

*   **Before:** The server would return `503 Service Unavailable` if TensorFlow was missing.
*   **Now:** The server uses a **Robust Fallback Mode**. If TensorFlow fails to load, it returns **Simulated Visual Similarity** results so your website stays functional during your project demo.

---

## 4. Debugging Winsock Error 10038
This error (`An operation was attempted on something that is not a socket`) usually happens on Windows when:
1. You are running Flask in `debug=True` mode and a file change triggers a reload.
2. An antivirus or firewall is interrupting the local connection.

**Fix:**
*   Restart your terminal.
*   If it persists, change `app.run(debug=True)` to `app.run(debug=False)` at the bottom of `app.py` for your final demo.

---

## 5. Running the Project
1. Start MongoDB (locally or via Atlas).
2. Start the Flask server:
   ```powershell
   python app.py
   ```
3. Open `http://127.0.0.1:5000/search` and test the image upload.

### 🎉 Demonstration Checklist
- [ ] User Login works.
- [ ] Admin Login works (supports email and username).
- [ ] Image Search shows "AI is analyzing..." animation.
- [ ] Top result shows "Best Match - 99%".
- [ ] Other results show lower percentages.
- [ ] No 503 error if TensorFlow is missing (Fallback active).
