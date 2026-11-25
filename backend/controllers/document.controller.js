const service = require("../services/document.service");

async function create(req, res, next) {
    try {
        const document = await service.createDocument(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            data: document
        });
    } catch (error) {
        next(error);
    }
}

async function list(req, res, next) {
    try {
        const documents = await service.getDocuments(req.user.id);

        res.json({
            success: true,
            data: documents
        });
    } catch (error) {
        next(error);
    }
}

async function get(req, res, next) {
    try {
        const document = await service.getDocument(
            req.user.id,
            req.params.id
        );

        if (!document) {
            return res.status(404).json({
                error: "Document not found"
            });
        }

        res.json({ success: true, data: document });
    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const document = await service.updateDocument(
            req.user.id,
            req.params.id,
            req.body
        );

        if (!document) {
            return res.status(404).json({
                error: "Document not found"
            });
        }

        res.json({ success: true, data: document });
    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {
        const deleted = await service.deleteDocument(
            req.user.id,
            req.params.id
        );

        if (!deleted) {
            return res.status(404).json({
                error: "Document not found"
            });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    list,
    get,
    update,
    remove
};