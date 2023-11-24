# mangor

### This repository contains MERN+ stack experements, including

1. dockerized microservices for authentication, API-gateway, Mongodb and MySQL databases, with further extention to the specific functionality according to the business profile
2. Micro-UI solution (ModuleFederation)
 1.1 Core - React
 1.2 Remote - Angular standalone components: Angular repository is serving as a component Factory
 1.3 Remote store - solution to enable state sharing between isolated components - connects to the both: Angular-Remote and React-Host
3. i18-next internationalization
4. bootstrap theming (dark/light mode)
5. PassportJs playground with local strategy and JWT strategy
6. Mongodb + mongoose integration to store user-related information

#### How it works

Make sure to have docker-compose installed.
Run in the command: *docker-compose up --build* in the root of repository. That will pull all requred images according to docker-compose.yaml configuration and deploy application.

To remove unused containers (cleanup): in the root of repositury run *docker system prune --all --force* command.
Other useful commands:
sudo docker-compose run web "ping" "authentication"
docker-compose up --build
docker system prune --all --force
docker ps
docker stop <container_name> && docker rm <container_name>

###### login to container

docker exec -it web sh

###### exit from container

exit

###### some docker-networking tools to investigate connectivity issues

*sudo docker-compose run web "ping" "authentication"*
*sudo docker-compose run web "curl" "<http://<authenticationIP>/remoteEntry.js>"*

### Development setup

1. Spinup the containers.
2. Stop the targeted container.
3. Go to desired folder with source code (*cd web* for example - in the command line)
4. run *npm i* and *npm start*
5. Hint: Node applications could be debugged according to the your preffered IDE recommendations.

## Happy Coding ;)
