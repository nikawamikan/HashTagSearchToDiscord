const Twitter = require('twitter');
const { WebhookClient } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');

const conf = yaml.load(fs.readFileSync('config.yml', 'utf8'));

const webhook = new WebhookClient(conf.webhook);

const client = new Twitter(conf.twitter);

const main = async() =>{
    const stream = await client.stream('statuses/filter',{ 'track': '#ふぃぼ鯖' });
    stream.on('data', async data =>{

        const url = `https://twitter.com/${data.user.screen_name}/status/${data.id_str}`;

        await webhook.send({
            content: url, // 普通にコンテンツ
            username: data.user.name, // WebHookのアイコンをオーバーライド
            avatarURL: data.user.profile_image_url_https, // WebHookの名前をオーバーライド
        });
        
    });

    stream.on('error', async error =>{
        await console.log(error);
    });

}

main();
