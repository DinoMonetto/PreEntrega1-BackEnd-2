// src/routes/sessions.js
import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Algo no anda bien...',
                user: user
            });
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.cookie('jwt', token, { httpOnly: true });
            return res.json({ token });
        });
    })(req, res, next);
});

router.get('/current', passport.authenticate('jwt-cookie', { session: false }), (req, res) => {
    res.json(req.user);
});

export default router;
