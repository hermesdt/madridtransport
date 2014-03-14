require 'json'
require 'active_support/core_ext/hash'
require 'net/http'
require 'geoutm'
require 'nokogiri'

resp = Net::HTTP.get_response(URI.parse "https://servicios.emtmadrid.es:8443/bus/servicebus.asmx/GetNodesLines?idClient=EMT.SERVICIOS.HERMES.CAVERN&passKey=32D1C2C1-F3C5-411E-A4A0-1B913C9F411D&Nodes=")
json = Hash.from_xml(resp.body).to_json
json = JSON.parse(json)

def fetch_gps(node_id)
  url = "https://servicios.emtmadrid.es:8443/geo/servicegeo.asmx/getStopsFromStop?idClient=EMT.SERVICIOS.HERMES.CAVERN&passKey=32D1C2C1-F3C5-411E-A4A0-1B913C9F411D&Radius=0&idStop=ID_STOP&statistics=&cultureInfo="
  resp = Net::HTTP.get_response(URI.parse(url.gsub("ID_STOP", node_id.to_s)))
  xml = Nokogiri::XML(resp.body)
  stop = xml.css("Stop")[0]
  loc = {"Longitude" => stop.css("CoordinateX")[0].text, "Latitude" => stop.css("CoordinateY")[0].text}
  puts "Done for node_id: #{node_id}"
  {"Node" => stop.css("IdStop")[0].text, "Name" => stop.css("Name")[0].text, "Loc" => loc}
end

f = File.open("data.json", "w")
regs = json["TABLA"]["REG"].map do |reg|
  begin
    result = fetch_gps(reg["Node"])
    f.puts JSON.dump(result)
    f.flush
    result
  rescue Exception => e
    puts "Error: #{reg["Node"]}"
    puts e.to_s
    puts e.backtrace.join("\n")
    retry
    nil
  end
end
f.close

json["TABLA"]["REG"] = regs

File.open("data.json", "w") {|f| f.write JSON.dump(json)}

