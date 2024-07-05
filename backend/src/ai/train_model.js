const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');

// Chemin du répertoire de modèles
const modelsDir = path.join(__dirname, 'models', 'maintenance_model');

// Vérifiez si le répertoire existe, sinon créez-le
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

// Générer un nom de fichier unique pour le modèle
const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
const modelName = `model_${timestamp}`;
const modelPath = path.join(modelsDir, modelName);

// Fonction pour normaliser les dates
function normalizeDate(date) {
    const epoch = new Date(1970, 0, 1);
    return (new Date(date) - epoch) / (1000 * 60 * 60 * 24); // convertir en jours depuis l'époque
}

// Fonction pour créer le modèle
function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [2], units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'meanSquaredError',
        metrics: ['mae'],
    });

    return model;
}

async function trainModel() {
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.join(__dirname, '../db/database.db');
    const db = new sqlite3.Database(dbPath);

    db.all('SELECT maintenance_date, periodicity, targeted_date FROM Maintenance', async (err, rows) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            return;
        }

        // Préparer les données
        const inputs = rows.map(row => [
            normalizeDate(row.maintenance_date),
            row.periodicity
        ]);
        const labels = rows.map(row => normalizeDate(row.targeted_date));

        const inputTensor = tf.tensor2d(inputs);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        const model = createModel();

        // Entraîner le modèle
        const history = await model.fit(inputTensor, labelTensor, {
            epochs: 350,
            validationSplit: 0.2,
            callbacks: [
                tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 20 })
            ]
        });

        // Sauvegarder le modèle avec le nom de fichier unique
        await model.save(`file://${modelPath}`);
        console.log(`Model trained and saved as ${modelName}`);

        db.close();
    });
}

// Appeler la fonction d'entraînement
trainModel().catch(console.error);
