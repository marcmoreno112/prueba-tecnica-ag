# Prueba técnica Ag

## Contenido

- [Instalación](#castellano)
- [Endpoints](#endpoints)
- [Preguntas](#preguntas)

## Instalación

1. Clonar el repositorio con "git clone"
2. Ejecutar "npm install"
3. Renombrar el archivo ".env-example" a ".env"
4. Ejecutar los scripts deseados:

`npm run build`: compila el código fuente de la aplicación

`npm run start`: inicia la aplicación

`npm run test`: ejecuta los tests

### Stack Tecnológico

---

### **Servidor**

🔸Node (https://nodejs.org/es)  
🔸Express (https://expressjs.com/es/)  
<br>

### **Base de Datos**

🔸MongoDB Atlas (https://www.mongodb.com/docs/)  
<br>

### **Lenguajes**

🔸Typescript (https://www.typescriptlang.org/docs/)  
<br>

### **Herramientas de Buenas Prácticas**

🔸Husky hooks (https://typicode.github.io/husky/#/)  
🔸Eslint (https://eslint.org/)  
🔸Formateador de código Prettier (https://prettier.io/)  
🔸Editorconfig

### **Tests**

🔸React Testing Library (https://testing-library.com/)  
🔸Jest (https://jestjs.io/)  
🔸MongoDB Memory Server (https://www.npmjs.com/package/mongodb-memory-server)  
🔸Supertest (https://www.npmjs.com/package/supertest)

---

<br>

## Endpoints

Documentación de endpoints en http://localhost:4000/api-docs

### **GET /ping**

<br>

- Method: GET

- Dev URL: http://localhost:4000/ping

- Response: Status 200, {
  "message": "🏓 Pong"
  }

<br>

### **POST /user/login**

<br>

- Method: POST

- Dev URL: http://localhost:4000/user/login

- Request body: {"username": admin, "password": admin}

- Response: Status 200, {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDZmNmJmYmI3NzkyOGMxZDNjZTI3OTMiLCJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2ODU4MTUyOTMsImV4cCI6MTcxMTczNTI5M30.Cltnky--TuDPTu6bdhbC_xJPGVNtAar1mfdrTMlIiXo"
  }

<br>

### **CREATE USER /user/create**

<br>

- Method: POST

- Dev URL: http://localhost:4000/user/create

- Request body: {"username": string, "password": string, "role": user | admin, "loggedUsername": user | admin}

- Response: Status 200, { returnedUser: {username: string} }

---

## Preguntas

### **¿Es necesario crear un endpoint de logout?**

En mi opinión es recomendable crearlo. Tanto para permitir al usuario cerrar sesión en su dispositivo, como para poder implementar una enfoque de lista negra de tokens. Desconozco cómo estará planteado el front-end y cómo almacena el token, por lo que me parece especialmente interesante.

### **Formas de hacer la funcionalidad "dar de baja"**

1. Setear la propiedad "state" del usuario a "being deleted" y usar un cronjob para limpiar la base de datos de usuarios de forma periódica.
2. Usar un Web Worker de JS para ejecutar la tarea en paralelo al thread principal y no esperar a que se complete.
3. Usar una herramienta como RabbitMQ para ejecutar tareas en segundo plano.
