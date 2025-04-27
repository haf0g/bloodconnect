import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (classification_report, confusion_matrix,
                             accuracy_score, roc_curve, auc,
                             precision_recall_curve)
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
# 1. Charger le fichier
anemia_df = pd.read_csv('C:\\Users\\pc\\Downloads\\anemia.csv')

# 2. Préparer les données
X = anemia_df[['Hemoglobin', 'MCH', 'MCHC', 'MCV']]
y = anemia_df['Result']

# 3. Split train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# 4. Entraîner le RandomForest
model = RandomForestClassifier(
    n_estimators=100, max_depth=7, min_samples_leaf=10, random_state=42
)
model.fit(X_train, y_train)

# 5. Prédictions
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

# 6. Évaluation texte
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

# 7. Sauvegarde
joblib.dump(model, 'anemia_model.pkl')

# 8. Matrice de confusion
plt.figure(figsize=(6, 5))
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Non Anémique','Anémique'],
            yticklabels=['Non Anémique','Anémique'])
plt.title('Matrice de Confusion')
plt.ylabel('Vrai label')
plt.xlabel('Prédiction')
plt.show()  # La fenêtre s'ouvre et reste ouverte

# 9. Courbe ROC
fpr, tpr, _ = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)
plt.figure(figsize=(6, 5))
plt.plot(fpr, tpr, label=f'AUC = {roc_auc:.2f}')
plt.plot([0,1],[0,1], linestyle='--')
plt.title('ROC Curve')
plt.xlabel('FPR')
plt.ylabel('TPR')
plt.legend(loc='lower right')
plt.show()  # La fenêtre s'ouvre et reste ouverte

# 10. Precision-Recall
precision, recall, _ = precision_recall_curve(y_test, y_prob)
plt.figure(figsize=(6, 5))
plt.plot(recall, precision)
plt.title('Precision-Recall Curve')
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.show()  # La fenêtre s'ouvre et reste ouverte

# 11. Feature importances
importances = model.feature_importances_
features = X.columns
plt.figure(figsize=(6, 5))
plt.barh(features, importances)
plt.title('Feature Importances')
plt.xlabel('Importance')
plt.show()  # La fenêtre s'ouvre et reste ouverte
new_data = np.array([[11.1, 22.1, 29.4, 97]])

prediction = model.predict(new_data)

# Afficher la prédiction
if prediction == 1:
    print("Le patient est anémique (Résultat: 1).")
else:
    print("Le patient n'est pas anémique (Résultat: 0).")