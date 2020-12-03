# webevento

# BANCO DE DADOS LOCAL - usando docker
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres <br>
docker start {name} <br>
docker stop {name}

# BACKEND
yarn <br>
yarn typeorm migration:run <br>
yarn dev-server <br>

# FRONTEND
yarn <br>
yarn start

# DESKTOP
yarn <br>
yarn desk
