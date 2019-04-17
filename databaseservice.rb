module DatabaseService
    def DatabaseService.downloadImage(file_path)
        download_path = "https://api.telegram.org/file/bot#{Config::TOKEN}/#{file_path}"
        file_name = file_path.split("/")[1]

        puts "Downloading: #{file_name}"

        File.open("./mif-express/public/images/#{file_name}", "wb") do |saved_file|
            open(download_path, "rb") do |read_file|
              saved_file.write(read_file.read)
            end
        end
        puts "Done downloading: #{file_name}"

    end
end
