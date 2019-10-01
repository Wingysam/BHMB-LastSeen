(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@bhmb/bot')) : typeof define === 'function' && define.amd ? define(['@bhmb/bot'], factory) : (factory(global['@bhmb/bot']));
}(this, (function(bot) {
    const MessageBot = bot.MessageBot;
    MessageBot.registerExtension('xyz.wingysam.lastseen', function(ex, world) {
      function ajax(url, data) {
        return fetch(
          url,
          {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-cache',
            headers: {
              'content-type': 'application/json'
            },
            mode: 'cors'
          }
        ).then(response => response.json());
      }
      world.addCommand('where', (player, args) => {
        var data = {
            author: player.name,
            player: args
        };
        ajax(
          `https://lastseen.bh.wingysam.xyz/api/where/${encodeURIComponent(data.player)}`,
          {
            author: data.author
          }
        ).then(res => {
          if (res.error) {
            ex.bot.send(`error: ${res.error}`);
          } else {
            ex.bot.send(`${args.toUpperCase()} was last seen in ${res.world.name} by ${res.world.owner} on ${res.date}`);
          }
        }).catch(err => { throw err });
      });
      world.addCommand('hide', (player, args) => {
        ajax(
          `https://lastseen.bh.wingysam.xyz/api/hide/${encodeURIComponent(player.name)}`,
          {}
        ).then(res => {
          if (res.error) {
            ex.bot.send(`error: ${res.error}`);
          } else {
            ex.bot.send('You are now hiding.')
          }
        }).catch(err => { throw err; });
      });
      let onJoin = player => {
        world.getOverview().then(worldOverview => {
          ajax(
            `https://lastseen.bh.wingysam.xyz/api/seen/${encodeURIComponent(player.name)}`,
            {
              world: worldOverview
            }
          ).then(res => {
            if (res.error) ex.bot.send(`error: ${res.error}`);
          }).catch(err => { throw err; });
        });
      }
      world.onJoin.sub(onJoin);
      ex.remove = function() {
          world.removeCommand('where');
          world.removeCommand('hide');
          world.onJoin.unsub(onJoin);
      }
  });
})));
