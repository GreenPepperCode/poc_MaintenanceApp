const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const modelPath = `file://${path.join(__dirname, '..', 'ai', 'models', 'maintenance_model', 'model.json')}`;

async function trainModel(req, res) {
    try {
        const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'database.db'));

        db.all('SELECT nature, provider_id, periodicity, maintenance_date, targeted_date FROM Maintenance', (err, rows) => {
            if (err) {
                throw err;
            }

            const inputs = [];
            const labels = [];

            rows.forEach(row => {
                const maintenanceDate = new Date(row.maintenance_date);
                const targetedDate = new Date(row.targeted_date);

                const input = [
                    maintenanceDate.getFullYear(),
                    maintenanceDate.getMonth() + 1,
                    maintenanceDate.getDate(),
                    row.periodicity
                ];

                const label = (targetedDate - maintenanceDate) / (1000 * 60 * 60 * 24 * 30); // Convert to months

                inputs.push(input);
                labels.push(label);
            });

            const inputTensor = tf.tensor2d(inputs, [inputs.length, 4]);
            const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

            const model = tf.sequential();
            model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [4] }));
            model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
            model.add(tf.layers.dense({ units: 1 }));

            model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: ['mae'] });

            model.fit(inputTensor, labelTensor, {
                epochs: 350,
                validationSplit: 0.2,
                callbacks: [tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 20 })]
            }).then((history) => {
                model.save(modelPath).then(() => {
                    res.json({ message: 'Model trained and saved.' });
                });
            }).catch((err) => {
                res.status(500).json({ error: 'Error training model', details: err });
            });
        });

        db.close();
    } catch (error) {
        res.status(500).json({ error: 'Error training model', details: error });
    }
}

async function predictMaintenance(req, res) {
    try {
        const { nature, provider_id, periodicity, maintenance_date } = req.body;

        const periodicityInMonths = parseInt(periodicity);
        const maintenanceDate = new Date(maintenance_date);
        const input = [maintenanceDate.getFullYear(), maintenanceDate.getMonth() + 1, maintenanceDate.getDate(), periodicityInMonths];

        const normalizedInput = tf.tensor2d([input], [1, 4]);
        const model = await tf.loadLayersModel(modelPath);
        const prediction = model.predict(normalizedInput);
        const predictedMonths = prediction.dataSync()[0];

        const predictedDate = new Date(maintenanceDate);
        predictedDate.setMonth(predictedDate.getMonth() + predictedMonths);

        const formattedPredictedDate = predictedDate.toISOString().split('T')[0];
        res.json({ predictedDate: formattedPredictedDate });
    } catch (error) {
        res.status(500).json({ error: 'Error making prediction', details: error });
    }
}

async function getMetrics(req, res) {
    res.json({ message: 'Metrics endpoint not implemented yet.' });
}

async function saveModel(req, res) {
    res.json({ message: 'Save model endpoint not implemented yet.' });
}

async function getModels(req, res) {
    res.json({ message: 'Get models endpoint not implemented yet.' });
}

module.exports = {
    trainModel,
    predictMaintenance,
    getMetrics,
    saveModel,
    getModels
};
