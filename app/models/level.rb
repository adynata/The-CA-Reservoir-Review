# == Schema Information
#
# Table name: levels
#
#  id           :integer          not null, primary key
#  reservoir_id :integer          not null
#  date         :date             not null
#  level        :float            not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Level < ActiveRecord::Base
  belongs_to :reservoir

  def as_gallons
    return ( self.level * 325851.431889 )
  end


end
