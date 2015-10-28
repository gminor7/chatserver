# Chat APP

This an example Chat app


## Run

```
node index.js
```
UI available at _http://localhost:3010/chat


##Todos

* Have the Servers sync up current chats on launch
  * Key each message to be able to move the store from one server to another.
  * queue messages until the store is done transfering and then pipe in new messages that took place after that.
  * compare distributed store to local store and change accordingly
* Distribute usernames with User.enterRoom()
* Implement a DM feature
  * Keep a store of remote users by serverId
  * Publish a message to the correct server or send out locally if on same server
* UI show list of users in accordian when entering room. 
* UI have different colors for each user

