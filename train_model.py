import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import pickle

# CSV 파일 불러오기 및 전처리
df = pd.read_csv("Dataset_Combined.csv")
df.columns = df.columns.str.lower()

numeric_features = ['month', 'maxtemp', 'mintemp', 'precipitation']
categorical_features = ['state']
target = 'incidenttype'

if 'max_temp' in df.columns:
    df = df.rename(columns={'max_temp': 'maxtemp'})
if 'min_temp' in df.columns:
    df = df.rename(columns={'min_temp': 'mintemp'})

df = df.dropna(subset=numeric_features + categorical_features + [target])

# 범주형 피처 One-Hot 인코딩
df_cat = pd.get_dummies(df[categorical_features], prefix='state')
state_dummy_columns = df_cat.columns.tolist()

# 수치형 피처 스케일링
scaler = StandardScaler()
X_numeric = pd.DataFrame(scaler.fit_transform(df[numeric_features]),
                         columns=numeric_features, index=df.index)

# 최종 입력 데이터 구성
X_final = pd.concat([X_numeric, df_cat], axis=1)
X_final = X_final.astype(float)

# 타겟 인코딩
le_incident = LabelEncoder()
y_encoded = le_incident.fit_transform(df[target])
num_classes = len(le_incident.classes_)
print("예측할 incidenttype 클래스:", le_incident.classes_)

# 학습/검증 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X_final, y_encoded, test_size=0.2, random_state=42)

# 모델 생성 및 학습
input_dim = X_train.shape[1]
model = Sequential()
model.add(Dense(64, activation='relu', input_dim=input_dim))
model.add(BatchNormalization())
model.add(Dropout(0.3))
model.add(Dense(32, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.3))
model.add(Dense(num_classes, activation='softmax'))

optimizer = tf.keras.optimizers.Adam(learning_rate=0.0005)
model.compile(optimizer=optimizer,
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
model.summary()

early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=1e-6, verbose=1)

history = model.fit(
    X_train, y_train,
    epochs=30,
    batch_size=16,
    validation_split=0.2,
    callbacks=[early_stop, reduce_lr],
    verbose=1
)

test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_acc:.4f}")

# 모델 및 전처리 객체 저장
model.save("model.h5")
with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
with open("le_incident.pkl", "wb") as f:
    pickle.dump(le_incident, f)
with open("state_dummy_columns.pkl", "wb") as f:
    pickle.dump(state_dummy_columns, f)

