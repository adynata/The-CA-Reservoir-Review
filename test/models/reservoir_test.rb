# == Schema Information
#
# Table name: reservoirs
#
#  id                :integer          not null, primary key
#  name              :string           not null
#  hydrologic_area   :string           not null
#  river_basin       :string
#  station_id        :string           not null
#  location          :string           not null
#  max_capacity      :integer          not null
#  county            :string           not null
#  lat               :string           not null
#  lon               :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  elevation         :integer          not null
#  operator          :string
#  averages_by_month :hstore           default({}), not null
#

require 'test_helper'

class ReservoirTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
