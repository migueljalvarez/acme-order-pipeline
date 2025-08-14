
## ⚙️ Variables de Entorno

Ubicación del archivo: `src/common/environments/.env`.
### Ejecución Local

```
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=acme-order-pipeline
KAFKA_GROUP_ID=acme-order-service

APP_ENV=development
APP_NAME=Acme Order Pipeline
APP_PORT=9000
APP_URL=http://localhost:9000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DATABASE=ecommerce_inventory

MONGODB_HOST=localhost  
MONGODB_PORT=27017
MONGODB_USERNAME=admin
MONGODB_PASSWORD=admin123
MONGODB_DATABASE=ecommerce_orders

TAX_RATE=0.5
KAFKAJS_NO_PARTITIONER_WARNING=1

```

### Ejecución con Docker

Para Docker, sustituye `localhost` por los nombres de los servicios definidos en `docker-compose.yml` y comenta las variables locales:

```
KAFKA_BROKERS=kafka:29092
#KAFKA_BROKERS=localhost:9092
POSTGRES_HOST=postgres
#POSTGRES_HOST=localhost
MONGODB_HOST=mongodb
#MONGODB_HOST=localhost

```
> **Nota:** El resto de variables (`APP_ENV`, `APP_PORT`, `TAX_RATE`, etc.) se mantiene igual tanto en local como en Docker.

## 🚀 Ejecutando con Docker Compose
Este proyecto está diseñado para ejecutarse completamente en contenedores usando Docker Compose. A continuación se describen los servicios incluidos y cómo levantarlos.

## Servicios incluidos

| Servicio            | Imagen / Build                          | Puertos                  | Notas                                                                                                                                                                              |
| ------------------- | --------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App**             | Build desde Dockerfile (`.`)            | `3000:9000`              | API NestJS principal, depende de Postgres, Kafka y MongoDB. Usa variables de entorno en `src/common/environments/.env`.                                                            |
| **PostgreSQL**      | `postgres:16`                           | `5432:5432`              | Base de datos para inventario. Variables: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`. Incluye scripts de inicialización en `./init-scripts/postgres`.                     |
| **MongoDB**         | `mongo:7.0`                             | `27017:27017`            | Base de datos para órdenes. Variables: `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`, `MONGO_INITDB_DATABASE`. Scripts de inicialización en `./init-scripts/mongodb`. |
| **Zookeeper**       | `confluentinc/cp-zookeeper:7.5.0`       | `2181:2181`              | Necesario para Kafka.                                                                                                                                                              |
| **Kafka Broker**    | `confluentinc/cp-kafka:7.5.0`           | `9092:9092`, `9101:9101` | Configurado con listeners PLAINTEXT y PLAINTEXT\_INTERNAL. Depende de Zookeeper.                                                                                                   |
| **Schema Registry** | `confluentinc/cp-schema-registry:7.5.0` | `8081:8081`              | Para gestión de esquemas Protobuf en Kafka. Depende de Kafka.                                                                                                                      |

## Volúmenes persistentes

postgres_data → /var/lib/postgresql/data

mongodb_data → /data/db

zookeeper_data → /var/lib/zookeeper/data

zookeeper_logs → /var/lib/zookeeper/log

kafka_data → /var/lib/kafka/data

### Red de contenedores
Todos los servicios están conectados a la red ecommerce_network (driver bridge), permitiendo comunicación interna entre contenedores usando los nombres de servicio como hostnames (postgres, mongodb, kafka, etc.).

### Comandos principales 

Levantar todos los servicios:
```
docker-compose up -d 
```
Ver logs de la app:
```
docker-compose logs -f app
```
Detener y eliminar contenedores:
```
docker-compose stop
```

```
docker-compose rm
```

Ver el estado de los contenedores y sus puertos:

```
docker-compose ps
```

### Prerrequisitos
- Docker & Docker Compose
- Make (opcional)

### Levantamiento

```bash
docker compose up -d
make kafka-create-topics
```

### Verificar que todo esté funcionando

```bash
# Verificar estado de servicios
make status

# Ver información de conexión
make info
```

### Ver comandos

```bash
make help
```