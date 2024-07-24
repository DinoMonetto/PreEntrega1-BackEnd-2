import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user: user
            });
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }

            const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
            res.cookie('jwt', token, { httpOnly: true });
            return res.json({ token });
        });
    })(req, res);
});

router.get('/current', passport.authenticate('jwt-cookie', { session: false }), (req, res) => {
    res.json(req.user);
});

export default router;
