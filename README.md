<h1 align="center">Welcome to the Teratext API 👋</h1>

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)](https://github.com/godban/browsers-support-badges) [![Travis](https://img.shields.io/travis/godban/browsers-support-badges.svg)](https://github.com/godban/browsers-support-badges) [![David](https://img.shields.io/david/godban/browsers-support-badges.svg)](https://github.com/godban/browsers-support-badges)

> This is the API for <a href='https://teratext.vercel.app/'>Teratext</a>; a secure messaging web app. It is responsible for receiving all calls from the frond end. Some of it's uses are handling user authentication, sorting messages, and managing the DB. This API uses Node with Express and connects to a postgreSQL DB.

### 📨 [Live Demo](https://teratext.vercel.app/)
### 📦 [Front End Repo](https://github.com/willwalker753/teratext)

## 📚 Endpoint Docs

### Register &nbsp; `POST /register`
>Example Request
```json
{
    "username": "someusername",
    "password": "123456asd"
}
```
>Response
```json
{
    "username": "someusername",
    "userId": 1
}
```
---
### Login &nbsp; `POST /login`
>Example Request
```json
{
    "username": "someusername",
    "password": "123456asd"
}
```
>Response
```json
{
    "username": "someusername",
    "userId": 1
}
```
---
### User page info &nbsp; `POST /user`
>Example Request
```json
{
    "username": "someusername",
    "userId": 1
}
```
>Response
```json
[
    {
        "friendusername": "bill",
        "friendId": 173,
        "friendMessage": "No messages yet",
        "friendts": "",
        "friendProfilePic": "data:image/jpeg;base64,/9j/4AAQ..."
    }
]
```
---
### Get messages &nbsp; `POST /message/all`
>Example Request
```json
{
    "username": "someusername",
    "username": "someusername",
    "friendUsername": "bill",
    "userId": 1,
    "friendId": 173,
    "numOfMessages": 4
}
```
>Response
```json
[
    {
        "id": 1,
        "message": "How are you?",
        "sender": "someusername",
        "picture": "",
        "ts": "1/18/2020, 3:03:56 PM"
    }
]
```
---
### Send text &nbsp; `POST /message/send`
>Example Request
```json
{
    "username": "someusername",
    "friendUsername": "bill",
    "userId": 1,
    "friendId": 173,
    "text": "Hello"
}
```
>Response
```json
{
    "id": 2,
    "message": "Hello",
    "sender": "someusername",
    "picture": "",
    "ts": "1/17/2020, 2:03:56 PM"
}
```
---
### Send picture &nbsp; `POST /message/send/pic`
>Example Request
```json
{
    "username": "someusername",
    "friendUsername": "bill",
    "userId": 1,
    "friendId": 173,
    "picture": {
        "base64": "data:image/jpeg;base64,/9j/4AAQ..."
    }
}
```
>Response
```json
{
    "id": 2,
    "message": "",
    "sender": "someusername",
    "picture": "data:image/jpeg;base64,/9j/4AAQ...",
    "ts": "1/17/2020, 2:03:56 PM"
}
```
---
### Get all friends &nbsp; `POST /friend/all`
>Example Request
```json
{
    "username": "someusername",
}
```
>Response
```json
[
    {
        "friendId": 173,
        "friendUsername": "bill",
        "friendProfilePic": "data:image/jpeg;base64,/9j/4AAQ..."
    }
]
```
---
### Add friend by code &nbsp; `POST /friend/addcode`
>Example Request
```json
{
    "username": "someusername",
    "userId": 1,
    "friendId": 173
}
```
>Response
```json
{
   "friendId": 173,
    "friendUsername": "bill"
}
```
---
### Add friend by username &nbsp; `POST /friend/addusername`
>Example Request
```json
{
    "username": "someusername",
    "userId": 1,
    "friendUsername": "bill"
}
```
>Response
```json
{
    "friendId": 173,
    "friendUsername": "bill"
}
```
---
### Remove friend &nbsp; `POST /friend/removefriend`
>Example Request
```json
{
    "username": "someusername",
    "userId": 1,
    "usernameToRemove": "bill"
}
```
>Response
```json
{
    "id": 173,
   "username": "bill"
}
```
---
### Delete Conversation &nbsp; `POST /friend/deleteconversation`
>Example Request
```json
{
    "username": "someusername",
    "userId": 1,
    "usernameToRemove": "bill"
}
```
>Response
```json
{
    "friendId": 173,
    "friendUsername": "bill"
}
```
---
### Update profile picture &nbsp; `POST /account/profilepic/update`
>Example Request
```json
{
    "username": "someusername",
    "picture": {
        "base64": "data:image/jpeg;base64,/9j/4AAQ..."
    }
}
```
>Response
```json
{
    "username": "someusername",
    "picture": "data:image/jpeg;base64,/9j/4AAQ..."
}
```
---
### Get profile picture &nbsp; `POST /account/profilepic/get`
>Example Request
```json
{
    "username": "someusername"
}
```
>Response
```json
{
    "username": "someusername",
    "picture": "data:image/jpeg;base64,/9j/4AAQ..."
}
```
---
### Delete account &nbsp; `POST /account/delete`
>Example Request
```json
{
    "username": "someusername"
}
```
>Response
```json
{
    "username": ""
}
```
## 📷 Screenshots

### Home Page

![Home Page](https://i.gyazo.com/700c5cca25e3403f8f479a598ba9b708.png)

### User Page

![User Page](https://i.gyazo.com/96e6435b1bbd1d66719e41e111738628.png)

### Message Page

![Message Page](https://i.gyazo.com/5a23623d9f386a56c602168f9036e1d9.png)

## 🧰 Technologies Used

![programming languages](https://github.com/willwalker753/organizing-your-react-code/blob/master/teratext-technologies-used.jpg?raw=true)


## ⬇️ Install

```sh
npm install
```

## ✅ Usage

```sh
npm start
```

## 🧪 Run tests

```sh
npm test
```

## ✏️ Author

#### &nbsp;&nbsp;&nbsp;&nbsp;Will

* Website: https://willwalker.vercel.app/
* Github: [@willwalker753](https://github.com/willwalker753)
* LinkedIn: [@willdev](https://linkedin.com/in/willdev)
