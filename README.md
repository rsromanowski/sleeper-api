JavaScript wrapper for Sleeper APIs

### Sleeper's API
#### Official API
Sleeper has an [official API](https://docs.sleeper.app/). Currently, they are all (delicately) implemented. 

#### Unofficial API
Sleeper also has a "GraphQL" API that the site uses to add players, chat, etc.
This is undocumented. And all functionality I'm pulling into my Insomnia client as I click around and capture requests in my browser's DevTools.
This is the more useful one, but requires login, then use the token on subsequent requests

### Next steps
- Implement all (discovered) functionality
- Document
- Publish as npm package

### Setup
If you want, you can create a .env with your USERNAME and PASSWORD to used with login.

### Data
The data folder contains a players.json file that is created from their players endpoint. This is only called daily to limit the load on their API per Sleeper's request.
