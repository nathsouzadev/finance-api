# Finance API

Finance API is a service provider to get actual balance from account and operatioons historical in last 90 days.

## How to run locally

1 - Clone the repository

2 - Instal and run [Docker Desktop](https://www.docker.com/);

3 - Install all dependencies and configure database

---
    yarn local
---

3 - The local database is available at port 5010

4 - Running application locally

---
    yarn start:dev
---

### Testing

#### Unit tests

---
    yarn test:unit
---

#### e2e tests

---
    yarn test:e2e
---

#### unit tests and e2e tests

---
    yarn ci:local
---

## Usage

You can use the alpha version with datas bellow

#### IMPORTANT
Use dates considering the actual date.

Example: today is 2022-10-23. To get operations from one day before, you can use 2022-10-22.

The data on local database are generated dynamically every time whe you run the command to configure the database or to run e2e tests.

---
    curl --location --request GET 'localhost:3000/clients/4e423bda-7c4b-4564-8e86-4b0e4812e7c0/'
---

The response expected from thats call is:

---
    {
      "balance": 100,
      "date": "2022-12-13T21:34:54.849Z"
    }
---

You can get operations filtered by date

---
    curl --location --request GET 'localhost:3000/clients/4e423bda-7c4b-4564-8e86-4b0e4812e7c0/releases?start_date=2022-12-11&end_date=2022-12-15'
---

The response expected from thats call is:

---
    {
        "totalPages": 2,
        "page": 1,
        "nextPage": true,
        "releases": {
            "2022-12-13": [
                {
                    "id": "35e42af4-5602-4895-9646-c094dddb1d03",
                    "userId": "4e423bda-7c4b-4564-8e86-4b0e4812e7c0",
                    "createdAt": "2022-12-13T00:00:00.000Z",
                    "description": "Salary",
                    "value": 3500
                },
                {
                    "id": "f30d9b30-001b-4968-8ada-7d114a7e2f06",
                    "userId": "4e423bda-7c4b-4564-8e86-4b0e4812e7c0",
                    "createdAt": "2022-12-13T00:00:00.000Z",
                    "description": "Food",
                    "value": -10
                }
            ],
            "2022-12-12": [
                {
                    "id": "6f2e7d74-12eb-4a00-8747-42a9e7802c7d",
                    "userId": "4e423bda-7c4b-4564-8e86-4b0e4812e7c0",
                    "createdAt": "2022-12-12T00:00:00.000Z",
                    "description": "Food",
                    "value": -3.67
                },
                {
                    "id": "6ba8b7bb-a9ea-4a95-bb22-cfd6d1d2863a",
                    "userId": "4e423bda-7c4b-4564-8e86-4b0e4812e7c0",
                    "createdAt": "2022-12-12T00:00:00.000Z",
                    "description": "Car",
                    "value": -253.49
                }
            ]
        }
    }
---

You can get a file to download with operations with more than 90 days

---
    curl --location --request GET 'localhost:3000/clients/4e423bda-7c4b-4564-8e86-4b0e4812e7c0/releases?start_date=2022-12-11&end_date=2022-09-15'
---
