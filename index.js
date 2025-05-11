const https = require('https')

const airports = require('./airports.json')

var tracks = new Map()
var interval = null
const INTERVAL_TIME = 20000 // 15 seconds
const INACTIVE_TIME = 1000 * 60 * 60 * 2 // 2 hours

function searchAirport(code) {
    return airports.find((airport) => airport.icao == code)
}

function informAboutTraffic(flights, member) {

    if (flights.length == 0) {
        console.log("No flights found")
        return
    }
    var message = "🚀 New flights found:\n"

    var inbound = flights.filter((flight) => flight.flightPlan.arrivalId == tracks.get(member).airport)
    var outbound = flights.filter((flight) => flight.flightPlan.departureId == tracks.get(member).airport)

    if (inbound.length > 0) {
        message += `\n\n🛬 **Inbound**\n`
        for (i in inbound) { // Outbound flights
            var flight = inbound[i]
            message += `- **${flight.callsign}** (${flight.flightPlan.departureId} (${searchAirport(flight.flightPlan.departureId).city}) → ${flight.flightPlan.arrivalId})\n`
        }
    }

    if (outbound.length > 0) {
        message += `\n\n🛫 **Outbound**\n`
        for (i in outbound) { // Outbound flights
            var flight = outbound[i]
            message += `- **${flight.callsign}** (${flight.flightPlan.departureId} → ${flight.flightPlan.arrivalId}  (${searchAirport(flight.flightPlan.arrivalId).city})) `

            const departureTime = new Date(flight.flightPlan.departureTime * 1000)

            message += `→ *Departure*: ${departureTime.getUTCHours()}:${departureTime.getUTCMinutes()}\n`
        }
    }

    message += `\n\n📡 ${flights.length} flights found!`

    member.send(message)
}

function fetchNewWhazzup() {
    console.log("Fetching new whazzup data, checking for " + tracks.size + " members")
    var str = ''
    https.get('https://api.ivao.aero/v2/tracker/whazzup', function (response) {
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            checkAndNotifyIfNewContact(str)
        });
    }).end()
}

function checkAndNotifyIfNewContact(json) {
    var pilots = JSON.parse(json).clients.pilots
    for (const [key, value] of tracks) {
        if (value.since && new Date() - value.since > INACTIVE_TIME) {
            console.log("User " + key + " is inactive, removing from tracking list")
            key.send("🕒 You're connected for more than 2 hours now, the service thus got terminated.")
            tracks.delete(key)
            continue
        }

        var correspondingFlights = filterHomeAirportFligths(pilots, value.airport)
        var newFlights = []
        for (i in correspondingFlights) {
            var flight = correspondingFlights[i]
            if (!value.identified.includes(flight.callsign)) {
                value.identified.push(flight.callsign)
                newFlights.push(flight)
            }
        }
        if (newFlights.length > 0) {
            informAboutTraffic(newFlights, key)
        }
    }
}

function filterHomeAirportFligths(json, airport) {
    return json.filter((any) => {
        return (any.flightPlan && any.flightPlan.departureId && any.flightPlan.departureId == airport || any.flightPlan && any.flightPlan.arrivalId && any.flightPlan.arrivalId == airport)
    })
}

const { Client, Events, GatewayIntentBits, Collection, ActivityType, PresenceUpdateStatus } = require('discord.js');
const { DISCORD_TOKEN } = require('./config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    status: PresenceUpdateStatus.Online
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);
    client.user.setPresence({
        activities: [
            {
                name: 'Unicom',
                type: ActivityType.Watching
            }
        ],
        status: PresenceUpdateStatus.Online
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    const member = interaction.user;

    if (commandName === 'start') {
        if (!tracks.has(member)) {
            await interaction.reply('❌ Please set an airport first!');
            return;
        }

        if (!interval) {
            interval = setInterval(() => {
                fetchNewWhazzup()
            }, INTERVAL_TIME);
        }

        await interaction.reply('🟢 Service started!');
    } else if (commandName === 'stop') {
        tracks.delete(member)
        if (interval && tracks.size == 0) {
            clearInterval(interval);
            interval = null;
        }
        await interaction.reply('🔴 Service stopped!');
    } else if (commandName === 'airport') {
        var setValue = interaction.options.getString('code').toUpperCase();
        if (setValue.length != 4) {
            await interaction.reply('❌ Invalid ICAO-Code! Please enter a valid ICAO-Code (4 characters).');
            return;
        }
        trackingAirport = setValue;
        if (tracks.has(member)) {
            tracks.get(member).airport = setValue
            tracks.get(member).identified = []
            tracks.get(member).since = new Date()
        } else {
            tracks.set(member, { airport: setValue, identified: [], since: new Date() });
        }
        await interaction.reply(`🛫 Now tracking traffic for **${trackingAirport}**. Use \`/start\` to beginn the tracking.`);
    }
});

// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);