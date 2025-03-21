## ** Getting Started**

### **1. Prerequisites**

Ensure you have the following installed:

- **Node.js** (`>=16.x`) - [Download here](https://nodejs.org/)
- **npm** or **yarn** (`>=8.x`)
- **Docker** (for PostgreSQL) - [Download here](https://www.docker.com/)

---

### **2. Clone the Repository**

```sh
git clone https://github.com/your-username/popcorn-palace.git
cd popcorn-palace
```

---

### **3. Install Dependencies**

Run the following command to install all required packages:

```sh
npm install
```

---

### **4. Set Up Environment Variables**

Create a `.env` file in the project root and configure the database connection:

```env
DATABASE_URL="postgresql://popcorn-palace:popcorn-palace@localhost:5432/popcorn-palace"
PORT=3000
```

---

### **5. Start PostgreSQL Database (Using Docker)**

If you have **Docker**, start a PostgreSQL container:

```sh
docker-compose up -d
```

This will set up a database instance with **PostgreSQL**.

If you don’t have Docker, install PostgreSQL locally and create a database named **`popcorn-palace`**.

---

### **6. Set Up Prisma & Migrate Database**

Run the following command to apply migrations:

```sh
npx prisma generate dev
```

This will create the required database tables.

---

### **7. Run the Application**

Start the NestJS server in **development mode**:

```sh
npm run start
```

Or watch for file changes using:

```sh
npm run start:dev
```

Once running, the API is available at:  
 **http://localhost:3000**

---

## **🔧 Useful Commands**

| Command             | Description               |
| ------------------- | ------------------------- |
| `npm run start`     | Start the server          |
| `npm run start:dev` | Start in development mode |
| `npm run test`      | Run unit tests            |
| `npm run test:e2e`  | Run end-to-end tests      |
| `npm run test:cov`  | Run test coverage         |
