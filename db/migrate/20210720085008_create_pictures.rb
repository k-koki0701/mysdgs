class CreatePictures < ActiveRecord::Migration[5.2]
  def change
    create_table :pictures do |t|
      t.text :image
      t.references :post, foreign_key: true

      t.timestamps
    end
  end
end
