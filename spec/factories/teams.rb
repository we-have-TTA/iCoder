FactoryBot.define do
  factory :team do
    name { Faker::Games::Pokemon.name }
    creator { create(:user) }
  end
end
