# require 'csv'
#
# desc "Import levels from csv file"
# task :import, [:filename] => :environment do
#
#   file = "db/ORO.csv"
#
#   data = CSV.read(file)[2 .. -1]
#   data.each do |row|
#         p row[0].to_date
#         Level.create!({
#         station_id: "ORO",
#         level: row[3],
#         date: row[0],
#
#       })
#   end
#
# end
