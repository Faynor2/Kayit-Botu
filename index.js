
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot 7/24 Aktif!'));
app.listen(process.env.PORT || 3000);

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// AYARLAR - Tokeni buraya YAZMA, Render üzerinden ekleyeceğiz
const TOKEN = process.env.TOKEN; 
const KAYIT_ROL_ID = '1215694110959345734'; // Bu ID kalabilir, sorun yok

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} giriş yaptı!`);
});

client.on('messageCreate', async (message) => {
    // Sadece ".kayıt" ile başlayan ve bot olmayan mesajları dinle
    if (message.content.startsWith('.kayıt') && !message.author.bot) {
        
        const args = message.content.split(' ');
        const isim = args[1];
        const yas = args[2];

        // Eksik bilgi kontrolü
        if (!isim || !yas) {
            return message.reply('❌ Yanlış kullanım! Doğrusu: `.kayıt İsim Yaş`');
        }

        try {
            // KRİTİK KONTROL: Sunucu sahibiysen bot senin ismini DEĞİŞTİREMEZ
            if (message.guild.ownerId === message.author.id) {
                // Sadece rol vermeyi dene, isim değiştirmeyi atla
                await message.member.roles.add(KAYIT_ROL_ID);
                return message.reply('⚠️ Sunucu sahibi olduğun için ismini değiştiremedim ama rolünü verdim!');
            }

            // Normal üyeler için hem isim değiştir hem rol ver
            await message.member.setNickname(`${isim} | ${yas}`);
            await message.member.roles.add(KAYIT_ROL_ID);

            message.reply(`✅ Kayıt başarılı! Hoş geldin **${isim}**.`);
            
        } catch (error) {
            console.error('Hata Detayı:', error.message);
            // Hatayı daha detaylı görmek için mesajı güncelledik:
            message.reply(`❌ Bir hata oluştu! Hata Mesajı: \`${error.message}\``);
        }
    }
});

client.login(TOKEN);

// ... (üstteki express ve client ayarları aynı kalsın)

const KAYIT_KANAL_ID = '1215674267312853034'; // Sadece bu kanalda çalışacak

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('.kayıt') && !message.author.bot) {
        
       // Kanal kontrolü
        if (message.channel.id !== KAYIT_KANAL_ID) {
            message.reply(`❌ Bu komutu sadece <#${1215674267312853034}> kanalında kullanabilirsin!`)
                .then(msg => setTimeout(() => msg.delete(), 5000));
            return; // <--- Bu satır, yanlış kanalsa kodun aşağıya devam etmesini ENGELLER.
        }

        const args = message.content.split(' ');
        const isim = args[1];
        const yas = args[2];

        if (!isim || !yas) {
            return message.reply('❌ Yanlış kullanım! Doğrusu: `.kayıt İsim Yaş`');
        }

        try {
            // Sunucu sahibi kontrolü
            if (message.guild.ownerId === message.author.id) {
                await message.member.roles.add(KAYIT_ROL_ID);
                return message.reply('⚠️ Sunucu sahibi olduğun için ismini değiştiremedim ama rolünü verdim!');
            }

            await message.member.setNickname(`${isim} | ${yas}`);
            await message.member.roles.add(KAYIT_ROL_ID);
            message.reply(`✅ Kayıt başarılı! Hoş geldin **${isim}**.`);
            
        } catch (error) {
            console.error('Hata:', error.message);
            message.reply('❌ Yetki hatası! Botun rolü üyenin veya verilecek rolün altında olabilir.');
        }
    }
});

client.login(TOKEN);


