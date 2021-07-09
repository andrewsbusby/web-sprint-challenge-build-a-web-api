// Write your "projects" router here!
const express = require('express');
const {
    validateProjectId,
    validateProject,
    validatePorjectWithComplete
} = require('./projects-middleware')

const Projects = require('./projects-model');
const router = express.Router();


router.get('/', (req, res, next) => {
    Projects.get()
        .then(proj => {
            res.status(200).json(proj)
        })
        .catch(next)
});

router.get('/:id', validateProjectId, async (req, res) => {
    res.json(req.project)
})

router.post('/', validateProject , (req, res, next) => {
    Projects.insert(req.body)
    .then(newProject => {
        rew.status(201).json(newProject)
    })
    .catch(next)
})

router.put('/:id', validateProjectId, validateProject, (req, res, next) => {
    Projects.update(req.params.id, req.body)
    .then(() => {
        return Projects.get(req.params.id)
    })
    .then(updated => {
        res.json(updated)
    })
    .catch(next)
})

router.delete('/:id', validateProject, async (req, res, next) => {
    try {
        await Projects.remove(req.params.id)
        res.json(req.project)
    }
    catch (err) {
        next(err)
    }
})

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    try {
        const actions = await Projects.getProjectActions(req.params.id)
        res.json(actions)
    }
    catch(err) {
        next(err)
    }
})

router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack
    })
})

module.exports = router