const { Command, CommandError, SwitchbladeEmbed } = require('../../')
module.exports = class Render extends Command {
  constructor (client) {
    super({
      name: 'render',
      aliases: ['show'],
      category: 'utility',
      requirements: { guildOnly: true, botPermissions: ['EMBED_LINKS'] },
      parameters: [{
        type: 'messageLink',
        sameGuildOnly: true,
        forceExists: true,
        linkChannelUserPermission: ['VIEW_CHANNEL'],
        linkChannelBotPermission: ['VIEW_CHANNEL'],
        missingError: 'commands:move.missingMessageLink'
      }]
    }, client)
  }

  async run ({ author, t, message }, link) {
    const render = {}
    const { content } = link
    let messageHasNoEmbed = true

    if (link.attachments.size >= 1) {
      render.files = link.attachments.array()
    }

    if (link.embeds.length >= 1) {
      messageHasNoEmbed = false
      render.embed = link.embeds[0].toJSON()
    }

    if (Object.keys(render).length === 0 && !content) {
      throw new CommandError(t('errors:messageContainsNothing'))
    }

    try {
      if (messageHasNoEmbed) {
        console.log(link.guild)
        const embed = new SwitchbladeEmbed(author)
          .setAuthor(link.author.username, link.author.displayAvatarURL({ dynamic: true }))
        if (link.guild.members) {
          embed.setColor(link.guild.members.cache.get(author.id).displayHexColor)
        }

        if (content) {
          embed.setDescription(content)
        }

        render.embed = embed
      }

      message.channel.send({ embeds: [render] })
    } catch (e) {
      console.log(e)
      throw new CommandError(t('commands:move.couldntSendMessage'))
    }
  }
}
