// Controller for W08
const https = require('https')

const ITEMS_PER_PAGE = 10

const renderIndex = (req, res, json) => {
    let searchedValue = req.body.searchValue || req.query.searchValue || '';
    let page = +req.query.page || 1;
    let totalItems = 0;

    const indexStart = (page - 1) * ITEMS_PER_PAGE;
    const indexEnd = page * ITEMS_PER_PAGE;

    const filteredData = global.jsonResponse.filter(x =>
        x.name.toLowerCase().includes(searchedValue.toLowerCase())
    )

    filteredData.forEach(element => {
        totalItems++
    });

    let stuff = {
        data: filteredData.slice(indexStart, indexEnd), // For JSON/Array and not Mongoose, .slice() works best.
        path: 'proveAssignments/08',
        title: 'Week 8 Prove Assignment',
        searchedValue: searchedValue,
        totalItems,
        currentPage: page,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1
    }
    
    res.render('pages/prove/prove08', stuff)
}

exports.processJson = (req, res, next) => {
    // read json
    var url = 'https://byui-cse.github.io/cse341-course/lesson03/items.json'

    https
        .get(url, function (response) {
            var body = ''

            response.on('data', function (chunk) {
                body += chunk
            })

            response.on('end', function () {
                global.jsonResponse = JSON.parse(body)
                // Simplifying W03 rendering...
                renderIndex(req, res, global.jsonResponse)
            })
        })
        .on('error', function (e) {
            console.log('Got an error: ', e)
        })
}

// New code for W08...
exports.getIndex = (req, res, next) => {
    renderIndex(req, res, global.jsonResponse) // Render page.
}