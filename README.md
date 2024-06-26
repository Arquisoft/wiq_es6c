# wiq_es6c

## Contributors
<div align="center">
    
| Contributor | Contact |
| ------------- | ------------- | 
| Liliana Suárez Díaz | <a href="https://github.com/uo288574"><img src="https://img.shields.io/badge/uo288574-Liliana Suárez-green"></a> |
| Marco Quintana García | <a href="https://github.com/marco-qg"><img src="https://img.shields.io/badge/marcoqg-Marco Quintana-red"></a> |
| Abel Menéndez Hernández | <a href="https://github.com/AbelMH1"><img src="https://img.shields.io/badge/AbelMH1-Abel Menéndez-purple"></a>  |
| Marcos Barril Villaverde | <a href="https://github.com/MarcosBarrilVillaverde"><img src="https://img.shields.io/badge/MarcosBarrilVillaverde-Marcos Barril-yellow"></a> |
| Alejandro García Mansilla | <a href="https://github.com/alegarman2002"><img src="https://img.shields.io/badge/alegarman2002-Alejandro García-blue"></a> |

</div>

## Links
- [WIQEII](http://158.179.212.42:3000)
- [User's API](http://158.179.212.42:8100)
    - [/users](http://158.179.212.42:8100/users) -> Información de los usuarios
    - [/history/questions](http://158.179.212.42:8100/history/questions) -> Información de las preguntas generadas
    - [/usersStats](http://158.179.212.42:8100/usersStats) -> Información de las estadísticas de los usuarios

## Code analisis

<div align="center">
    
[![Deploy on release](https://github.com/Arquisoft/wiq_es6c/actions/workflows/release.yml/badge.svg)](https://github.com/Arquisoft/wiq_es6c/actions/workflows/release.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_es6c&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_es6c)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_es6c&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_es6c)

</div>

## Components

This is a repo for the [Software Architecture course](http://arquisoft.github.io/) in [2023/2024 edition](https://arquisoft.github.io/course2324.html) composed of the following components.

- **Game service**. Express server that mainly send requests from gateway to question generator service
- **Gateway service**. Express service that is exposed to the public and serves as a proxy to the two previous ones.
- **Question Generator service**. Express service that is going to generate the questions based on the wikidata information and the parameters given by the user
- **Store question service**. Express service that is going to store all the generated questions
- **User service**. Express service that handles the insertion of new users in the system.
- **Auth service**. Express service that handles the authentication of users.
- **User stats service**. Express service that is going to store all the users data so we are going to be able to access to it later
- **Api's Gateway Service** Express service that is exposed to check the users information and the questions generated
- **Wikidata Extractor Service** Express service that extracts and update information from wikidata to a related topic each 30 minutes
- **Webapp**. React web application that uses the gateway service to allow basic login and new user features.


## Quick start guide

### Using docker

The fastest way for launching this sample project is using docker. Just clone the project:

```sh
git clone https://github.com/Arquisoft/wiq_es6c.git
```

and launch it with docker compose:

```sh
docker compose --profile dev up --build
```

### Starting Component by component

First, start the database. Either install and run Mongo or run it using docker:

```docker run -d -p 27017:27017 --name=my-mongo mongo:latest```

You can also use services like Mongo Altas for running a Mongo database in the cloud.

Now, launch the auth, user and gateway services. Just go to each directory and run `npm install` followed by `npm start`.

Lastly, go to the webapp directory and launch this component with `npm install` followed by `npm start`.

After all the components are launched, the app should be available in localhost in port 3000.

## Deployment

For the deployment, we have several options. 

The first and more flexible is to deploy to a virtual machine using SSH. This will work with any cloud service (or with our own server). 

Other options include using the container services that most cloud services provide. This means, deploying our Docker containers directly. 

We are going to use the first approach, creating a virtual machine in a cloud service and after installing docker and docker-compose, deploy our containers there using GitHub Actions and SSH.

### Machine requirements for deployment

The machine for deployment can be created in services like Microsoft Azure or Amazon AWS. These are in general the settings that it must have:

- Linux machine with Ubuntu > 20.04.
- Docker and docker-compose installed.
- Open ports for the applications installed (in this case, ports 3000 for the webapp and 8000 for the gateway service).

Once you have the virtual machine created, you can install **docker** and **docker-compose** using the following instructions:

```ssh
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
sudo apt install docker-ce
sudo usermod -aG docker ${USER}
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Continuous delivery (GitHub Actions)

Once we have our machine ready, we could deploy by hand the application, taking our docker-compose file and executing it in the remote machine. 

In this repository, this process is done automatically using **GitHub Actions**. The idea is to trigger a series of actions when some condition is met in the repository. 

As you can see, unitary tests of each module and e2e tests are executed before pushing the docker images and deploying them. Using this approach we avoid deploying versions that do not pass the tests.

The deploy action is the following:

```yml
deploy:
    name: Deploy over SSH
    runs-on: ubuntu-latest
    needs: [docker-push-userservice,docker-push-authservice,docker-push-gatewayservice,docker-push-webapp]
    steps:
    - name: Deploy over SSH
      uses: fifsky/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        user: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        command: |
          wget https://raw.githubusercontent.com/arquisoft/wiq_es6c/master/docker-compose.yml -O docker-compose.yml
          wget https://raw.githubusercontent.com/arquisoft/wiq_es6c/master/.env -O .env
          docker compose down
          docker compose --profile prod up -d
```

This action uses three secrets that must be configured in the repository:
- DEPLOY_HOST: IP of the remote machine.
- DEPLOY_USER: user with permission to execute the commands in the remote machine.
- DEPLOY_KEY: key to authenticate the user in the remote machine.

Note that this action logs in the remote machine and downloads the docker-compose file from the repository and launches it. Obviously, previous actions have been executed which have uploaded the docker images to the GitHub Packages repository.
