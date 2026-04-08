const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'https://my-hva-capp-fullstack-i3zf.vercel.app',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
    res.send('Appliancepro is running!');
});


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
        console.log(`server is running on http://localhost:${process.env.PORT || 5000}`);
    });
})
.catch((err) => console.log('MongoDB connection error:', err));
