# KeyPass

JDK 11 Spring Boot Maven multi-module project.

## Modules

- `keyPass-start`: startup class and config files
- `keyPass-business`: unified business module, currently split into `account` and `login` domains
- `keyPass-base`: shared constants and models

## Frontend prototype

The Spring Boot service serves the login page from `http://localhost:9111/keyPass/`.
The account-vault home page is available at `http://localhost:9111/keyPass/home/`.
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
java -jar keyPass-start/target/keyPass-start-1.0-SNAPSHOT.jar
```
