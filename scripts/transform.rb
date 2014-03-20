require 'json'

f = File.open("backup_data.json", "r")
raw = f.read
f.close

json = JSON.parse(raw)


json["TABLA"]["REG"].each do |reg|
  lines = reg["Lines"].split("|")
  day = lines.select{|l| l=~ /^\d+$/}
  night = lines.select{|l| l !~ /^\d+$/}
  day = day.map(&:to_i).sort
  night = night.sort{|x, y| x.gsub(/[^\d]/, "").to_i <=> y.gsub(/[^\d]/, "").to_i}

  lines = (day + night).join(" | ")
  reg["Lines"] = lines
end


f = File.open("backup_data.json", "w")
f.write JSON.dump(json)
f.close
