./rabbitmqadmin get queue=user_signup_queue count=10

docker exec -it redis-stack-server redis-cli

docker run -d -p 9042:9042 --name cassandra cassandra:latest
docker run -d -p 5672:5672 -p 15672:15672 --name rabbitmq rabbitmq:management
docker run -d -p 6379:6379 -p 6543:5432 --name redis-stack-server redis/redis-stack-server:latest
docker run -d -p 5432:5432 --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword postgres


docker exec -it cassandra cqlsh
docker exec -it rabbitmq bash
rabbitmqctl list_queues
http://localhost:15672


docker exec -it redis-stack-server redis-cli

docker exec -it my-postgres psql -U postgres
