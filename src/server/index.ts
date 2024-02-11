import express, { Response } from 'express';
import cors from 'cors';

const PORT = 9090;
const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/ping', async (_req, res: Response) => {
  res.send({
    status: 'success',
    message: 'Server is ready'
  })
});

app.post('/api/registration', async (_req, res: Response) => {
  if (Date.now() % 2) {
    res.json({ 
      "status": "success",
      "msg": "Ваша заявка успешно отправлена"
    });
  } else {
    res.statusCode = 400;

    res.json({
      "status": "error",
      "fields": {
        "firstName":"сообщение об ошибке",
        "email": "сообщение об ошибке",          
        "tel":"сообщение об ошибке",
        "message":"сообщение об ошибке",
      }
    });
  }
});

app.listen(PORT, () =>
  console.log(`App is running on http://localhost:${PORT}`)
);
