# KeyPass

JDK 11 Spring Boot Maven multi-module project.

## Modules

- `keyPass-start`: startup class and config files
- `keyPass-business`: unified business module, currently split into `account` and `login` domains
- `keyPass-base`: shared constants and models

## Frontend

The frontend uses Vue 3 and Vite. It is built during Maven's `generate-resources` phase, then packaged as Spring Boot static resources. The frontend and backend are deployed together in one Jar.

The account-vault page is available at `http://localhost:9111/keyPass/` or `http://localhost:9111/keyPass/home/`.
Use `GET /api/health` to verify the backend service is available.

For frontend-only development:

```bash
cd web
npm install
npm run dev
```

## Requirements

- JDK 11
- Maven 3.6+

## Commands

```bash
mvn test
mvn package
java -jar keyPass-start/target/keyPass-start-1.0-SNAPSHOT.jar
```
