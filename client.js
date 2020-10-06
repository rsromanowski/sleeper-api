const fetch = require('node-fetch');
const fs = require('fs');

const client = {
  BASE_URL: 'https://api.sleeper.app/v1/',
  loggedIn: false,
  loggedInUser: null,
  token: null,

  getPlayers: async function () {
    let playerData = require('./data/players.json');
    console.log('updated: ' + playerData.updated_at);
    if (!playerData.updated_at || (Date.now() - 60 * 60 * 24 * 1000) > playerData.updated_at) {
      const endpoint = `players/nfl`;
      const url = `${this.BASE_URL}${endpoint}`;
      console.log(`url=${url}`);
      try {
        const res = await fetch(url);
        const data = await res.json();
        const json = {
          updated_at: Date.now(),
          data
        };
        fs.writeFileSync('./data/players.json', JSON.stringify(json));
        return json;
      } catch (err) {
        console.error(err)
      }
    } else {
      return playerData;
    }
  },
  getPlayer: function (player_id) {
    let playerData = require('./data/players.json').data;
    return playerData[`${player_id}`];
  },
  getTrendingAdds: async function (lookback_hours = 24, limit = 25) {
    const endpoint = `players/nfl/trending/add?lookback_hours=${lookback_hours}&${limit}=25`;
    try {
      const players = await this.fetchAndLog(endpoint, {});
      console.log(players);
      return players;
    } catch (err) {
      console.error(`ERROR: ${err}`);
    }
  },
  getTrendingDrops: async function (lookback_hours = 24, limit = 25) {
    const endpoint = `players/nfl/trending/drop?lookback_hours=${lookback_hours}&${limit}=25`;
    return await this.fetchAndLog(endpoint, {});
  },

  getUser: async function (username_or_id) {
    return await this.fetchAndLog(`user/${username_or_id}`, {})
  },
  getAvatar: async function (avatar_id, thumb = false) {
    await this.downloadFile(`https://sleepercdn.com/avatars/${(thumb ? 'thumbs/' : '')}${avatar_id}`, `./${avatar_id}${(thumb ? '-thumb' : '')}.png`)
  },

  getLeagues: async function (user_id, year) {
    const endpoint = `user/${user_id}/leagues/nfl/${year}`;
    return await this.fetchAndLog(endpoint, {})
  },
  getLeague: async function (league_id) {
    const endpoint = `league/${league_id}`;
    return await this.fetchAndLog(endpoint, {})
  },
  getLeagueRosters: async function (league_id) {
    const endpoint = `league/${league_id}/rosters`;
    return await this.fetchAndLog(endpoint, {})
  },
  getLeagueUsers: async function (league_id) {
    const endpoint = `league/${league_id}/users`;
    return await this.fetchAndLog(endpoint, {})
  },
  getLeagueMatchups: async function (league_id, week) {
    const endpoint = `league/${league_id}/matchups/${week}`;
    return await this.fetchAndLog(endpoint, {})
  },
  getLeagueTransactions: async function (league_id, week) {
    const endpoint = `league/${league_id}/transactions/${week}`;
    return await this.fetchAndLog(endpoint, {})
  },
  getLeagueTradedPicks: async function (league_id) {
    const endpoint = `league/${league_id}/traded_picks`;
    return await this.fetchAndLog(endpoint, {})
  },
  getLeagueDrafts: async function (user_id, year) {
    const endpoint = `league/${user_id}/drafts`;
    return await this.fetchAndLog(endpoint, {})
  },
  getLeagueWinnersBracket: async function (league_id) {
    const endpoint = `league/${league_id}/winners_bracket`;
    return await this.fetchAndLog(endpoint, {})
  },
  getLeagueLosersBracket: async function (league_id) {
    const endpoint = `league/${league_id}/losers_bracket`;
    return await this.fetchAndLog(endpoint, {})
  },
  //https://api.sleeper.app/v1/league/{{league_id}}/winners_bracket
  getDraft: async function (draft_id) {
    const endpoint = `draft/${draft_id}`;
    return await this.fetchAndLog(endpoint, {})
  },
  getDraftTradedPicks: async function (draft_id) {
    const endpoint = `draft/${draft_id}/traded_picks`;
    return await this.fetchAndLog(endpoint, {})
  },
  getDraftPicks: async function (draft_id) {
    const endpoint = `draft/${draft_id}/picks`;
    return await this.fetchAndLog(endpoint, {})
  },

  //https://api.sleeper.app/v1/draft/566864373253255168/traded_picks
  getUserDrafts: async function (user_id, year) {
    const endpoint = `user/${user_id}/drafts/nfl/${year}`;
    return await this.fetchAndLog(endpoint, {})
  },

  //https://api.sleeper.app/v1/user/{{ user_id }}/drafts/nfl/2020

  // === Helpers ===

  fetchAndLog: async function (endpoint, options) {
    const url = `${this.BASE_URL}${endpoint}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(`ERROR: ${err}`);
    }
  },

  login: async function (username, password) {
    const body = {
      "operationName": "login_query",
      "variables": {
        "email_or_phone_or_username": username, "password": password
      },
      "query": `query login_query($email_or_phone_or_username: String!, $password: String) {
login(email_or_phone_or_username: $email_or_phone_or_username, password: $password) {
        token
        avatar
        cookies
        created
        display_name
        real_name
        email
        notifications
        phone
        user_id
        verification
        data_updated
      }
    }`
    };

    const url = `https://sleeper.app/graphql`;

    try {
      const res = await fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      const json = await res.json();
      this.token = json.data.login.token;
      this.loggedInUser = json.data.login;
      this.loggedIn = true;
      return json;
    } catch (err) {
      console.error(`ERROR: ${err}`);
      this.loggedIn = false;
      this.loggedInUser = null;
      this.token = null;
    }
  },
  logout: function () {
    this.loggedIn = false;
    this.loggedInUser = null;
    this.token = null;
  },
  getMessages: async function (league_id) {
    if (!this.token) throw Error("Not logged in");
    const query = `query messages {
      latest: messages(parent_id: "${league_id}") {
        attachment
        author_avatar
        author_display_name
        author_real_name
        author_id
        author_is_bot
        author_role_id
        created
        edited
        message_id
        parent_id
        parent_type
        pinned
        reactions
        user_reactions
        text
        text_map
      }
      last_read: messages(parent_id: "${league_id}", before: "618485834944962560", order_by: "asc") {
        attachment
        author_avatar
        author_display_name
        author_real_name
        author_id
        author_is_bot
        author_role_id
        created
        edited
        message_id
        parent_id
        parent_type
        pinned
        reactions
        user_reactions
        text
        text_map
      }
    }`;
    return await this.fetchGraphQL('messages', {}, query);
  },
  reactToMessage: async function (league_id, message_id, reaction) {
    const query = `mutation create_reaction {
      create_reaction(message_id: "${message_id}", parent_id: "${league_id}", reaction: "${reaction}"){
        message_id
        parent_id
        reaction
        reactor_avatar
        reactor_display_name
        reactor_id
      }
    }`;
    return this.fetchGraphQL('create_reaction', {}, query);
  },
  unreactToMessage: async function (league_id, message_id, reaction) {
    const query = `mutation delete_reaction {
      delete_reaction(message_id: "${message_id}", parent_id: "${league_id}", reaction: "${reaction}"){
        message_id
        parent_id
        reaction
        reactor_avatar
        reactor_display_name
        reactor_id
      }
    }`;
    return this.fetchGraphQL('delete_reaction', {}, query);
  },

  fetchGraphQL: async function (operationName, variables, query) {
    try {
      const res = await fetch("https://sleeper.app/graphql", {
        "method": "POST",
        "headers": {
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.5",
          "content-type": "application/json",
          "authorization": this.token
        },
        "body": JSON.stringify({
          query,
          variables,
          operationName
        })
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
    }
  },
  downloadFile: async function (url, path) {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", (err) => {
        reject(err);
      });
      fileStream.on("finish", function () {
        resolve();
      });
    });
  }
};

module.exports = client;