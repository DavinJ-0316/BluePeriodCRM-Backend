# README

This README would normally document whatever steps are necessary to get your application up and running.

# Pre-reqs

To build and run this app locally you will need a few things:

- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [VS Code](https://code.visualstudio.com/)
- Create .env in the project root folder
- Copy environment variable into .env

### What is this repository for?

- Quick summary
- Version
- [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up?

- Summary of set up
- Configuration
- Dependencies
- Database configuration
- How to run tests
- Deployment instructions

### Contribution guidelines

- Writing tests
- Code review
- Other guidelines

### Who do I talk to?

- Repo owner or admin
- Other community or team contact

# Getting started

- Clone the repository

```
git clone https://billychui@bitbucket.org/devilscrm/devils-crm-backend.git <project_name>
```

- Install dependencies

```
cd <project_name>
npm install
```

- Build and run the project

```
npm run build
npm start
```

### Create a managed MongoDB with Atlas / local database

1. Navigate to [MongoDB's website](https://www.mongodb.com/cloud/atlas), sign up for a free account, and then log in.
2. After creating the account, enter the organization name, project name, and select your preferred language (JavaScript).
3. Select the **Shared Cluster** to get a free version with up to 512 MB storage which is great for development purposes.
4. On the "Create a Starter Cluster" page you can select cloud provider, region, region, cluster tier, and
   MongoDB settings, like version and backup frequency (Note: there is no option to create backups in the free tier).
5. If you already know to which cloud provider and region you want to deploy later, you should select the same here for best performance. Otherwise select a region close to the location where you plan to deploy the application later.
6. Select **M0 Sandbox** as the Cluster Tier, give your cluster a name, and then click the "Create Cluster" button.
7. It will now take a couple of minutes to create the cluster and you will be redirected to the MongoDB Atlas Admin interface.
8. Now you must configure access and security before you can use the database.
9. To whitelist an IP address, go to the **Network Access** section and click the "Add IP Address" button. For local development you can select your current IP address.
10. Create a user by selecting the **Add New Database User** in Database Access, adding a username and password (Password Authentication method) and give him read and write access to any database within the cluster.
    A user account is required to connect to the database, so remember these values because you will need them as part of your connection string.
11. Within the Clusters section, click the **Connect** button in your cluster to connect to the database.
12. You could now connect to the cluster using [MongoDB Compass](https://www.mongodb.com/products/compass), which is a graphical interface (GUI) to interact with the database.
13. But we need to select **Connect your application** to get the connection string, it should look like this: `mongodb+srv://<username>:<password>@your-cluster.12abc.mongodb.net/your-database?retryWrites=true&w=majority`
    and replace `<username>` and `<password>` with the credentials you just created.
    Back in your project, open your `.env` file and update `MONGODB_URI` with your new connection string. > NOTE! - If you don't have an `.env` file yet, rename `.env.example` to `.env` and follow the comments to update the values in that file.
14. **Success!**

### environment

1. Change you `NODE_ENV` for you testing environment

Developer:

- NODE_ENV=development

DevOPs:

- Production: NODE_ENV=production
- UAT: NODE_ENV=uat
