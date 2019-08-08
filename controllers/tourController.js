const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

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

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

// updateTour
exports.updateTour = (req, res) => {
    const tour = tours.find(tour => tour.id === parseInt(req.params.id));

    if (!tour) {
        res.send(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
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
    if (!tour) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

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
