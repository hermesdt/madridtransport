require 'json'
require 'active_support/core_ext/hash'
require 'net/http'
require 'geoutm'

resp = Net::HTTP.get_response(URI.parse "https://servicios.emtmadrid.es:8443/bus/servicebus.asmx/GetNodesLines?idClient=EMT.SERVICIOS.HERMES.CAVERN&passKey=32D1C2C1-F3C5-411E-A4A0-1B913C9F411D&Nodes=")
json = Hash.from_xml(resp.body).to_json
json = JSON.parse(json)

json["TABLA"]["REG"].each do |reg|
  utm = GeoUtm::UTM.new('30T', reg["PosxNode"].gsub(",", ".").to_f, reg["PosyNode"].gsub(",", ".").to_f)
  ll = utm.to_lat_lon
  reg["Latitude"] = ll.lat
  reg["Longitude"] = ll.lon
  reg.delete("PosxNode")
  reg.delete("PosyNode")
end

File.open("data.json", "w") {|f| f.write JSON.dump(json)}
