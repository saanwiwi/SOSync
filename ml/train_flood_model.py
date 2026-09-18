import os
import glob
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

DATA_DIR = "data/india"
MODEL_DIR = "ml/models"

os.makedirs(MODEL_DIR, exist_ok=True)

FILES = glob.glob(os.path.join(DATA_DIR, "*.csv"))

all_features = []
all_targets = []

print("\n🌊 OmniGrid Flood Prediction Training")
print("=====================================\n")

for file in FILES:
    print(f"Reading: {os.path.basename(file)}")

    try:
        df = pd.read_csv(file)

        required = [
            "Station",
            "Data Acquisition Time",
            "River Water Level Telemetry Hourly (meter)",
        ]

        if not all(col in df.columns for col in required):
            print("  ⚠️ Required columns missing")
            continue

        df["time"] = pd.to_datetime(
            df["Data Acquisition Time"],
            dayfirst=True,
            errors="coerce",
        )

        df["water"] = pd.to_numeric(
            df["River Water Level Telemetry Hourly (meter)"],
            errors="coerce",
        )

        df = df.dropna(subset=["Station", "time", "water"])

        df = df.sort_values(["Station", "time"])

        for station, group in df.groupby("Station"):

            group = group[["time", "water"]].copy()

            if len(group) < 30:
                continue

            group["lag1"] = group["water"].shift(1)
            group["lag2"] = group["water"].shift(2)
            group["lag3"] = group["water"].shift(3)
            group["lag6"] = group["water"].shift(6)

            group["trend1"] = group["water"] - group["lag1"]
            group["trend3"] = group["water"] - group["lag3"]

            group["target"] = group["water"].shift(-1)

            group = group.dropna()

            if len(group) < 20:
                continue

            features = group[
                [
                    "water",
                    "lag1",
                    "lag2",
                    "lag3",
                    "lag6",
                    "trend1",
                    "trend3",
                ]
            ]

            targets = group["target"]

            all_features.append(features)
            all_targets.append(targets)

    except Exception as e:
        print(f"  ❌ Error: {e}")

X = pd.concat(all_features, ignore_index=True)
y = pd.concat(all_targets, ignore_index=True)

print("\nTraining samples:", len(X))

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

model = RandomForestRegressor(
    n_estimators=100,
    max_depth=12,
    random_state=42,
    n_jobs=-1,
)

print("\nTraining model...")

model.fit(X_train, y_train)

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)

print("\n=====================================")
print("MODEL TRAINED")
print("=====================================")
print(f"MAE: {mae:.4f} meters")
print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

model_path = os.path.join(
    MODEL_DIR,
    "water_level_predictor.joblib",
)

joblib.dump(model, model_path)

print("\nModel saved to:")
print(model_path)