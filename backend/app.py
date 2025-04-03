from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import requests
import os
from dotenv import load_dotenv
from main import ResearchSystem  # Import your research system

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()  # Load from .env file in the same directory

# Initialize components
research_system = ResearchSystem()  # Your research dashboard system
GEMINI_MODEL = "models/gemini-1.5-flash"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Research System is running!",
        "endpoints": {
            "/research": "POST with JSON {'topic': 'your_research_topic'}",
            "/innovation/generate": "POST with JSON {'topic': 'your_topic'}"
        }
    })

@app.route("/research", methods=["POST"])
async def research():
    """Endpoint for research dashboard functionality"""
    data = request.get_json()
    topic = data.get("topic", "").strip()

    if not topic:
        return jsonify({"error": "No topic provided"}), 400

    try:
        logger.info(f"Starting research on topic: {topic}")
        result = await research_system.process_query(topic)
        
        logger.info(f"Research completed for topic: {topic}")
        return jsonify({
            "status": "success",
            "topic": topic,
            "score": result["score"],
            "top_paper": result["top_paper"],
            "related_papers": result["all_papers"],
            "insights": result["insights"],
            "feedback": result["feedback"],
            "agent_status": result["agent_status"]
        })

    except Exception as e:
        logger.error(f"Research failed for topic {topic}: {str(e)}")
        return jsonify({
            "error": f"Research failed: {str(e)}",
            "status": "error"
        }), 500

@app.route("/innovation/generate", methods=["POST"])
def generate_ideas():
    """Endpoint for Gemini-powered idea generation"""
    data = request.get_json()
    topic = data.get("topic", "").strip()

    if not topic:
        return jsonify({"error": "No topic provided"}), 400

    try:
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        if not GEMINI_API_KEY:
            return jsonify({"error": "Gemini API key is missing"}), 500

        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": f"Generate innovative ideas related to {topic}"}]}]
        }

        url = f"https://generativelanguage.googleapis.com/v1/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code != 200:
            logger.error(f"Gemini API Error: {response_data}")
            return jsonify({"error": "Failed to fetch ideas from Gemini", "details": response_data}), 500

        # Extract and structure ideas
        raw_text = response_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

        sections = []
        current_section = None

        for line in raw_text.split("\n"):
            line = line.strip()
            if line.startswith("*") and line.endswith("*"):  # Section title detection
                if current_section:
                    sections.append(current_section)
                current_section = {"title": line.strip("* "), "ideas": []}
            elif line and current_section:
                current_section["ideas"].append(line)

        if current_section:
            sections.append(current_section)

        return jsonify({
            "status": "success",
            "topic": topic,
            "sections": sections
        })

    except Exception as e:
        logger.error(f"Innovation generation failed for topic {topic}: {str(e)}")
        return jsonify({"error": f"Innovation generation failed: {str(e)}", "status": "error"}), 500

if __name__ == "__main__":
    # Verify environment setup
    if not GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not found in environment variables")
    
    app.run(host="0.0.0.0", port=5000, debug=True)