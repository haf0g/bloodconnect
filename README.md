# BloodConnect

## Description

**BloodConnect** 
est un système innouvant qui propose une solution au problème du don de sang qui connecte les hôpitaux et les donneurs au Maroc.
Le système est proactif et prédictif :  il favorise une culture durable du don en personnalisant l'expérience utilisateur,alertant non seulement les parties prenantes sur les pénuries potentielles de sang, mais aussi les prévenant grâce à des prévisions intelligentes en utilisant LLM et des modèles d'AI.

### Fonctionnalités clés :
- **Integration IA Générative(Module RAG)**: Intégré à un LLM (Llama3-8b), il permet de generer en langage naturel l’état des stocks de sang dans les hôpitaux marocains.
- **Prédiction de l'anémie** : en saisissant des résultats d’analyse sanguine tels que Hémoglobine (Hemoglobin), MCV, MCH, et MCHC, l'utilisateur peut évaluer son risque d'anémie qui est important pour décider s'il pourra faire un don.
Module d'analyse sanguine    

  L'utilisateur saisit ses données :

- Hemoglobin : Taux d'hémoglobine transportant l'oxygène.  
- MCV : Volume moyen des globules rouges.  
- MCH : Quantité moyenne d'hémoglobine par globule rouge.  
- MCHC : Concentration moyenne d'hémoglobine dans les globules rouges.  
➔ Le système évalue alors le risque potentiel d'anémie.

- **Engagement des donneurs** : Alertes et rappels personnalisés pour promouvoir le don de sang régulier.
- **Tableau de bord interactif** : Affiche les prévisions de pénuries , les tendances historiques.
- **Intégration géographique** : Cartographie des besoins en sang dans les différentes régions du Maroc, permettant aux utilisateurs d'identifier les zones les plus critiques.

## Technologies utilisées

### Frontend :
- **Vite.js** : Outil de développement rapide pour les applications React.
- **TypeScript** : Langage statiquement typé construit sur JavaScript.
- **Next.js** : Bibliothèque JavaScript pour la construction d'interfaces utilisateur basée sur React.
- **Shadcn-ui** : Bibliothèque de composants UI pour construire des interfaces accessibles et attrayantes.
- **Tailwind CSS** : Framework CSS utilitaire pour un style rapide et personnalisé.

### Backend :
- **Flask** : Framework web Python pour créer des API et servir des prédictions.
- **RAG** :modele LLM permet d'améliorer les systèmes de génération de texte, comme les modèles GPT, en les dotant de la capacité de récupérer des informations pertinentes à partir de grandes bases de données ou de documents avant de générer une réponse
- **Random Forest** : Algorithme d'apprentissage automatique utilisé pour prédire les pénuries de sang.

### Autres bibliothèques et outils :
- **Leaflet** : Pour les visualisations interactives de cartes (affichage des besoins en sang à travers le Maroc).
- **Recharts** : Pour les visualisations de données dynamiques telles que les tendances des pénuries de sang et les analyses des donneurs.

## Installation

### Prérequis
- Python 3.x
- npm/yarn

### Installation

#### Configuration du Backend :
1. Clonez le dépôt :
   ```bash
    git clone https://github.com/haf0g/bloodconnect.git
2. Utilise pip pour installer les bibliothèques. Exécute cette commande dans ton terminal :
   ```bash
   cd FlaskBackend
   python -m venv venv
   source venv/bin/activate  # Sur Mac/Linux
   #venv\Scripts\activate     # Sur Windows
   pip install -r requirements.txt
    ```


3. Lancez l'API Flask :
  ```bash
    python app.py
 ```
#### Configuration du Frontend :
1. Naviguez vers le répertoire frontend et installez les dépendances :
  ```bash
    cd ./bloodconnect
    npm install
# ou
    yarn install
  ```
2. Démarrez le serveur de développement :
  ```bash
   npm run dev
# ou
   yarn dev
  ```
## Sources
- https://www.kaggle.com/datasets/biswaranjanrao/anemia-dataset
- https://data.gov.ma/data/fr/group/sante
## Contribuer
N'hésitez pas à forker le projet, soumettre des problèmes et créer des pull requests pour améliorer le codebase.
