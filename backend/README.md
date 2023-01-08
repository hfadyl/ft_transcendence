yarn

## Running the app

```bash
#Run
$ yarn run db:dev:restart

$ yarn run start:dev

# you can check auth
- localhost:8000/api/auth/42/login
```

## Routes:

```bash

# Auth

-Route:  "http://localhost:8000/api/auth/42/login" to login with 42

-Route: "http://localhost:8000/api/auth/42/redirect" 42-passport redirect from login to this route, then it will redirect to the frontend

-Route: "http://localhost:8000/api/auth/42/logout" to logout and redirect to the frontend

-Route: "http://localhost:8000/api/2fa/generate" to generate the secret and the QR code

-Route: "http://localhost:8000/api/2fa/turn-on" to validate the code and turn on the 2fa

-Route: "http://localhost:8000/api/2fa/authenticate" to validate the code and authenticate the user

-Route: "http://localhost:8000/api/users/me" to get the current user info

-Route: "http://localhost:8000/api/users/updateUsername" to update the userName

-Route: "http://localhost:8000/api/users/searchUserbyUsername" to search a user by userName

-Route: "http://localhost:8000/api/users/getallUsers" to get username and avatar of all users

-Route: "http://localhost:8000/api/users/getUser" to get user info by username

-Route: "http://localhost:8000/api/users/uploadAvatar" to upload avatar

-Route: "http://localhost:8000/api/users/Status" to get the status of the user

-Route: "http://localhost:8000/api/users/Wins" to get the wins of the user

-Route: "http://localhost:8000/api/users/Losses" to get the losses of the user

-Route: "http://localhost:8000/api/users/Level" to get the level of the user

-Route: "http://localhost:8000/api/users/Score" to get the score of the user

-Route: "http://localhost:8000/api/users/deleteUser" to delete the user

-Route: "http://localhost:8000/api/users/updateEmail" to update the email

-Route: "http://localhost:8000/api/users/updatefullName" to update the fullName

-Route: "http://localhost:8000/api/users/updatePhoneNumber" to update phone number

-Route: "http://localhost:8000/api/users/updateCountry" to update country

-Route: "http://localhost:8000/api/users/sendFriendRequest" to send a friend request

-Route: "http://localhost:8000/api/users/acceptfriendrequest" to accept a friend request

-Route: "http://localhost:8000/api/users/unFriend" to unfriend a friend

-Route: "http://localhost:8000/api/users/declineFriendRequest" to decline a friend request

-Route: "http://localhost:8000/api/users/getFriendRequests" to get the friend requests of the user

-Route: "http://localhost:8000/api/users/getFriends" to get the friends of the user

-Route: "http://localhost:8000/api/users/getFriendbyUsername" to get the friend by username

-Route: "http://localhost:8000/api/users/blockUser" to block a user

-Route: "http://localhost:8000/api/users/getblockedUsers" to get the blocked users of the user

-Route: "http://localhost:8000/api/users/cancelFriendRequest" to cancel a friend request

-Route: "http://localhost:8000/api/users/upload" to upload a file

-Route: "http://localhost:8000/api/2fa/disable2fa" to disable the 2fa

-Route: "http://localhost:8000/api/users/getUserById/:id" to get user by id in param

-Route: "http://localhost:8000/api/users/pictures/:filename" to get avatar


# Chat

-Route Post: "http://localhost:8000/api/chat/createRoom" to create room takes body: name, state, participants, password

-Route Post: "http://localhost:8000/api/chat/joinRoom" to join a room takes body: roomid

-Route Post: "http://localhost:8000/api/chat/makeUserAdmin" to make user an admin takes body: roomid, userid

-Route Post: "http://localhost:8000/api/chat/unmakeUserAdmin" to unmake user an admin takes body: roomid, userid

-Route Post: "http://localhost:8000/api/chat/makeUserOwner" to make user an owner takes body: roomid, userid

-Route Post: "http://localhost:8000/api/chat/unmakeUserOwner" to unmake user an owner takes body: roomid, userid

-Route Get: "http://localhost:8000/api/chat/getRooms" to get rooms

-Route Post: "http://localhost:8000/api/chat/addUserToRoom" to add user to a room takes body: roomid, userid

-Route Post: "http://localhost:8000/api/chat/banUser" to ban user from a room takes body: roomid, userid

-Route Post: "http://localhost:8000/api/chat/unbanUser" to unban user from a room takes body: roomid, userid

-Route Post: "http://localhost:8000/api/chat/muteUser" to mute user from a room takes body: roomid, userid

-Route Post: "http://localhost:8000/api/chat/unMuteUser" to unmute user from a room takes body: roomid, userid

-Route Post: "http://localhost:8000/api/chat/changePassword" to change password of a room takes body: roomid, password

-Route Delete: "http://localhost:8000/api/chat/leaveRoom" to leave room takes body: roomid

-Route Delete: "http://localhost:8000/api/chat/removeUser" to remove user from a room takes body: roomid, userid

-Route Delete: "http://localhost:8000/api/chat/deletRoom" to delete a room takes body: roomid

-Route Get: "http://localhost:8000/api/chat/getMessages" to get messages of a room takes body: roomid


## you can see all the routes in swagger
http://localhost:8000/docs





```
