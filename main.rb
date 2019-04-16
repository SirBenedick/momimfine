require 'telegram/bot'
require 'open-uri'

require_relative 'config'
require_relative 'databaseservice'

standard_respone = "Um ein Foto zu senden schreibe /photo"

Telegram::Bot::Client.run(Config::TOKEN) do |bot|
  bot.listen do |message|
    puts "#{message.chat.id}: #{message}"

    case message.text
    when '/start'
        new_message = "Hallo, #{message.from.first_name},\n#{standard_respone}"
        bot.api.send_message(chat_id: message.chat.id, text: new_message)
    when '/stop'
      bot.api.send_message(chat_id: message.chat.id, text: "Bye, #{message.from.first_name}")
    else 
        if message.photo.any?
            file_id = bot.api.get_file(file_id: message.photo[0].file_id)
            file_path = file_id["result"]["file_path"]

            DatabaseService.downloadImage(file_path)
        else
            bot.api.send_message(chat_id: message.chat.id, text: standard_respone)
        end
    end
  end
end

## To-Do
# Download File not just compressed image
# Insert Download to Database
