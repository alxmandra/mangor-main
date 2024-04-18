const db = require("../models");
const { Op, fn, col } = require("sequelize");
const Image = db.images;

const getSomeImages = (params) => {
    const { limit, offset, dimension, filteringOptions } = params;
    let where = {}
    let order = []
    const enFiltering = {
        '0': Op.like,
        '1': Op.notLike,
        '2': Op.eq
    }
    const enSorting = {
        '0': '',
        '1': 'DESC',
        '2': 'ASC'
    }
    Object.keys(filteringOptions).forEach(key => {
        const { filtering, filteringValue, sorting } = filteringOptions[key]
        if (!where[key]) {
            where[key] = {}
        }
        const value = filtering === '2' ? `${filteringValue}` : `%${filteringValue}%`
        const attribute = enFiltering[filtering]
        where[key] = { [attribute]: value }
        if (sorting && sorting !== '0') {
            order = [...order, [key, enSorting[sorting]]]

        }

    })

    const imagesCombined = [
        Image.findAndCountAll({
            where,
            order,
            limit,
            offset,
            attributes: [
                'id', 'createdAt', 'author', 'title', 'description', [dimension, 'data']
            ]
        }),
        Image.count()
    ]

    return Promise.all(imagesCombined).then(allData => ({
        data: allData[0] || [],
        totalLength: allData[1]
    }))
}

module.exports = { getSomeImages }
