
# mangor 
[logo]: https://github.com/alxmandra/mangor/blob/main/web/public/favicon.png 
![MANGOR MERN+NGINX+Micro-UI+Microservices][logo]
### This repository contains MERN+ stack experements, including:

1. dockerized microservices for authentication, API-gateway, MongoDB, and MySQL databases, with further extensions to the specific functionality according to the business profile.
2. Micro-UI solution (Module Federation) * Core: React * Remote: Angular standalone components: The Angular repository is serving as a component factory. * Remote store: a solution to enable state sharing between isolated components that connects to both Angular-Remote and React-Host 
3. i18-next internationalization 
4. bootstrap theming (dark/light mode) 
5. PassportJs playground with local strategy and JWT strategy 
6. MongoDB and Mongoose integration to store user-related information #### How it works Make sure to have Docker Compose installed. Run the command *docker-compose up --build* in the root of the repository. That will pull all the required images according to the docker-compose.yaml configuration and deploy the application.

To remove unused containers (cleanup): 
in the root of the repository, run the *docker system prune --all --force* command. Other useful commands:
 ###### sudo docker-compose run web "ping" "authentication"
 ###### docker-compose up --build
 ###### docker system prune --all --force
 ###### docker ps
 
*login to container*
###### docker exec -it web sh 
*exit from container*
###### exit 
*some docker-networking tools to investigate connectivity issues:*
###### sudo docker-compose run web "ping" "authentication"
###### sudo docker-compose run web "curl" "<http://<RemoteAddress>/remoteEntry.js>"
 
### Development setup

1. Spin up the containers.
2. Stop the targeted container.
3. Go to the desired folder with the source code (*cd web* for example, in the command line).
4. run *npm i* and *npm start*
5. Hint: Node applications could be debugged according to your preferred IDE recommendations.

## Happy Coding;)
