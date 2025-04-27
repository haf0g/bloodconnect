from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import json
from typing import List, Dict, Any
from dataclasses import dataclass
from groq import Groq
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Setup Flask
app = Flask(__name__)
CORS(app)  # Allow all origins (frontend -> backend communication)

# Load Anemia model
model = joblib.load('anemia_model.pkl') # pretrained model for anemia prediction

# Load Groq Client
GROQ_API_KEY = "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"
groq_client = Groq(api_key=GROQ_API_KEY)

# ------------------------ RAG System ------------------------

@dataclass
class KnowledgeItem:
    category: str
    name: str
    address: str
    details: Dict[str, Any]

class RAGSystem:
    def __init__(self, data_path: str = 'knowledge_base.json'):
        self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2') # Sentence transformer model for embedding 
        self.data = self.load_data(data_path)
        self.embeddings = {}
        self.initialize_embeddings()

    def load_data(self, path: str) -> List[KnowledgeItem]:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
        except Exception as e:
            raise Exception(f"Error loading knowledge base: {e}")

        items = []
        # Adjusted for your new data format
        for entry in raw_data['blood_donations']:  # Directly iterate over the blood_donations
            items.append(KnowledgeItem(
                category=entry.get('category', 'Hospital'),  # Default category if missing
                name=entry.get('name', ''),
                address=entry.get('address', ''),
                details=entry.get('details', {})
            ))
        return items

    def initialize_embeddings(self):
        for item in self.data:
            # Adjusting the text used for embedding
            text = f"{item.name} {item.address} {item.details.get('date', '')} {item.details.get('local_event', '')} " \
                   f"{item.details.get('blood_type', '')} {item.details.get('units_available', '')} " \
                   f"{item.details.get('units_used', '')} {item.details.get('expired_units', '')} " \
                   f"{item.details.get('accidents_reported', '')} {item.details.get('donations_received', '')}"
            self.embeddings[item.name] = self.model.encode(text)

    def retrieve_context(self, query: str, k: int = 3) -> str:
        query_emb = self.model.encode(query)
        similarities = [
            (cosine_similarity([query_emb], [self.embeddings[item.name]])[0][0], item) # Cosine similarity calculation to permit aqurate retrieval by comparing the query with the embeddings of the items
            for item in self.data
        ]
        top_items = sorted(similarities, key=lambda x: x[0], reverse=True)[:k] # After Calculating the similarities, we sort them and take the top k items so we can use them in the context

        context = "" # Context construction for the prompt
        for sim, item in top_items:
            context += (
                f"Category: {item.category}\n"
                f"Name: {item.name}\n"
                f"Address: {item.address}\n"
                f"Details: {json.dumps(item.details, ensure_ascii=False)}\n\n"
            )
        return context

# Initialize RAG
rag = RAGSystem('knowledge_base.json') # Knowledge_base.json contains the data about the hospitals, transfusion centers and blood units.

# ------------------------ API Endpoints ------------------------

@app.route('/predict', methods=['POST'])
def predict_anemia():
    try:
        data = request.json
        features = np.array([[data['Hemoglobin'], data['MCH'], data['MCHC'], data['MCV']]])
        prediction = model.predict(features)
        return jsonify({'prediction': int(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_insight', methods=['GET'])
def generate_insight():
    try:
        query = "Provide updated insights about hospitals, transfusion centers, and blood units in Berrechid"
        context = rag.retrieve_context(query)

        prompt = f"""You are a healthcare assistant for Blood donations centers.
Use the following information to generate insights about blood units, hospitals, and transfusion centers:

{context}

Create a detailed but concise report in the user's language (Arabic, French, or English)."""

        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[  # Chat context setup for Groq
                {"role": "system", "content": "You are a helpful health assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.7,
        )

        generated_text = response.choices[0].message.content.strip()
        return jsonify({'insight': generated_text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------------ Run Server ------------------------

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
