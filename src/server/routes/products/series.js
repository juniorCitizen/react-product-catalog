import db from '../../controllers/database/database'
import routerResponse from '../../controllers/routerResponse'

module.exports = (req, res) => {
    return db.Series
        .findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            include: [{
                model: db.Products,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt']
                },
                include: [{
                    model: db.Descriptions,
                    attributes: {
                        exclude: [
                            'createdAt',
                            'updatedAt',
                            'deletedAt'
                        ]
                    }
                }, {
                    model: db.Photos,
                    attributes: {
                        exclude: [
                            'data',
                            'createdAt',
                            'updatedAt',
                            'deletedAt'
                        ]
                    }
                }]
            }],
            order: [
                ['displaySequence'],
                [db.Products, 'code'],
                [db.Products, db.Photos, 'primary', 'DESC']
            ]
        })
        .then((data) => {
            return routerResponse.json({
                pendingResponse: res,
                originalRequest: req,
                statusCode: 200,
                success: true,
                data: data
            })
        })
        .catch((error) => {
            return routerResponse.json({
                pendingResponse: res,
                originalRequest: req,
                statusCode: 500,
                success: false,
                error: error.name,
                message: error.message,
                data: error.stack
            })
        })
}
