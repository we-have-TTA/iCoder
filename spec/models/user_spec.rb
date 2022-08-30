require 'rails_helper'

RSpec.describe User, type: :model do
  
  context 'with invitation' do
    it 'belongs to that team' do
      t1 = create(:team)
      u1 = create(:user, team: t1)
      expect(u1.team).to eq t1
    end
  end

  context 'without invitation' do
    it 'User belongs to the team that name is user\'s username.' do
      u2 = create(:user)
      expect(u2.team.name).to eq u2.username
    end
  end
end
