f = require('./ex16.js');

const code = `
/*
Importing many
many many things
*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

 
/*
Async function to bootstrap nestjs app
*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

//Choosing port for app
  await app.listen(3000);
}

//Bootstrapping app
bootstrap();
`;

describe('Regexp 16', () => {
  it('Test case for ex16', () => {
    expect(f(code)).toBe(4);
  });
});
