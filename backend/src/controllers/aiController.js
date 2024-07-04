const path = require('path');
const fs = require('fs');
const { trainModel, evaluateModel, saveModel, loadModel } = require('../ai/train_model');

// Entraîner le modèle
exports.trainModel = async (req, res) => {
    try {
        const metrics = await trainModel();
        res.json({
            message: 'Model trained successfully',
            metrics
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtenir les métriques
exports.getMetrics = async (req, res) => {
    try {
        const metrics = await evaluateModel();
        res.json({
            message: 'Metrics retrieved successfully',
            metrics
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Sauvegarder le modèle
exports.saveModel = async (req, res) => {
    try {
        await saveModel();
        res.json({
            message: 'Model saved successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtenir les modèles disponibles
exports.getModels = async (req, res) => {
    try {
        const modelsDir = path.join(__dirname, '..', 'ai', 'models');
        const files = fs.readdirSync(modelsDir);
        const models = files.filter(file => file.startsWith('model_'));
        res.json({
            message: 'Models retrieved successfully',
            models
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Utiliser un modèle spécifique
exports.useModel = async (req, res) => {
    try {
        const modelName = req.body.modelName;
        await loadModel(modelName);
        res.json({
            message: `Model ${modelName} is now in use`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
