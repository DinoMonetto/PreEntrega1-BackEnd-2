// src/routes/users.js
import express from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { email, password, age, first_name, last_name } = req.body;

        // Verifica si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'El usuario ya existe' });
        }

        // Verifica que todos los campos estén presentes
        if (!email || !password || !age || !first_name || !last_name) {
            return res.status(400).json({
                status: 'error',
                message: 'Por favor llene todos los campos.'
            });
        }

        // Cifra la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuevo usuario
        const user = new User({
            email,
            password: hashedPassword,
            age,
            first_name,
            last_name
        });

        // Guarda el usuario en la base de datos
        await user.save();

        res.status(201).json({ status: 'success', message: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Autenticar usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Email incorrecto' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // Imprime los logs para depuración
        console.log(`Contraseña proporcionada: ${password}`);
        console.log(`Hash almacenado: ${user.password}`);
        console.log(`¿Contraseña coincide? ${isMatch}`);

        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });
        }

        res.json({ status: 'success', message: 'El usuario accedió correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
