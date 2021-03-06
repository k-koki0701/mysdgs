class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_many :goods, dependent: :destroy
  has_many :participations, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :messages, dependent: :destroy
  has_many :event_messages, dependent: :destroy
  has_many :events, foreign_key: :owner_id
  has_many :active_relationships, foreign_key: 'follower_id', class_name: 'Relationship', dependent: :destroy
  has_many :passive_relationships, foreign_key: 'followed_id', class_name: 'Relationship', dependent: :destroy
  has_many :following, through: :active_relationships, source: :followed
  has_many :followers, through: :passive_relationships, source: :follower
  mount_uploader :icon, IconUploader

  validates :name, presence: true

  def follow!(other_user)
    active_relationships.create!(followed_id: other_user.id)
  end

  def following?(other_user)
    active_relationships.find_by(followed_id: other_user.id)
  end

  def unfollow!(other_user)
    active_relationships.find_by(followed_id: other_user.id).destroy
  end

  def self.guest
    find_or_create_by!(email: 'guest@example.com') do |user|
      user.name = 'ゲスト'
      user.password = SecureRandom.urlsafe_base64
    end
  end

  def self.admin_guest
    find_or_create_by!(email: 'admin_guest@example.com') do |user|
      user.name = 'ゲスト管理者'
      user.password = SecureRandom.urlsafe_base64
      user.admin = 'true'
    end
  end

  def already_liked?(post)
    goods.exists?(post_id: post.id)
  end

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable
end
