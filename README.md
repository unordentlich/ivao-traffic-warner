# ✈️ IVAO Traffic Warner

IVAO Traffic Warner is a Discord bot that monitors traffic at a specific airport on the [IVAO](https://www.ivao.aero/) network. It sends alerts in almost real-time via Discord direct messages whenever aircraft are inbound or outbound at your selected airport, displaying full airport location names for easier recognition.

![image](https://github.com/user-attachments/assets/cdbab0e6-43d7-4ae4-aa1b-f03c539fd92e)


## 🚀 Features

* ✅ Monitor inbound and outbound traffic at a selected ICAO airport
* 📍 Shows full airport location names for clarity of the aircrafts origin/destination
* 📩 Sends alerts directly to your Discord DM channel
* ⌚ Automatically stops after 2 hours of inactivity
* 🕒 Fetches for updates every 20 seconds (due to API fair-use limits)
* ⚙️ Simple command interface:

  * `/airport <ICAO>` – set your target airport
  * `/start` – begin traffic monitoring
  * `/stop` – end monitoring early

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/unordentlich/ivao-traffic-warner.git
cd ivao-traffic-warner
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🧹 Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2. Navigate to **"Bot"** in the sidebar and click **"Add Bot"**.
3. Choose a nice title and icon for your application :)
![image](https://github.com/user-attachments/assets/b683b319-7935-4c92-bfef-4f55d3ecf2aa)

4. Under **Installation > Installation Contexts**, set the "User Install" Method Checkbox to checked, the "Guild Install" Checkbox to false (Make also sure the Default Install Settings Scope is set to `applications.commands`) 
![image](https://github.com/user-attachments/assets/7c22bbd1-ef84-4fa7-81a6-2fc8300170f7)


5. You can then add the application to your discord account via the generated Install Link
![image](https://github.com/user-attachments/assets/70147ebe-e244-483c-a000-02b534846d2f)


6. Under **Bot > Token**, copy your bot token and add it to your `config.json`
```js
{
	"DISCORD_TOKEN": "bots_token_goes_here"
}
```

7. Now get the bot's client id at **General Information > Application ID** and add it to your `config.json`
```js
{
	"DISCORD_TOKEN": "bots_token_goes_here",
	"CLIENT_ID": "bots_client_id_goes_here"
}
```
*Note:* You can also use this client ID to get in the direct message chat with your application bot. Therefore, go into a web browser where you're logged in to discord and type in visit `https://discordapp.com/users/@bots_client_id_goes_here`. It will open the bots account so you can get into a DM with it to start using commands.

8. Now we're submitting the application's commands for a one-time registration to discord, so discord knows which commands it can offer for our bot application. Thus, open the temrinal in your project root directory and enter `node commands.js`.
![image](https://github.com/user-attachments/assets/acb5786e-6b6a-4c0c-93e0-ea5243473889) 

(*Note that this only works if you've set up the config.json correctly before*)

9. Finally you can start the bot by entering `node index.js` in your terminal. The bot should now respond to the commands.
![image](https://github.com/user-attachments/assets/9071d0a0-7e80-4bdf-a7b4-983d458f793c)


---

## 🧽 Usage

1. Open the discord bot's chat via the `https://discordapp.com/users/bots_client_id_goes_here` link
2. Send the command:

```bash
/airport EDDF
```

To set for example Frankfurt/Main Airport as your target.

https://github.com/user-attachments/assets/b4aa03b6-951b-4751-b527-e94aca6537a6




3. Start monitoring:

```bash
/start
```

https://github.com/user-attachments/assets/1da1d189-2b76-47ff-9c15-80b6bc5dc4fb



4. Stop anytime with:

```bash
/stop
```

https://github.com/user-attachments/assets/0da9bade-428b-4842-b799-e2796f6b47c2


Monitoring automatically ends after 2 hours of inactivity.

---

## 📡 Data Source

Traffic data is pulled from the official IVAO network using the [Whazzup V2 API](https://wiki.ivao.aero/en/home/devops/api/whazuup/how-to-retrieve-v2). Due to regulations, the update interval is set to 20 seconds. You can change this by updating the `INTERVAL_TIME` const in the index.js file

The `airports.json` data got fetched from the great project [openflights](https://github.com/jpatokal/openflights/blob/master/data/airports.dat) and converted programmatically into a JSON format.

---

## 🤝 Contributions

Pull requests and suggestions are welcome! Feel free to fork the repo and make your changes.

---

## ❓ Support
You can open issues if you have any kind of questions or problems. I will answer as soon as possible. :)
