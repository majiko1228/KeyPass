# KeyPass

JDK 11 Spring Boot Maven multi-module project.

## Modules

- `keypass-start`: startup class and config files
- `keypass-business`: business services
- `keypass-base`: shared constants and models

## Frontend prototype

The Spring Boot service serves the account-vault prototype from `http://localhost:9111/keyPass/`.
Use `GET /api/health` to verify the backend service is available.

Implemented views:
- Unlock screen
- Vault list and detail panel
- Entry editor modal
- Password generator modal
- Trash view
- Settings and local JSON import/export

## Requirements

- JDK 11
- Maven 3.6+

## Commands

```bash
mvn test
mvn package
java -jar keypass-start/target/keypass-start-1.0-SNAPSHOT.jar
```
