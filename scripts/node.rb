require 'json'
require 'net/http'

resp = Net::HTTP.get_response URI.parse('https://servicios.emtmadrid.es:8443/bus/servicebus.asmx/GetNodesLines?idClient=EMT.SERVICIOS.HERMES.CAVERN&passKey=32D1C2C1-F3C5-411E-A4A0-1B913C9F411D&Nodes=')
puts resp.body

