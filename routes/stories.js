const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../helpers/auth');
const mongoose = require('mongoose');


require('../models/Story');
const Story = mongoose.model("stories");

router.get("/", (req, res) => {

    Story.find({
        status: 'public'
    }).sort({
        date: 'desc'
    }).populate('user').then(stories => {
        res.render("stories/index", {
            stories: stories
        });
    })


});

//show single story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).populate('user').populate('comments.commentUser').then(story => {
        if (story.status === 'public') {
            res.render('stories/show', {
                story: story
            });
        } else {
            if (req.user) {
                if (req.user.id === story.user.id) {
                    res.render('stories/show', {
                        story: story
                    });
                } else {
                    res.redirect('/stories');
                }
            } else {
                res.redirect('/stories');
            }
        }
    });
});

router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("stories/add")
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).populate('user').then(story => {
        console.log(story.user);
        console.log(req.user.id);

        if (story.user.id != req.user.id) {
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {
                story: story
            });
        }

    });
});

//edit form process
router.put("/:id", (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).populate('user').then(story => {
        let allowComment;
        if (req.body.allowComment) {
            allowComment = true;
        } else {
            allowComment = false;
        }
        story.title = req.body.title;
        story.body = req.body.body;
        story.status = req.body.status;
        story.allowComment = allowComment


        story.save().then(story => {
            res.redirect(`show/${story.id}`);
            console.log(story);
        })
    });
});

router.delete("/:id", (req, res) => {
    Story.remove({
        _id: req.params.id
    }).then(() => {
        res.redirect('/dashboard');
    })
});

router.post('/', (req, res) => {

    let allowComment;
    if (req.body.allowComment) {
        allowComment = true;
    } else {
        allowComment = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComment: allowComment,
        user: req.user.id
    }

    new Story(newStory).save().then(story => {
        res.redirect(`/stories/show/${story.id}`);
    })

});

router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    }).then(story => {
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }
        //add to comments array
        story.comments.unshift(newComment);
        story.save().then(story => {
            res.redirect(`/stories/show/${story.id}`);
        })
    });
});

router.get('/user/:userId', (req, res) => {
    Story.find({
        user: req.params.userId,
        status: 'public'
    }).populate('user').then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    })
});

router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({
        user: req.user.id
    }).populate('user').then(stories => {
        res.render('stories/index', {
            stories: stories
        });
    })
});
module.exports = router;