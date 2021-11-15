const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Shiba extends Command {
  constructor (client) {
    super({
      name: 'shiba',
      aliases: ['shibainu', 'doge']
    }, client)
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)

    const body = await fetch('http://shibe.online/api/shibes').then(res => res.json())
    embed.setDescription(`${t('commands:shiba.hereIsYourShiba')} 🐕`)
    embed.setImage(body[0])
    channel.send({ embeds: [embed] })
  }
}
