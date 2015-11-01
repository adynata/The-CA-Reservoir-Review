# 
#
# desc "count number of records in given model table"
# task :make_monthly_averages, [:model] => :environment do |t, args| # task with both arguments and dependency
#   args.with_defaults(:model => "Level" )
#   model_class_name = Object.const_get(args.model) # this is very important as when you#pass argument it come as a string, so you must CONVERT it to model class
#
#   puts "No of records is #{model_class_name.count}"
# end
