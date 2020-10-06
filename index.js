require('dotenv').config();
const client = require('./client');

(async function () {
  // client.getPlayers();

  // const players = await client.getTrendingAdds();
  // console.log(players.map(p => client.getPlayer(p.player_id)));
  // client.getTrendingDrops();
  let user = await client.getUser(process.env.USERNAME)
  // console.log(await client.getUser(user.user_id));
  // client.getAvatar(user.avatar);
  // client.getAvatar(user.avatar, true);
  const leagues = await client.getLeagues(user.user_id, 2020);
  let league_id = '500017762018521088'; //leagues[0].league_id;
  // console.log(leagues);
  // const league = await client.getLeague(leagues[0].league_id);
  // console.log(league.name);
  // const rosters = await client.getLeagueRosters(league_id);
  // console.log(rosters);
  // const users = await client.getLeagueUsers(lleague_id);
  // console.log(users.map(u => u.display_name));
  // const matchups = await client.getLeagueMatchups(league_id, 4);
  // console.log(`${matchups[0].points} points`);
  // const transactions = await client.getLeagueTransactions(league_id, 4);
  // console.log(transactions[0]);
  // const tradedPicks = await client.getLeagueTradedPicks(league_id);
  // console.log(tradedPicks[0]);
  // const drafts = await client.getUserDrafts(process.env.USER_ID, 2020);
  // console.log(drafts[0]);
  // const leagueDrafts = await client.getLeagueDrafts(league_id, 2020);
  // const { draft_id } = leagueDrafts[0];
  // const draftTradedPicks = await client.getDraftTradedPicks(draft_id);
  // console.log(draftTradedPicks);
  // const draftPicks = await client.getDraftPicks(draft_id);
  // console.log(draftPicks[0]);
  //const draft = await client.getDraft(draft_id);
  //console.log(draft);
  // const wBracket = await client.getLeagueWinnersBracket(league_id);
  // console.log(wBracket);
  // const lBracket = await client.getLeagueLosersBracket(league_id);
  // console.log(lBracket);
  // const messages = client.getMessages(league_id);
  // console.log(messages[0]);

  const res = await client.login(process.env.USERNAME, process.env.PASSWORD);
  const messages = await client.getMessages(league_id);
  console.log(messages.data.latest[0]);
  const message_id = messages.data.latest[0].message_id;
  client.unreactToMessage(league_id, message_id, 'like');
}());