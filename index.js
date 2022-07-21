/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

const { Plugin } = require('powercord/entities');
const { findInReactTree } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');

module.exports = class QuickNo extends Plugin {
  async startPlugin () {
    const classes = {
      ...await getModule([ 'icon', 'isHeader' ]),
      ...await getModule([ 'button', 'separator', 'wrapper' ])
    };
    const reactionManager = await getModule([ 'addReaction' ]);
    const MiniPopover = await getModule(m => m.default && m.default.displayName === 'MiniPopover');
    inject('no-button', MiniPopover, 'default', (_, res) => {
      const props = findInReactTree(res, r => r && r.canReact && r.message);
      if (!props || props.message.reactions.find(r => r.emoji.name === '👎' && r.me)) {
        return res;
      }

      res.props.children.unshift(React.createElement(
        'div', {
          className: classes.button,
          onClick: () => reactionManager.addReaction(props.channel.id, props.message.id, {
            animated: false,
            name: '👎',
            id: null
          })
        },
        React.createElement('img', {
          className: `emoji ${classes.icon}`,
          src: '/assets/66e3cbf517993ee5261f23687a2bc032.svg'
        })
      ));
      return res;
    });
    MiniPopover.default.displayName = 'MiniPopover';
  }

  pluginWillUnload () {
    uninject('no-button');
  }
};
