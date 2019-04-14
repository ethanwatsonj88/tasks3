defmodule Tasks3.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string, null: false
      add :password_hash, :string, null: false
      add :manager, :boolean, default: false, null: false


      timestamps()
    end

    create unique_index(:users, [:email])

  end
end
