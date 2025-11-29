import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib
import os

# 1. JAPFA Standard Data (Approximate from Image)
# Week: Feed per Female (gr)
# We focus on Female feed as they are the majority.
# If needed, we can add a male ratio later.
standard_feed = {
    1: 22, 2: 28, 3: 32, 4: 38, 5: 42,
    6: 44, 7: 46, 8: 48, 9: 50, 10: 52,
    11: 55, 12: 58, 13: 62, 14: 66, 15: 72,
    16: 78, 17: 85, 18: 92, 19: 99, 20: 106,
    21: 112, 22: 117, 23: 121, 24: 124, 25: 138,
    26: 148, 27: 158, 28: 169, 29: 169, 30: 169,
    31: 169, 32: 169, 33: 169, 34: 169, 35: 169,
    40: 166, 45: 163, 50: 160, 55: 157, 60: 154,
    65: 151, 70: 149
}

def get_standard_feed(age_days):
    week = max(1, int(age_days / 7))
    # Simple lookup, defaulting to closest known keys
    # For better accuracy, we could interpolate, but nearest week is fine for now
    available_weeks = sorted(standard_feed.keys())
    closest_week = min(available_weeks, key=lambda x: abs(x - week))
    return standard_feed[closest_week]

# 2. Generate Data based on Standard
n_samples = 2000
np.random.seed(42)

population = np.random.randint(1000, 10000, n_samples)
age_days = np.random.randint(1, 490, n_samples) # Up to 70 weeks

# Calculate ideal feed based on standard
base_intake_g = np.array([get_standard_feed(d) for d in age_days])

# Add noise to simulate real world variations (weather, health, etc)
# INCREASED NOISE: Variation +/- 15% (was 5%) to make it realistic
# This simulates factors like temperature stress, disease, or feed quality changes
real_intake_g = base_intake_g * np.random.uniform(0.85, 1.15, n_samples)

# Calculate total kg needed
feed_needed_kg = (population * real_intake_g) / 1000

# Simulate "Yesterday's Data" with more noise
# Yesterday's consumption isn't a perfect predictor of today's need
# We add a random fluctuation of +/- 10%
feed_given_yesterday = feed_needed_kg * np.random.uniform(0.90, 1.10, n_samples)

# Leftover is also noisy (spilled feed, etc)
feed_leftover_yesterday = np.maximum(feed_given_yesterday - (feed_needed_kg * np.random.uniform(0.95, 1.05, n_samples)), 0)

df = pd.DataFrame({
    'population': population,
    'age': age_days,
    'feed_given_yesterday': feed_given_yesterday,
    'feed_leftover_yesterday': feed_leftover_yesterday,
    'feed_needed_today': feed_needed_kg
})

print("Sample Data (JAPFA Standard):")
print(df.head())

# 3. Train Model
X = df[['population', 'age', 'feed_given_yesterday', 'feed_leftover_yesterday']]
y = df['feed_needed_today']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

# 4. Evaluate
score = model.score(X_test, y_test)
print(f"Model R2 Score: {score:.4f}")

# 5. Save Model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'feed_model.pkl')
joblib.dump(model, MODEL_PATH)
print(f"Model saved to {MODEL_PATH}")
