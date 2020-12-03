# webevento

# BANCO DE DADOS LOCAL
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
docker start {name}
docker stop {name}

# BACKEND
yarn
yarn typeorm migration:run
yarn dev-server

# FRONTEND
yarn
yarn start

# DESKTOP
yarn
yarn desk