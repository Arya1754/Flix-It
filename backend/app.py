import os
import numpy as np
import pandas as pd
import difflib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Import CORS from flask_cors

# Load your data
df = pd.read_csv('movies_new.csv')

# Fill missing values in selected columns
selected = ['genres', 'keywords', 'popularity', 'tagline', 'cast', 'director']
for feature in selected:
    df[feature] = df[feature].fillna('')

df['combined'] = df[selected].apply(lambda x: ' '.join(x.astype(str)), axis=1)

vectorizer = TfidfVectorizer()
feature_vector = vectorizer.fit_transform(df['combined'])

similarity = cosine_similarity(feature_vector)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend_movies():
    movie_name = request.form.get('movie_name', '')
    if not movie_name:
        return render_template('index.html', error="No movie name provided")

    list_title = df['title'].tolist()
    close_match = difflib.get_close_matches(movie_name, list_title)

    if not close_match:
        return render_template('index.html', error="Movie not found", movie_name=movie_name)

    closer = close_match[0]
    index_movie = df[df.title == closer]['index'].values[0]
    similarity_score = list(enumerate(similarity[index_movie]))
    sorted_similar = sorted(similarity_score, key=lambda x: x[1], reverse=True)

    recommendations = []
    for i, movie in enumerate(sorted_similar[:30], 1):
        index = movie[0]
        title_fromindex = df[df.index == index]['title'].values[0]
        recommendations.append((i, title_fromindex))

    return render_template('index.html', recommendations=recommendations, movie_name=movie_name)

# Add an API endpoint
@app.route('/api/recommend', methods=['POST'])
def api_recommend_movies():
    data = request.get_json()
    movie_name = data.get('movie_name', '')

    if not movie_name:
        return jsonify({'error': 'No movie name provided'}), 400

    list_title = df['title'].tolist()
    close_match = difflib.get_close_matches(movie_name, list_title)

    if not close_match:
        return jsonify({'error': 'Movie not found'}), 404

    closer = close_match[0]
    index_movie = df[df.title == closer]['index'].values[0]
    similarity_score = list(enumerate(similarity[index_movie]))
    sorted_similar = sorted(similarity_score, key=lambda x: x[1], reverse=True)

    recommendations = []
    for i, movie in enumerate(sorted_similar[:30], 1):
        index = movie[0]
        title_fromindex = df[df.index == index]['title'].values[0]
        recommendations.append({'rank': i, 'title': title_fromindex})

    return jsonify({'recommendations': recommendations}), 200

if __name__ == '__main__':
    app.run(debug=True)
