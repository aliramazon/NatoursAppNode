const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// checkID middlaware function
exports.checkID = (req, res, next, val) => {
    const tour = tours.find(tour => tour.id === parseInt(val));

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};

// checkBody middlaware function
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }
    next();
};

// ROUTE HANDLERS
// getAllTours
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
};

// createTour
exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {
        id: newId,
        ...req.body
    };
    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

// getTour
exports.getTour = (req, res) => {
    const { id } = req.params;
    const tour = tours.find(tour => tour.id === parseInt(id));
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

// updateTour
exports.updateTour = (req, res) => {
    const { id } = req.params;
    const tour = tours.find(tour => tour.id === parseInt(id));
    const newTour = { ...tour, ...req.body };
    const newTours = tours.map(tour => (tour.id === newTour.id ? newTour : tour));

    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(newTours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        }
    );
};

// deleteTour
exports.deleteTour = (req, res) => {
    const { id } = req.params;
    const tour = tours.find(tour => tour.id === parseInt(id));

    const newTours = tours.filter(tour => tour.id !== parseInt(id));

    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(newTours),
        err => {
            res.status(204).json({
                status: 'success',
                data: null
            });
        }
    );
};
