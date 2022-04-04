# 57_blocks_music

## Installation and Setup

Moving on, I am going to explain the steps to run this code from the docker:

1. Add the .env according to .env.example, you could change the values for your database or environment.

2. To install the project from docker you must run the next command and it'll launch the serve on [http://localhost](http://localhost):<br/>
   `docker-compose up`

3. After the Docker started, you should enter to docker shell environment with the next command:<br/>
   `sudo docker exec -it nodejs_57blocks_music bash`

4. Next, you should go to the migration folder with the next command:<br/>
   `cd ./src/migration/`

5. Finally, you should run the following command:<br/>
   `npx migrate-mongo up`

**Note**: You should have installed and configured the docker on your computer.

## Running the unit tests

Now, I am going to explain the steps to run the unit tests:

1. You should enter to the docker environment with the next command:<br/>
   `sudo docker exec -it nodejs_57blocks_music bash`

2. You should run the next command:

   `npm run test`

