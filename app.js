const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    });
};

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {
        id: newId,
        ...req.body
    };
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

const getTour = (req, res) => {
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

const updateTour = (req, res) => {
    const tour = tours.find(tour => tour.id === parseInt(req.params.id));

    if (!tour) {
        res.send(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    const newTour = { ...tour, ...req.body };
    const newTours = tours.map(tour => (tour.id === newTour.id ? newTour : tour));

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

const deleteTour = (req, res) => {
    const { id } = req.params;
    if (parseInt(id) >= tours.length) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    const newTours = tours.filter(tour => tour.id !== parseInt(id));

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(newTours), err => {
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
};

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});
