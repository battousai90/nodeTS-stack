import express from 'express';
import morgan from 'morgan';

const app = express();  // Create an Express application
app.use(morgan('dev')); // Log requests to the console

app.get('/', (req, res) => {
    res.json( {Hello: 'World2'});
})

const port = Number(process.env.PORT || 8080);  // 8080 is the default port if PORT is not set
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
});
