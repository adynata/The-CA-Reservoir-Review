# == Schema Information
#
# Table name: monthly_averages
#
#  id           :integer          not null, primary key
#  reservoir_id :integer          not null
#  date         :date             not null
#  level        :float            not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

require 'test_helper'

class MonthlyAverageTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
