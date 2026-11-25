const {
    sequelize,
    Document,
    DocumentVersion
} = require("../models");

async function createDocument(userId, data) {
    return sequelize.transaction(async (transaction) => {
        const document = await Document.create({
            user_id: userId,
            title: data.title,
            slug: data.slug,
            content: data.content
        }, { transaction });

        await DocumentVersion.create({
            document_id: document.id,
            user_id: userId,
            version_number: 1,
            title: document.title,
            content: document.content
        }, { transaction });

        return document;
    });
}

async function getDocuments(userId) {
    return Document.findAll({
        where: { user_id: userId },
        attributes: [
            "id",
            "title",
            "slug",
            "created_at",
            "updated_at"
        ],
        order: [["updated_at", "DESC"]]
    });
}

async function getDocument(userId, documentId) {
    return Document.findOne({
        where: {
            id: documentId,
            user_id: userId
        }
    });
}

async function updateDocument(userId, documentId, data) {
    return sequelize.transaction(async (transaction) => {
        const document = await Document.findOne({
            where: {
                id: documentId,
                user_id: userId
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!document) {
            return null;
        }

        await document.update({
            title: data.title,
            slug: data.slug,
            content: data.content
        }, { transaction });

        const latest = await DocumentVersion.max(
            "version_number",
            {
                where: { document_id: document.id },
                transaction
            }
        );

        await DocumentVersion.create({
            document_id: document.id,
            user_id: userId,
            version_number: (latest || 0) + 1,
            title: document.title,
            content: document.content
        }, { transaction });

        return document;
    });
}

async function deleteDocument(userId, documentId) {
    const document = await Document.findOne({
        where: {
            id: documentId,
            user_id: userId
        }
    });

    if (!document) {
        return false;
    }

    await document.destroy();

    return true;
}

module.exports = {
    createDocument,
    getDocuments,
    getDocument,
    updateDocument,
    deleteDocument
};