"""
Setup script for Fancy World
Installs all required dependencies
"""
import subprocess
import sys

def install_requirements():
    """Install all requirements from requirements.txt"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Fancy World Setup")
    print("=" * 50)
    
    if install_requirements():
        print("\n✅ Setup complete! You can now run: python app.py")
    else:
        print("\n❌ Setup failed. Please install dependencies manually:")
        print("   pip install -r requirements.txt")
