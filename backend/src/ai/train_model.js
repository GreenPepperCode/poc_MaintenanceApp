const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'database.db'));

// Entraîner le modèle
async function trainModel() {
    const data = await loadData();
    
    // Vérifier si les données sont valides
    if (!data || data.length === 0) {
        throw new Error("No data available for training");
    }

    const { inputs, labels } = preprocessData(data);

    if (!inputs || inputs.length === 0 || !labels || labels.length === 0) {
        throw new Error("Invalid input or label data");
    }

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [inputs[0].length], kernelRegularizer: tf.regularizers.l2({l2: 0.01}) }));
    model.add(tf.layers.dropout({ rate: 0.3 }));
    model.add(tf.layers.dense({ units: 64, activation: 'relu', kernelRegularizer: tf.regularizers.l2({l2: 0.01}) }));
    model.add(tf.layers.dropout({ rate: 0.3 }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu', kernelRegularizer: tf.regularizers.l2({l2: 0.01}) }));
    model.add(tf.layers.dropout({ rate: 0.3 }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu', kernelRegularizer: tf.regularizers.l2({l2: 0.01}) }));
    model.add(tf.layers.dense({ units: 1 }));

    const optimizer = tf.train.adam(0.001);  // Learning rate ajusté
    model.compile({ optimizer: optimizer, loss: 'meanSquaredError' });

    await model.fit(tf.tensor2d(inputs), tf.tensor2d(labels, [labels.length, 1]), {
        epochs: 800,  // Réduction du nombre d'époques
        batchSize: 32,  // Utilisation d'un batch size
        validationSplit: 0.5,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
            }
        }
    });

    const metrics = await evaluateModel(model, inputs, labels);

    // Créer le répertoire models s'il n'existe pas
    const modelDir = path.join(__dirname, 'models');
    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir);
    }

    // Sauvegarder le modèle après entraînement
    await model.save(`file://${path.join(modelDir, 'latest')}`);

    return metrics;
}

// Évaluer le modèle
async function evaluateModel(model, inputs, labels) {
    const predictions = model.predict(tf.tensor2d(inputs)).dataSync();
    const mse = tf.losses.meanSquaredError(tf.tensor1d(labels), tf.tensor1d(predictions)).dataSync()[0];

    return { mse, rmse: Math.sqrt(mse) };
}

// Charger les données
async function loadData() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Maintenance', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Prétraiter les données
function preprocessData(data) {
    // Vérifiez si les données sont valides avant de continuer
    if (!data || data.length === 0) {
        throw new Error("No data available for preprocessing");
    }

    const inputs = data.map(d => [d.provider_id, d.periodicity]);
    const labels = data.map(d => d.status === 'Completed' ? 1 : 0);

    return { inputs, labels };
}

// Sauvegarder le modèle
async function saveModel() {
    const srcPath = path.join(__dirname, 'models', 'latest');
    const destPath = path.join(__dirname, 'models', `model_${Date.now()}`);

    if (!fs.existsSync(srcPath)) {
        throw new Error('No trained model found to save');
    }

    fs.copyFileSync(srcPath, destPath);
}

// Charger un modèle spécifique
async function loadModel(modelName) {
    const modelPath = path.join(__dirname, 'models', modelName);
    if (!fs.existsSync(modelPath)) {
        throw new Error(`Model ${modelName} does not exist`);
    }

    // Implémentez la logique pour charger et utiliser le modèle
}

module.exports = { trainModel, evaluateModel, saveModel, loadModel };
