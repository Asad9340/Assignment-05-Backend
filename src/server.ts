import app from './app';
import { envVars } from './app/config/env.config';

const port = envVars.PORT;

const bootstrap = () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log('Failed to start server', error);
  }
};

bootstrap();
